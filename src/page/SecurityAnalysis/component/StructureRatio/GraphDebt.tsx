import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig_01, labelDataSets_01 } from "./GrapConfig";
import type { Chart } from "chart.js";
import { getDataLimit } from "until";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { ISecurityRatio } from "types/security";
import PeriodController from "component/PeriodController";
import { fetchSecurityRatio } from "api/security";

export const GRAPH_FIELDS = [
  {
    field: "debtRatio",
    headerName: "負債比率",
  },
];

export default function GraphDebt({
  getGraphData,
}: {
  getGraphData: (data: any[][]) => void;
}) {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  const updateGraph = (data: ISecurityRatio[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof ISecurityRatio] * 100
          );
        }
      });
      chartRef.current.update();
    }
  };

  const genGraphTableData = (data: ISecurityRatio[]) => {
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
            +item[field as keyof ISecurityRatio] * 100
          ).toFixed(2);
        } else {
          dataSources[`${item.calendarYear}-${item.period}`] = (
            +item[field as keyof ISecurityRatio] * 100
          ).toFixed(2);
        }
      });
      rowData.push(dataSources);
    });
    return [columnHeaders, rowData];
  };

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(reportType, period);
    const rst = await fetchSecurityRatio<ISecurityRatio[]>(
      stock.Symbol,
      reportType,
      limit
    );
    if (rst) {
      updateGraph(rst);
      getGraphData(genGraphTableData(rst));
    }
  }, [stock, period, reportType, getGraphData]);

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
          data={labelDataSets_01}
          options={graphConfig_01 as any}
          ref={chartRef}
        />
      </Box>
    </>
  );
}
