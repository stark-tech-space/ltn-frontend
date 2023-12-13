import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig, labelDataSets } from "./GrapConfig";
import { getDataLimit } from "until";
import { fetchBalanceSheetStatement, fetchProfitRatio } from "api/profitrato";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import {
  IDuPontAnalysisGraph1,
  IDuPontAnalysisGraph2,
} from "types/profitability";
import PeriodController from "component/PeriodController";
import type { Chart } from "chart.js";
import moment from "moment";

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
    headerName: "稅後淨利率",
  },
  {
    field: "assetTurnover",
    headerName: "總資產迴轉",
  },
  {
    field: "equityMultiplier",
    headerName: "權益乘數",
  },
  {
    field: "returnOnEquity",
    headerName: "ROA",
  },
];

export default function Graph({
  getGraphData,
}: {
  getGraphData: (data: any[][]) => void;
}) {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  const updateGraph = (data: IComposedData[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof IComposedData] * 100
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
          dataSources[item.calendarYear] = (
            +item[field as keyof T] * 100
          ).toFixed(2);
        } else {
          dataSources[`${item.calendarYear}-${item.period}`] = (
            +item[field as keyof T] * 100
          ).toFixed(2);
        }
      });
      rowData.push(dataSources);
    });
    return [columnHeaders, rowData];
  };

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(reportType, period);
    const [data1, data2] = await Promise.all([
      fetchProfitRatio<IDuPontAnalysisGraph1[]>(
        stock.Symbol,
        reportType,
        limit
      ),
      fetchBalanceSheetStatement<IDuPontAnalysisGraph2[]>(
        stock.Symbol,
        PERIOD.QUARTER,
        limit
      ),
    ]);
    if (data1 && data2) {
      const composeData = data1.map((item, index) => {
        return {
          date: moment(item.date, "YYYY-MM-DD")
            .startOf("quarter")
            .format("YYYY-MM-DD"),
          period: item.period,
          calendarYear: item.calendarYear,
          netProfitMargin: item.netProfitMargin,
          assetTurnover: item.assetTurnover,
          returnOnEquity: item.returnOnEquity,
          equityMultiplier:
            data2?.[index]?.totalAssets /
            data2?.[index]?.totalStockholdersEquity,
        };
      });
      updateGraph(composeData);
      getGraphData(genGraphTableData(composeData));
    }
  }, [stock, period, reportType]);

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
          data={labelDataSets}
          options={graphConfig as any}
          ref={chartRef}
        />
      </Box>
    </>
  );
}
