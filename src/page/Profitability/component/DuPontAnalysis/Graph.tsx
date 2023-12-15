import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig, labelDataSets } from "./GrapConfig";
import { getDataLimit } from "until";
import { fetchBalanceSheetStatement, fetchProfitRatio } from "api/profitrato";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import {
  IDuPontAnalysisGraph1,
  IDuPontAnalysisGraph2,
} from "types/profitability";
import PeriodController from "component/PeriodController";
import type { Chart } from "chart.js";
import moment from "moment";
import { fetchDanYiGongSiAnLi } from "api/financial";
import { caseDateToYYYYMMDD, formatNumberFromCompanyCase } from "until";
import { keyBy } from "lodash";

interface IComposedData {
  netProfitMargin: number;
  assetTurnover: number;
  equityMultiplier: number;
  returnOnEquity: number;
  date: string;
  period: string;
  calendarYear: string;
}

export const GRAPH_FIELDS = [
  {
    field: "netProfitMargin",
    headerName: "稅後淨利率",
  },
  {
    field: "assetTurnover",
    headerName: "總資產週轉",
  },
  {
    field: "equityMultiplier",
    headerName: "權益乘數",
  },
  {
    field: "returnOnEquity",
    headerName: "ROE",
  },
];

const QUARTER_TO_DATE: Record<string, string> = {
  Q1: "01-01",
  Q2: "04-01",
  Q3: "07-01",
  Q4: "10-01",
};

