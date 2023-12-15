import { Stack, Box, Button, ButtonGroup } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TagCard from "../../../../component/tabCard";
import { Chart as ReactChart } from "react-chartjs-2";
import type { Chart } from "chart.js";
import { PERIOD } from "types/common";
import PeriodController from "component/PeriodController";
import { graphConfig, labelDataSets } from "./ GraphConfig";
import { genFullDateObject, getBeforeYears } from "until";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import _, { groupBy, keyBy } from "lodash";
import WrappedAgGrid from "component/WrappedAgGrid";
import moment from "moment";
import { fetchDanYiGongSiAnLi } from "api/financial";
import { caseDateToYYYYMMDD, formatNumberFromCompanyCase } from "until";

interface IGraphData {
  date: string;
  cashFlowtoDebtRate: number;
  cashFlowToLongDebtRate: number;
}
const GRAPH_FIELDS = [
  {
    field: "cashFlowtoDebtRate",
    headerName: "營業現金流對流動負債比",
  },
  {
    field: "cashFlowToLongDebtRate",
    headerName: "營業現金流對負債比",
  },
];

export default function FlowRate() {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);

  const [graphData, setGraphData] = useState<any>([]);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  const updateGraph = (data: IGraphData[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof IGraphData] * 100
          );
        }
      });
      chartRef.current.update();
    }
  };

  const genGraphTableData = (data: IGraphData[]) => {
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
      const dateFullObject = genFullDateObject(item.date);
      columnHeaders.push({
        field:
          reportType === PERIOD.QUARTER
            ? dateFullObject.period
            : dateFullObject.calendarYear,
      });
    });

    GRAPH_FIELDS.filter(({ field }) =>
      data.every((item) => !Number.isNaN(item[field as keyof IGraphData]))
    ).forEach(({ field, headerName }) => {
      const dataSources: { [key: string]: any } = {
        title: headerName,
        pinned: "left",
      };

      data?.forEach((item) => {
        const dateFullObject = genFullDateObject(item.date);
        if (reportType === PERIOD.ANNUAL) {
          dataSources[dateFullObject.calendarYear] = (
            +item[field as keyof IGraphData] * 100
          ).toFixed(2);
        } else {
          dataSources[dateFullObject.period] = (
            +item[field as keyof IGraphData] * 100
          ).toFixed(2);
        }
      });
      rowData.push(dataSources);
    });
    return [columnHeaders, rowData];
  };

  const fetchGraphData = useCallback(async () => {
    // 營業現金流 CashFlowsFromOperatingActivities
    // 流動負債 CurrentLiabilities
    // 負債 Liabilities

    /**
     *
     * 營業現金流對流動負債比 =  CashFlowsFromOperatingActivities /  CurrentLiabilities
     *
     * 營業現金流對負債比 = CashFlowsFromOperatingActivities / Liabilities
     */

    const res = await fetchDanYiGongSiAnLi({
      securityCode: stock.No,
      yearRange: getBeforeYears(period - 1).slice(0, 4),
      size: period * 4,
    });

    if (!res) {
      return;
    }

    const dataByDateArray =
      res.list.map(({ tables, year, quarter }) => {
        const cashFlowTable = tables.find(({ name }) => name === "現金流量表");
        const comprehensiveIncomeData =
          cashFlowTable?.data
            .map(({ date, ...data }) => {
              return {
                ...data,
                ...caseDateToYYYYMMDD(date),
              };
            })
            .sort((a, b) => (a.start > b.start ? -1 : 1)) || [];
        const accCashFlowsFromOperatingActivities = formatNumberFromCompanyCase(
          comprehensiveIncomeData.find(
            ({ code, name }) =>
              code === "AAAA" || name === "營業活動之淨現金流入（流出）"
          )?.value || ""
        );

        const balanceTable = tables.find(({ name }) => name === "資產負債表");
        const date = moment(`${year}-${quarter}`, "YYYY-[Q]Q")
          .startOf("quarter")
          .format("YYYY-MM-DD");
        const balanceData =
          balanceTable?.data
            .map(({ date, ...data }) => ({
              ...data,
              ...caseDateToYYYYMMDD(date),
            }))
            .sort((a, b) => (a.start > b.start ? -1 : 1)) || [];
        const currentLiabilities = formatNumberFromCompanyCase(
          balanceData.find(
            ({ code, name }) => code === "21XX" || name === "流動負債合計"
          )?.value || ""
        );

        const liabilities = formatNumberFromCompanyCase(
          balanceData.find(
            ({ code, name }) =>
              code === "2XXX" || name === "負債總計" || code === "29999"
          )?.value || ""
        );

        return {
          year,
          quarter,
          date,
          currentLiabilities,
          liabilities,
          accCashFlowsFromOperatingActivities,
        };
      }) || [];

    const dataGroupByYear = Object.fromEntries(
      Object.entries(
        groupBy(dataByDateArray, (item) => item.date.slice(0, 4))
      ).map(([key, values]) => [key, keyBy(values, "quarter")])
    );

    const finalData = dataByDateArray.map((item) => {
      const yearData = dataGroupByYear[item.year];
      const quarterNumber = Number(item.quarter[1]);
      const cashFlowsFromOperatingActivities =
        item.accCashFlowsFromOperatingActivities -
        (yearData[`Q${quarterNumber - 1}`]
          ?.accCashFlowsFromOperatingActivities || 0);
      return {
        ...item,
        cashFlowsFromOperatingActivities,
      };
    });

    const graphData = finalData?.map((item, index) => ({
      cashFlowToLongDebtRate:
        item.cashFlowsFromOperatingActivities / item.liabilities,
      cashFlowtoDebtRate:
        item.cashFlowsFromOperatingActivities / item.currentLiabilities,
      date: moment(item.date, "YYYY-MM-DD")
        .startOf("quarter")
        .format("YYYY-MM-DD"),
    }));
    updateGraph(graphData);
    setGraphData(graphData);
  }, [stock, period]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  const [columnHeaders, rowData] = useMemo(
    () => genGraphTableData(graphData),
    [graphData]
  );

  return (
    <Stack rowGap={1}>
      <Box bgcolor="#fff" p={3} borderRadius="8px">
        <PeriodController
          onChangePeriod={setPeriod}
          //   onChangeReportType={setReportType}
          showReportType={false}
        />
        <Box height={510}>
          <ReactChart
            type="line"
            data={labelDataSets}
            options={graphConfig as any}
            ref={chartRef}
          />
        </Box>
      </Box>
      <TagCard tabs={["詳細數據"]}>
        <Box
          className="ag-theme-alpine"
          style={{
            paddingBottom: "24px",
          }}
        >
          <WrappedAgGrid
            rowData={rowData}
            columnDefs={columnHeaders}
            defaultColDef={{
              resizable: true,
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
