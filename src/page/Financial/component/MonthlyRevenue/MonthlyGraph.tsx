import { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { OPTIONS_01, labelDataSets_01 } from "./GraphConfig";
import type { Chart } from "chart.js";
import { Chart as ReactChart } from "react-chartjs-2";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import PeriodController from "component/PeriodController";
import { PERIOD_YEAR } from "types/common";
import { getBeforeYears } from "until";
import { fetchFindMindAPI } from "api/common";
import { useAvgPriceByMonth } from "Hooks/common";
import numeral from "numeral";
interface IGraphField {
  date: string;
  revenue: number;
  sma: number;
}
export const GRAPH_FIELDS = [
  {
    field: "revenue",
    headerName: "每月營收",
  },
  {
    field: "sma",
    headerName: "月均價",
  },
];

export const GRAPH_TABLE_FIELDS = [
  {
    field: "revenue",
    headerName: "每月營收",
  },
  {
    field: "growthRate",
    headerName: "單月營收年增率",
  },
];

export default function MonthlyGraph({
  getGraphData,
}: {
  getGraphData: (data: any[][]) => void;
}) {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(PERIOD_YEAR[0].value);
  const avgPrice = useAvgPriceByMonth(period);

  const updateGraph = (
    data: IGraphField[],
    fields: { field: string; headerName: string }[],
    dataIndex: number
  ) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;
      fields.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[dataIndex].data = data.map(
            (item) => +item[field as keyof IGraphField]
          );
        }
      });
      chartRef.current.update();
    }
  };

  const genGraphTableData = (data: any[]) => {
    if (data.length === 0) {
      return [[], []];
    }
    const rowData: any[] = [];
    const columnHeaders: any[] = [
      {
        field: "title",
        headerName: "年度月份",
        pinned: "left",
      },
    ];

    data?.forEach((item) => {
      columnHeaders.push({
        field: item.date,
      });
    });

    GRAPH_TABLE_FIELDS.forEach(({ field, headerName }) => {
      const dataSources: { [key: string]: any } = {
        title: headerName,
      };
      data?.forEach((item) => {
        dataSources[item.date] = item[field]
          ? numeral(+item[field as keyof IGraphField]).format("0,0")
          : 0;
      });
      rowData.push(dataSources);
    });

    return [columnHeaders, rowData];
  };

  const fetchData = useCallback(async () => {
    const rst = await fetchFindMindAPI<any[]>({
      data_id: stock.No,
      start_date: getBeforeYears(period),
      dataset: "TaiwanStockMonthRevenue",
    });

    if (rst) {
      const graphData = rst.map((item) => {
        return {
          date: item.date,
          revenue: item.revenue / 1000,
          sma: 0,
        };
      });
      updateGraph(graphData, GRAPH_FIELDS.slice(0, 1), 0);
      getGraphData(genGraphTableData(rst));
    }
  }, [stock.No, period, getGraphData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (avgPrice.length > 0) {
      updateGraph(avgPrice as IGraphField[], GRAPH_FIELDS, 1);
    }
  }, [avgPrice]);

  return (
    <>
      <PeriodController onChangePeriod={setPeriod} showReportType={false} />
      <Box height={510} bgcolor="#fff" pb={3}>
        <ReactChart
          type="bar"
          ref={chartRef}
          data={labelDataSets_01 as any}
          options={OPTIONS_01 as any}
        />
      </Box>
    </>
  );
}