export default function Graph({
  getGraphData,
}: {
  getGraphData: (data: any[][]) => void;
}) {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  const updateGraph = (data: IComposedData[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof IComposedData] * 100
          );
        }
      });
      chartRef.current.update();
    }
  };

  const genGraphTableData = <T extends IComposedData>(data: T[]) => {
    if (data.length === 0) {
      return [[], []];
    }
    const rowData: any[] = [];
    const columnHeaders: any[] = [
      {
        field: "title",
        headerName: reportType === PERIOD.QUARTER ? "年度/季度" : "年度",
        pinned: "left",
      },
    ];

    data?.forEach((item) => {
      columnHeaders.push({
        field:
          reportType === PERIOD.QUARTER
            ? `${item.calendarYear}-${item.period}`
            : item.calendarYear,
      });
    });

    GRAPH_FIELDS.forEach(({ field, headerName }) => {
      const dataSources: { [key: string]: any } = {
        title: headerName,
      };
      data?.forEach((item) => {
        if (reportType === PERIOD.ANNUAL) {
          dataSources[item.calendarYear] = (
            +item[field as keyof T] * 100
          ).toFixed(2);
        } else {
          dataSources[`${item.calendarYear}-${item.period}`] = (
            +item[field as keyof T] * 100
          ).toFixed(2);
        }
      });
      rowData.push(dataSources);
    });
    return [columnHeaders, rowData];
  };

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(reportType, period);
    const [data1, data2, data3] = await Promise.all([
      fetchProfitRatio<IDuPontAnalysisGraph1[]>(
        stock.Symbol,
        reportType,
        limit
      ),
      fetchBalanceSheetStatement<IDuPontAnalysisGraph2[]>(
        stock.Symbol,
        PERIOD.QUARTER,
        limit
      ),
      fetchDanYiGongSiAnLi({
        securityCode: stock.No,
        yearRange: moment()
          .subtract(period + 1, "year")
          .format("YYYY"),
        size: (period + 1) * 4,
      }),
    ]);
    if (data1 && data2 && data3) {
      const caseOriginalData =
        data3?.list.map(({ tables, year, quarter }) => {
          const comprehensiveIncomeTable = tables.find(
            ({ name }) => name === "綜合損益表"
          );
          const comprehensiveIncomeData =
            comprehensiveIncomeTable?.data
              .map(({ date, ...data }) => {
                return {
                  ...data,
                  ...caseDateToYYYYMMDD(date),
                };
              })
              .sort((a, b) => (a.start > b.start ? -1 : 1)) || [];
          const allRevenue = comprehensiveIncomeData.filter(
            ({ code, name }) =>
              code === "4000" || name === "營業收入-營業收入合計"
          );

          const allNetIncomeAfterTax = comprehensiveIncomeData.filter(
            ({ code, name }) => code === "8200" || name === "本期淨利（淨損）"
          );

          const quarterRevenue = formatNumberFromCompanyCase(
            allRevenue.find(({ isSingleQuarter }) => isSingleQuarter)?.value ||
              ""
          );

          const quarterNetIncomeAfterTax = formatNumberFromCompanyCase(
            allNetIncomeAfterTax.find(({ isSingleQuarter }) => isSingleQuarter)
              ?.value || ""
          );

          const yearRevenue =
            quarter === "Q4"
              ? parseInt(
                  allRevenue
                    .find(
                      ({ start, end }) =>
                        start.startsWith(year) &&
                        end?.startsWith(end) &&
                        Math.abs(
                          moment(start, "YYYY-MM-DD").diff(
                            moment(end, "YYYY-MM-DD")
                          )
                        ) >= 365
                    )
                    ?.value.replaceAll(",", "") || ""
                )
              : NaN;

          const yearNetIncomeAfterTax =
            quarter === "Q4"
              ? parseInt(
                  allNetIncomeAfterTax
                    .find(
                      ({ start, end }) =>
                        start.startsWith(year) &&
                        end?.startsWith(end) &&
                        Math.abs(
                          moment(start, "YYYY-MM-DD").diff(
                            moment(end, "YYYY-MM-DD")
                          )
                        ) >= 365
                    )
                    ?.value.replaceAll(",", "") || ""
                )
              : NaN;
          const balanceTable = tables.find(({ name }) => name === "資產負債表");
          const balanceData =
            balanceTable?.data
              .map(({ date, ...data }) => ({
                ...data,
                ...caseDateToYYYYMMDD(date),
              }))
              .sort((a, b) => (a.start > b.start ? -1 : 1)) || [];
          const totalAssetsData = balanceData.find(
            ({ name }) => name === "資產-資產總計"
          );

          return {
            calendarYear: year,
            period: quarter,
            periodString: `${year}-${quarter}`,
            date: `${year}-${QUARTER_TO_DATE[quarter] || ""}`,
            yearRevenue,
            revenue: quarterRevenue,
            yearNetIncomeAfterTax: yearNetIncomeAfterTax,
            netIncomeAfterTax: quarterNetIncomeAfterTax,
            totalAssets: formatNumberFromCompanyCase(
              totalAssetsData?.value || ""
            ),
          };
        }) || [];
      const caseDataQuarterMap = keyBy(caseOriginalData, "periodString");

      // Q4是年報，把年報的數字換回Q4季報
      const revenueAndTotalAssetsMapByDate = keyBy(
        caseOriginalData.map(
          ({ revenue, period, calendarYear, yearRevenue, ...data }) => {
            if (
              period === "Q4" &&
              Number.isNaN(revenue) &&
              Number.isSafeInteger(yearRevenue)
            ) {
              const q1 = caseDataQuarterMap[`${calendarYear}-Q1`];
              const q2 = caseDataQuarterMap[`${calendarYear}-Q2`];
              const q3 = caseDataQuarterMap[`${calendarYear}-Q3`];

              if (
                Number.isSafeInteger(q1?.revenue) &&
                Number.isSafeInteger(q2?.revenue) &&
                Number.isSafeInteger(q3?.revenue)
              ) {
                return {
                  ...data,
                  revenue: yearRevenue - q1.revenue - q2.revenue - q3.revenue,
                  period,
                  calendarYear,
                };
              }
            }
            return {
              ...data,
              revenue,
              period,
              calendarYear,
            };
          }
        ),
        "date"
      );

      const composeData = data1.map((item, index) => {
        const date = moment(item.date, "YYYY-MM-DD")
          .startOf("quarter")
          .format("YYYY-MM-DD");
        return {
          date: date,
          period: item.period,
          calendarYear: item.calendarYear,
          netProfitMargin: item.netProfitMargin,
          assetTurnover:
            revenueAndTotalAssetsMapByDate[date]?.revenue /
            revenueAndTotalAssetsMapByDate[date]?.totalAssets /
            100,
          returnOnEquity: item.returnOnEquity,
          equityMultiplier:
            data2?.[index]?.totalAssets /
            data2?.[index]?.totalStockholdersEquity /
            100,
        };
      });
      updateGraph(composeData);
      getGraphData(genGraphTableData(composeData));
    }
  }, [stock, period, reportType]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  return (
    <>
      <PeriodController
        onChangePeriod={setPeriod}
        onChangeReportType={setReportType}
      />
      <Box height={510} bgcolor="#fff" pb={3}>
        <ReactChart
          type="line"
          data={labelDataSets}
          options={graphConfig as any}
          ref={chartRef}
        />
      </Box>
    </>
  );
}
