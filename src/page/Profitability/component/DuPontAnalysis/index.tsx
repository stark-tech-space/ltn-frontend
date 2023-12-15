import { Stack, Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import Graph from "./Graph";
import CloseFourQuarterGraph from "./CloseFourQuarterGraph";
import TagCard from "../../../../component/tabCard";
import WrappedAgGrid from "component/WrappedAgGrid";
import PeriodController from "component/PeriodController";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { PERIOD } from "types/common";
import { fetchDanYiGongSiAnLi } from "api/financial";
import moment from "moment";
import { caseDateToYYYYMMDD, formatNumberFromCompanyCase } from "until";
import { keyBy } from "lodash";
import { ICaseDataForDuPont } from "./type";

const QUARTER_TO_DATE: Record<string, string> = {
  Q1: "01-01",
  Q2: "04-01",
  Q3: "07-01",
  Q4: "10-01",
};

export default function DuPontAnalysis() {
  const [tab, setTab] = useState<number>(0);
  const [data, setData] = useState<Array<ICaseDataForDuPont>>([]);

  const [tableData, setTableData] = useState<any[][]>([]);
  const [columnHeaders, rowData] = tableData;
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  const fetchGraphData = useCallback(async () => {
    const startDataMoment = moment()
      .subtract(period + 1, "year")
      .startOf("year");
    const res = await fetchDanYiGongSiAnLi({
      securityCode: stock.No,
      yearRange: startDataMoment.format("YYYY"),
      size: Math.abs(startDataMoment.diff(moment(), "quarter")),
    });
    if (res) {
      const caseOriginalData =
        res?.list.map(({ tables, year, quarter }) => {
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
            ({ code, name, value }) =>
              (code === "4000" ||
                code === "4XXXX" ||
                name === "營業收入-營業收入合計" ||
                name === "淨收益" ||
                name === "淨收益-淨收益") &&
              value
          );

          const allNetIncomeAfterTax = comprehensiveIncomeData.filter(
            ({ code, name, value }) =>
              (code === "8200" || name === "本期淨利（淨損）") && value
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
            ({ code, name }) =>
              code === "1XXX" || code === "19999" || name === "資產-資產總計"
          );
          const equity = formatNumberFromCompanyCase(
            balanceData.find(
              ({ code, name }) =>
                code === "3XXX" ||
                name === "負債及權益-權益-權益總計" ||
                code === "39999"
            )?.value || ""
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
            equity,
          };
        }) || [];
      const caseDataQuarterMap = keyBy(caseOriginalData, "periodString");

      // Q4是年報，把年報的數字換回Q4季報
      const caseDataArray = caseOriginalData.map(
        ({
          revenue,
          period,
          calendarYear,
          yearRevenue,
          netIncomeAfterTax,
          yearNetIncomeAfterTax,
          ...data
        }) => {
          let newRevenue = revenue;
          let newNetIncomeAfterTax = netIncomeAfterTax;
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
              newRevenue = yearRevenue - q1.revenue - q2.revenue - q3.revenue;
            }
          }
          if (
            period === "Q4" &&
            Number.isNaN(netIncomeAfterTax) &&
            Number.isSafeInteger(yearNetIncomeAfterTax)
          ) {
            const q1 = caseDataQuarterMap[`${calendarYear}-Q1`];
            const q2 = caseDataQuarterMap[`${calendarYear}-Q2`];
            const q3 = caseDataQuarterMap[`${calendarYear}-Q3`];

            if (
              Number.isSafeInteger(q1?.netIncomeAfterTax) &&
              Number.isSafeInteger(q2?.netIncomeAfterTax) &&
              Number.isSafeInteger(q3?.netIncomeAfterTax)
            ) {
              newNetIncomeAfterTax =
                yearNetIncomeAfterTax -
                q1.netIncomeAfterTax -
                q2.netIncomeAfterTax -
                q3.netIncomeAfterTax;
            }
          }
          return {
            ...data,
            revenue: newRevenue,
            netIncomeAfterTax: newNetIncomeAfterTax,
            period,
            calendarYear,
            yearRevenue,
            yearNetIncomeAfterTax,
          };
        }
      );

      const startDateString = moment()
        .subtract(period, "year")
        .startOf("year")
        .format("YYYY-MM-DD");
      const filteredCaseDataArray = caseDataArray.filter(
        ({ date }) => date > startDateString
      );
      setData(filteredCaseDataArray);
    }
  }, [stock, period, reportType]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  return (
    <Stack rowGap={1}>
      <TagCard
        tabs={["單季 ROE 杜邦分析", "近四季 ROE 杜邦分析"]}
        onChange={setTab}
      >
        <Box bgcolor="#fff" borderRadius="8px">
          <PeriodController
            onChangePeriod={setPeriod}
            onChangeReportType={setReportType}
          />
          {tab === 0 && (
            <Graph
              data={data}
              getTableData={setTableData}
              reportType={reportType}
            />
          )}
          {tab === 1 && (
            <CloseFourQuarterGraph
              data={data}
              getTableData={setTableData}
              reportType={reportType}
            />
          )}
        </Box>
      </TagCard>
      <TagCard tabs={["詳細數據"]}>
        <Box
          className="ag-theme-alpine"
          style={{
            paddingBottom: "24px",
          }}
        >
          <WrappedAgGrid
            rowData={rowData}
            columnDefs={columnHeaders as any}
            defaultColDef={{
              resizable: false,
              initialWidth: 160,
              wrapHeaderText: true,
              autoHeaderHeight: true,
            }}
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
