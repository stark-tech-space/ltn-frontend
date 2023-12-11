import { Stack, Box } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import TagCard from "../../../../component/tabCard";
import PeriodController from "component/PeriodController";
import UnAvailable from "component/UnAvailable";

import moment from "moment";
import { keyBy } from "lodash";
import { Chart as ReactChart } from "react-chartjs-2";
import { Chart } from "chart.js";
import { AgGridReact } from "ag-grid-react";
import numeral from "numeral";
import { TURNOVER_DATASETS, TURNOVER_GRAPH_OPTIONS } from "./GrapConfig";

import { IProfitRatio } from "types/profitability";
import { IDateField, PERIOD } from "types/common";
import { getDataLimit, caseDateToYYYYMMDD } from "until";

import { currentStock } from "recoil/selector";
import { useRecoilValue } from "recoil";
import { fetchProfitRatio } from "api/profitrato";
import { fetchDanYiGongSiAnLi } from "api/financial";

const TABLE_FIELDS: Record<
  string,
  Array<{ field: string; headerName: string; fieldFormat: string }>
> = {
  "0": [
    {
      field: "receivablesTurnover",
      headerName: "應收帳款週轉",
      fieldFormat: "0,0",
    },
    {
      field: "inventoryTurnover",
      headerName: "存貨週轉",
      fieldFormat: "0,0.000",
    },
  ],
  "1": [
    {
      field: "fixedAssets",
      headerName: "固定資產(千元)",
      fieldFormat: "0,0",
    },
    {
      field: "fixedAssetTurnover",
      headerName: "固定資產周轉",
      fieldFormat: "0,0.000",
    },
  ],
  "2": [
    {
      field: "totalAssets",
      headerName: "總資產(千元)",
      fieldFormat: "0,0",
    },
    {
      field: "assetTurnover",
      headerName: "總資產週轉",
      fieldFormat: "0,0.000",
    },
  ],
};

interface IWeeklyTurnoverCaseData extends IDateField {
  periodString: string;
  accountsReceivable: number;
  fixedAssets: number;
  totalAssets: number;
  revenue: number;
}

const QUARTER_TO_DATE: Record<string, string> = {
  Q1: "03-31",
  Q2: "06-30",
  Q3: "09-30",
  Q4: "12-31",
};

interface ITurnOverData extends IDateField {
  receivablesTurnover: number;
  inventoryTurnover: number;
  fixedAssets: number;
  fixedAssetTurnover: number;
  totalAssets: number;
  assetTurnover: number;
}

