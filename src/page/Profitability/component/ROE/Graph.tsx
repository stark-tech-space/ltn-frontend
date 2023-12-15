import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig, labelDataSets } from "./GrapConfig";
import type { Chart } from "chart.js";
import { ICaseDataForROEAndROA } from "./type";

export const GRAPH_FIELDS = [
  {
    field: "returnOnEquity",
    headerName: "ROE",
  },
  {
    field: "returnOnAssets",
    headerName: "ROA",
  },
];

interface IComposedData {
  date: string;
  period: string;
  calendarYear: string;
  returnOnEquity: number;
  returnOnAssets: number;
}

export default function Graph({
  getTableData,
  data,
  reportType,
}: {
  data: Array<ICaseDataForROEAndROA>;
  reportType: PERIOD;
  getTableData: (data: any[][]) => void;
}) {
  const chartRef = useRef<Chart>();

  const translateDataToGraph = (
    caseDataArray: Array<ICaseDataForROEAndROA>
  ): Array<IComposedData> => {
    return caseDataArray.map((caseData, index) => {
      const roa = (caseData.netIncomeAfterTax / caseData.totalAssets) * 100;
      const roe = (caseData.netIncomeAfterTax / caseData.equity) * 100;
      return {
        date: caseData.date,
        period: caseData.period,
        calendarYear: caseData.calendarYear,
        returnOnEquity: roe,
        returnOnAssets: roa,
      };
    });
  };
  const updateGraph = (data: IComposedData[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof IComposedData]
          );
        }
      });
      chartRef.current.update();
    }
  };

  const genGraphTableData = (data: IComposedData[]) => {
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
          dataSources[item.calendarYear] = (+item[
            field as keyof IComposedData
          ]).toFixed(2);
        } else {
          dataSources[`${item.calendarYear}-${item.period}`] = (+item[
            field as keyof IComposedData
          ]).toFixed(2);
        }
      });
      rowData.push(dataSources);
    });
    return [columnHeaders, rowData];
  };

  useEffect(() => {
    const graphData = translateDataToGraph(data);
    updateGraph(graphData);
    getTableData(genGraphTableData(graphData));
  }, [data]);

  return (
    <>
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
