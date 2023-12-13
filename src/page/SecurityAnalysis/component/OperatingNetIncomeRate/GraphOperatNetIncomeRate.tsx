import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig, labelDataSets } from "./GraphConfig";
import type { Chart } from "chart.js";
import { getDataLimit } from "until";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import PeriodController from "component/PeriodController";
import { fetchCashFlowStatement } from "api/cashflow";
import { ICashFLowItem } from "types/cashflow";
import moment from "moment";

export const GRAPH_FIELDS = [
  {
    field: "operatingCashFlowRate",
    headerName: "營業現金流對淨利比(%)",
  },
];

export default function GraphOperatNetIncomeRate({
  getGraphData,
}: {
  getGraphData: (data: any[][]) => void;
}) {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  const [graphData, setGraphData] = useState<ICashFLowItem[]>([]);

  const updateGraph = (data: ICashFLowItem[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof ICashFLowItem] * 100
          );
        }
      });
      chartRef.current.update();
    }
  };

  const genGraphTableData = (data: ICashFLowItem[]) => {
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
        pinned: "left",
      };
      data?.forEach((item) => {
        if (reportType === PERIOD.ANNUAL) {
          dataSources[item.calendarYear] = (
            +item[field as keyof ICashFLowItem] * 100
          ).toFixed(2);
        } else {
          dataSources[`${item.calendarYear}-${item.period}`] = (
            +item[field as keyof ICashFLowItem] * 100
          ).toFixed(2);
        }
      });
      rowData.push(dataSources);
    });
    return [columnHeaders, rowData];
  };

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(reportType, period);
    const rst = await fetchCashFlowStatement(stock.Symbol, reportType, limit);
    if (rst) {
      const graphData = rst.map((item) => ({
        date: moment(item.date, "YYYY-MM-DD")
          .startOf("quarter")
          .format("YYYY-MM-DD"),
        operatingCashFlowRate:
          item.netCashProvidedByOperatingActivities / item.netIncome,
      }));
      updateGraph(graphData as any);
      setGraphData(rst);
    }
  }, [stock, period, reportType]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  useEffect(() => {
    if (graphData.length > 0) {
      const tableData = graphData.map((item) => ({
        date: item.date,
        operatingCashFlowRate:
          item.netCashProvidedByOperatingActivities / item.netIncome,
        calendarYear: item.calendarYear,
        period: item.period,
      }));
      getGraphData(genGraphTableData(tableData as any));
    }
  }, [graphData, getGraphData]);

  return (
    <>
      <PeriodController
        onChangePeriod={setPeriod}
        onChangeReportType={setReportType}
      />
      <Box height={510} bgcolor="#fff">
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
