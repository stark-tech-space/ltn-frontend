import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig, labelDataSets } from "./CloseFourQuarterGraphConfig";
import type { Chart } from "chart.js";
import { ICaseDataForDuPont } from "./type";

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
    headerName: "近四季稅後淨利率",
  },
  {
    field: "assetTurnover",
    headerName: "近四季總資產週轉",
  },
  {
    field: "equityMultiplier",
    headerName: "權益乘數",
  },
  {
    field: "returnOnEquity",
    headerName: "近四季ROE",
  },
];

export default function CloseFourQuarterGraph({
  data,
  reportType,
  getTableData,
}: {
  data: Array<ICaseDataForDuPont>;
  reportType: PERIOD;
  getTableData: (data: any[][]) => void;
}) {
  const chartRef = useRef<Chart>();
  const translateDataToGraph = (
    caseDataArray: Array<ICaseDataForDuPont>
  ): Array<IComposedData> => {
    return caseDataArray.map((caseData, index) => {
      const previousFourSeason = caseDataArray.slice(index, index + 4);
      const revenueSum = previousFourSeason.reduce(
        (prev, cur) => prev + (cur.revenue || NaN),
        0
      );
      const totalAssetsSum = previousFourSeason.reduce(
        (prev, cur) => prev + (cur.totalAssets || NaN),
        0
      );
      const netIncomeAfterTaxSum = previousFourSeason.reduce(
        (prev, cur) => prev + (cur.netIncomeAfterTax || NaN),
        0
      );
      const assetTurnover = revenueSum / caseData.totalAssets;
      const netProfitMargin = (netIncomeAfterTaxSum / revenueSum) * 100;
      const equityMultiplier = caseData?.totalAssets / caseData?.equity;
      return {
        date: caseData.date,
        period: caseData.period,
        calendarYear: caseData.calendarYear,
        netProfitMargin: netProfitMargin,
        assetTurnover: assetTurnover,
        returnOnEquity: netProfitMargin * assetTurnover * equityMultiplier,
        equityMultiplier: equityMultiplier,
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
          dataSources[item.calendarYear] = (+item[field as keyof T]).toFixed(2);
        } else {
          dataSources[`${item.calendarYear}-${item.period}`] = (+item[
            field as keyof T
          ]).toFixed(2);
        }
      });
      rowData.push(dataSources);
    });
    return [columnHeaders, rowData];
  };

  useEffect(() => {
    const caseData = translateDataToGraph(data);
    updateGraph(caseData);
    getTableData(genGraphTableData(caseData));
  }, [data]);

  return (
    <Box height={510} bgcolor="#fff" pb={3}>
      <ReactChart
        type="line"
        data={labelDataSets}
        options={graphConfig as any}
        ref={chartRef}
      />
    </Box>
  );
}
