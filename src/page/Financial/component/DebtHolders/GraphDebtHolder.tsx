import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig, labelDataSets_01 } from "./GraphConfig";
import type { Chart } from "chart.js";
import { findMindDataToFmpData, getBeforeYears, getDataLimit } from "until";
import { fetchProfitRatio } from "api/profitrato";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { IProfitRatio } from "types/profitability";
import PeriodController from "component/PeriodController";
import { fetchFindMindAPI } from "api/common";

// 淨值：AccountsReceivableNet
// 負載總：Liabilities
export const GRAPH_FIELDS = [
  {
    field: "CurrentLiabilities",
    headerName: "流動負債",
  },
  {
    field: "LongtermBorrowings",
    headerName: "長期負債",
  },
  {
    field: "AccountsReceivableNet",
    headerName: "淨值",
  },
  {
    field: "totalDebtAndNetValue",
    headerName: "總負債 + 淨值",
  },
];

export const GRAPH_TABLE_FIELDS = [
  {
    field: "ShorttermBorrowings",
    headerName: "短期借款",
  },
  {
    field: "--",
    headerName: "應付短期票券",
  },
  {
    field: "--",
    headerName: "應付帳款及票據",
  },
  {
    field: "--",
    headerName: "預收款項",
  },
  {
    field: "--",
    headerName: "一年內到期長期負債",
  },
  {
    field: "OtherCurrentLiabilities",
    headerName: "其餘流動負債",
  },
  {
    field: "Liabilities",
    headerName: "總負債",
  },
  {
    field: "--",
    headerName: "淨值",
  },
];

export default function GraphDebtHolder({
  getGraphData,
}: {
  getGraphData: (data: any[][]) => void;
}) {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);

  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  const updateGraph = (data: any[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field] / 1000
          );
        }
      });
      chartRef.current.update();
    }
  };

  const genGraphTableData = (data: IProfitRatio[]) => {
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
            +item[field as keyof IProfitRatio] * 100
          ).toFixed(2);
        } else {
          dataSources[`${item.calendarYear}-${item.period}`] = (
            +item[field as keyof IProfitRatio] * 100
          ).toFixed(2);
        }
      });
      rowData.push(dataSources);
    });
    return [columnHeaders, rowData];
  };

  const fetchGraphData = useCallback(async () => {
    const rst = await fetchFindMindAPI<any>({
      data_id: stock.No,
      dataset: "TaiwanStockBalanceSheet",
      start_date: getBeforeYears(period),
      
    });

    const data = rst.map((item: any) => findMindDataToFmpData(item));
    // updateGraph(data);
    console.log("data:", data);
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
          options={graphConfig as any}
          ref={chartRef}
        />
      </Box>
    </>
  );
}
