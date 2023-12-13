import { Box } from "@mui/material";
import PeriodController from "component/PeriodController";
import type { Chart } from "chart.js";
import { Chart as ReactChart } from "react-chartjs-2";
import { useRecoilValue } from "recoil";
import { useCallback, useEffect, useRef, useState } from "react";
import { currentStock } from "recoil/selector";
import { PERIOD_YEAR } from "types/common";
import { OPTIONS_02, labelDataSets_02 } from "./GraphConfig";
import { getBeforeYears } from "until";
import { fetchFindMindAPI } from "api/common";
import { useAvgPriceByMonth, useGetStockCountByMonth } from "Hooks/common";
import moment from "moment";

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
    headerName: "月每股營收（元）",
  },
  {
    field: "growthByMonthRate",
    headerName: "單月營收月增率（%）",
  },
];

export default function PerStockIncomeChart({
  getGraphData,
}: {
  getGraphData: (data: any[][]) => void;
}) {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(PERIOD_YEAR[0].value);

  const [graphData, setGraphData] = useState<IGraphField[]>([]);

  const avgPrice = useAvgPriceByMonth(period);
  const getStockCountByDate = useGetStockCountByMonth();

  const updateGraph = (
    data: IGraphField[],
    fields: { field: string; headerName: string }[],
    dataIndex: number,
  ) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;
      fields.forEach(async ({ field }) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[dataIndex].data = data.map(
            (item) => +item[field as keyof IGraphField],
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
        if (field === "growthByMonthRate") {
          dataSources[item.date] = item.growthByMonthRate;
        } else {
          dataSources[item.date] = item[field] ? item[field as keyof IGraphField] : 0;
        }
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
          revenue: item.revenue,
          sma: 0,
        };
      });
      setGraphData(graphData);
    }
  }, [stock.No, period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (graphData.length > 0) {
      const data = graphData.map((graphItem) => {
        const avgStockCount = getStockCountByDate(graphItem.date);
        return {
          date: graphItem.date,
          sma: 0,
          revenue: avgStockCount ? +(graphItem.revenue / avgStockCount.StockCount).toFixed(2) : 0,
          growthByMonthRate: 0,
        };
      });
      const rst = data.map((item, index) => {
        const prevMonthRevenue = index < 12 ? 1 : data[index - 1]?.revenue;
        let growthByMonthRate = 0;
        if (prevMonthRevenue && item.revenue) {
          growthByMonthRate = +((item.revenue / prevMonthRevenue - 1) * 100).toFixed(2);
        }
        return {
          ...item,
          date: moment(item.date).format("YYYY-MM"),
          growthByMonthRate: index < 12 ? 1 : growthByMonthRate,
        };
      });
      updateGraph(rst.slice(12), GRAPH_FIELDS.slice(0, 1), 0);
      getGraphData(genGraphTableData(rst.slice(12)));
    }
  }, [graphData, getStockCountByDate, getGraphData]);

  useEffect(() => {
    if (avgPrice.length > 0) {
      updateGraph(avgPrice.slice(12) as IGraphField[], GRAPH_FIELDS, 1);
    }
  }, [avgPrice]);

  return (
    <>
      <PeriodController onChangePeriod={setPeriod} showReportType={false} />
      <Box height={510} bgcolor="#fff" pb={3}>
        <ReactChart
          type="bar"
          ref={chartRef}
          data={labelDataSets_02 as any}
          options={OPTIONS_02 as any}
        />
      </Box>
    </>
  );
}