export default function WeeklyTurnoverAbility() {
  const stock = useRecoilValue(currentStock);
  const chartRef = useRef<Chart>();

  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<IProfitRatio[]>([]);
  const [caseData, setCaseData] = useState<Array<IWeeklyTurnoverCaseData>>([]);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState<PERIOD>(PERIOD.QUARTER);
  const [isUnAvailable, setIsUnAvailable] = useState<boolean>(false);

  // 計算顯示的資料
  const turnoverData: Array<ITurnOverData> = useMemo(() => {
    if (tabIndex === 0) {
      return data.map((item) => ({
        calendarYear: item.calendarYear,
        period: item.period,
        date: item.date,
        receivablesTurnover: item.receivablesTurnover,
        inventoryTurnover: item.inventoryTurnover,
        fixedAssets: 0,
        fixedAssetTurnover: 0,
        totalAssets: 0,
        assetTurnover: 0,
      }));
    }

    const groupByDate = keyBy(caseData, "periodString");
    if (reportType === PERIOD.QUARTER) {
      const now = moment();
      return Array.from({ length: period * 4 }).map((_, index) => {
        const timeMoment = now.clone().subtract(index + 1, "quarter");
        const [year, quarter] = timeMoment.format("YYYY-Q").split("-");
        const data = groupByDate[`${year}-Q${quarter}`] || {};
        const defaultValue = {
          calendarYear: year.toString(),
          period: `Q${quarter}`,
          date: timeMoment.endOf("quarter").format("YYYY-MM-DD"),
        };
        return {
          ...defaultValue,
          receivablesTurnover: 0,
          inventoryTurnover: 0,
          fixedAssets: data.fixedAssets,
          fixedAssetTurnover: data.revenue / data.fixedAssets,
          totalAssets: data.totalAssets,
          assetTurnover: data.revenue / data.totalAssets,
        };
      });
    }

    if (reportType === PERIOD.ANNUAL) {
      const now = moment();
      // 年營收
      const yearRevenue = caseData.reduce<Record<string, number>>((prev, cur) => {
        if (!prev[cur.calendarYear]) {
          const q1 = groupByDate[`${cur.calendarYear}-Q1`];
          const q2 = groupByDate[`${cur.calendarYear}-Q2`];
          const q3 = groupByDate[`${cur.calendarYear}-Q3`];
          const q4 = groupByDate[`${cur.calendarYear}-Q4`];

          if (q1?.revenue && q2?.revenue && q3?.revenue && q4?.revenue) {
            prev[cur.calendarYear] = q1.revenue + q2.revenue + q3.revenue + q4.revenue;
          }
        }
        return prev;
      }, {});
      return Array.from({ length: period }).map((_, index) => {
        const timeMoment = now.clone().subtract(index + 1, "year");
        const year = timeMoment.format("YYYY");
        const q4 = groupByDate[`${year}-Q4`] || {};
        return {
          calendarYear: year.toString(),
          period: ``,
          date: timeMoment.startOf("year").format("YYYY-MM-DD"),
          receivablesTurnover: 0,
          inventoryTurnover: 0,
          fixedAssets: q4?.fixedAssets || NaN,
          fixedAssetTurnover: (yearRevenue[year] || NaN) / (q4?.fixedAssets || NaN),
          totalAssets: q4?.totalAssets || NaN,
          assetTurnover: (yearRevenue[year] || NaN) / (q4?.totalAssets || NaN),
        };
      });
    }

    return [];
  }, [caseData, data, reportType, tabIndex, period]);

  const handleUpdateGraph = (data: any[]) => {
    if (data.length === 0) {
      return;
    }
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      TABLE_FIELDS[tabIndex].forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof IProfitRatio]
          );
        }
      });

      chartRef.current.update();
    }
  };

  useEffect(() => {
    setIsUnAvailable(false);
  }, [stock.No]);

  useEffect(() => {
    const limit = getDataLimit(reportType, period);
    fetchProfitRatio<IProfitRatio[]>(stock.Symbol, PERIOD.QUARTER, limit).then((res) => {
      setData(res || []);
      setIsUnAvailable(
        (prev) =>
          prev || (!!res?.length && res.every(({ inventoryTurnover }) => !inventoryTurnover))
      );
    });
  }, [stock, reportType, period, setIsUnAvailable]);

  useEffect(() => {
    const year = moment().subtract(period, "year").format("YYYY");
    fetchDanYiGongSiAnLi({ securityCode: stock.No, yearRange: year, size: (period + 1) * 4 }).then(
      (res) => {
        const list =
          res?.list.map(({ tables, year, quarter }) => {
            const comprehensiveIncomeTable = tables.find(({ name }) => name === "綜合損益表");
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
              ({ code, name }) => code === "4000" || name === "營業收入-營業收入合計"
            );

            const quarterRevenue = parseInt(
              allRevenue
                .find(({ isSingleQuarter }) => isSingleQuarter)
                ?.value.replaceAll(",", "") || ""
            );

            const yearRevenue =
              quarter === "Q4"
                ? parseInt(
                    allRevenue
                      .find(
                        ({ start, end }) =>
                          start.startsWith(year) &&
                          end?.startsWith(end) &&
                          Math.abs(moment(start, "YYYY-MM-DD").diff(moment(end, "YYYY-MM-DD"))) >=
                            365
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
            const accountsReceivable = parseInt(
              balanceData
                .find(({ code, name }) => code === "1170" || name === "應收帳款淨額")
                ?.value.replaceAll(",", "") || ""
            );
            const totalAssetsData = balanceTable?.data.find(({ name }) => name === "資產-資產總計");
            const fixedAssets = parseInt(
              balanceData
                .find(
                  ({ code, name }) =>
                    code === "1600" || name === "資產-非流動資產-不動產、廠房及設備"
                )
                ?.value.replaceAll(",", "") || ""
            );
            //  流動資產合計
            const currentAssets = parseInt(
              balanceData.find(({ code, name }) => code === "11XX")?.value.replaceAll(",", "") || ""
            );

            return {
              calendarYear: year,
              period: quarter,
              periodString: `${year}-${quarter}`,
              date: `${year}-${QUARTER_TO_DATE[quarter] || ""}`,
              yearRevenue,
              revenue: quarterRevenue,
              accountsReceivable,
              totalAssets: parseInt(totalAssetsData?.value.replaceAll(",", "") || ""),
              fixedAssets: fixedAssets,
              currentAssets,
            };
          }) || [];
        const listDateMap = keyBy(list, "periodString");

        // Q4是年報，把年報的數字換回Q4季報
        const newList = list.map(({ revenue, period, calendarYear, yearRevenue, ...data }) => {
          if (period === "Q4" && Number.isNaN(revenue) && Number.isSafeInteger(yearRevenue)) {
            const q1 = listDateMap[`${calendarYear}-Q1`];
            const q2 = listDateMap[`${calendarYear}-Q2`];
            const q3 = listDateMap[`${calendarYear}-Q3`];

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
        });

        setCaseData(newList.sort((a, b) => (a > b ? -1 : 1)));

        // 沒有流動資產合計的股票就不適用這個指標
        setIsUnAvailable(
          (prev) =>
            prev ||
            (!!newList.length && newList.every(({ currentAssets }) => Number.isNaN(currentAssets)))
        );
      }
    );
  }, [stock.No, period, setIsUnAvailable]);

  useEffect(() => {
    handleUpdateGraph(turnoverData);
  }, [turnoverData]);

  const columnHeaders = useMemo(() => {
    const columns: any[] = [
      {
        field: "title",
        headerName: reportType === PERIOD.QUARTER ? "年度/季度" : "年度",
        pinned: "left",
      },
    ];
    turnoverData?.forEach((item) => {
      columns.push({
        field:
          reportType === PERIOD.QUARTER ? `${item.calendarYear}-${item.period}` : item.calendarYear,
      });
    });
    return columns;
  }, [turnoverData, reportType]);

  const tableRowData = useMemo(
    () =>
      TABLE_FIELDS[tabIndex.toString()].map(({ headerName, field, fieldFormat }) => {
        const dataSources: { [key: string]: any } = {
          title: headerName,
        };

        turnoverData?.forEach((item) => {
          if (reportType === PERIOD.ANNUAL) {
            dataSources[item.calendarYear] = numeral(item[field as keyof ITurnOverData]).format(
              fieldFormat
            );
          } else {
            dataSources[`${item.calendarYear}-${item.period}`] = numeral(
              item[field as keyof ITurnOverData]
            ).format(fieldFormat);
          }
        });
        return dataSources;
      }),
    [turnoverData, reportType, tabIndex]
  );

  if (isUnAvailable) {
    return <UnAvailable />;
  }

  return (
    <Stack rowGap={1}>
      <TagCard tabs={["營運周轉", "固定資產周轉", "總資產周轉"]} onChange={setTabIndex}>
        <PeriodController onChangePeriod={setPeriod} onChangeReportType={setReportType} />
        <Box bgcolor="#fff" height={510}>
          <ReactChart
            type="line"
            data={TURNOVER_DATASETS[tabIndex.toString()]}
            options={TURNOVER_GRAPH_OPTIONS[tabIndex.toString()]}
            ref={chartRef}
          />
        </Box>
      </TagCard>
      <TagCard tabs={["詳細數據"]}>
        <Box
          className="ag-theme-alpine"
          style={{
            paddingBottom: "24px",
          }}
        >
          <AgGridReact
            rowData={tableRowData}
            columnDefs={columnHeaders as any}
            defaultColDef={{
              resizable: false,
              initialWidth: 200,
              wrapHeaderText: true,
              autoHeaderHeight: true,
              // flex: 1,
            }}
            domLayout="autoHeight"
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
