import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { labelDataSets, graphConfig } from "./GrapConfig";
import type { Chart } from "chart.js";
import { getDataLimit } from "until";
import { fetchProfitRatio } from "api/profitrato";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { IOperatingItem } from "types/profitability";
import PeriodController from "component/PeriodController";
import UnAvailable from "component/UnAvailable";
import moment from "moment";

interface IGraphData extends IOperatingItem {
  receivablesTurnover: number;
  inventoryTurnover: number;
  turnoverDays: number;
}

export const GRAPH_FIELDS = [
  {
    field: "receivablesTurnover",
    headerName: "應收帳款收現天數",
  },
  {
    field: "inventoryTurnover",
    headerName: "存貨週轉天數",
  },
  {
    field: "turnoverDays",
    headerName: "營運週轉天數",
  },
];

export default function GraphMultiRatio({
  getGraphData,
}: {
  getGraphData: (data: any[][]) => void;
}) {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);
  const [isUnAvailable, setIsUnAvailable] = useState<boolean>(false);

  const updateGraph = (data: IGraphData[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof IGraphData]
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
            field as keyof IGraphData
          ]).toFixed(2);
        } else {
          dataSources[`${item.calendarYear}-${item.period}`] = (+item[
            field as keyof IGraphData
          ]).toFixed(2);
        }
      });
      rowData.push(dataSources);
    });
    return [columnHeaders, rowData];
  };

  const fetchGraphData = useCallback(async () => {
    setIsUnAvailable(false);
    const limit = getDataLimit(reportType, period);
    const rst = await fetchProfitRatio<IOperatingItem[]>(
      stock.Symbol,
      reportType,
      limit
    );

    if (rst && rst.length && rst.every((item) => !item.inventoryTurnover)) {
      setIsUnAvailable(true);
    }

    const calc = (x: number) => {
      if (!x) {
        return 0;
      }
      const calcDays = reportType === PERIOD.QUARTER ? 90 : 365;
      return +(calcDays / x).toFixed(2);
    };

    if (rst) {
      const graphData = rst.map((item) => {
        const receivablesTurnover = calc(item.receivablesTurnover);
        const inventoryTurnover = calc(item.inventoryTurnover);
        return {
          ...item,
          date: moment(item.date, "YYYY-MM-DD")
            .startOf("quarter")
            .format("YYYY-MM-DD"),
          period: item.period,
          calendarYear: item.calendarYear,
          receivablesTurnover,
          inventoryTurnover,
          turnoverDays: receivablesTurnover + inventoryTurnover,
        };
      });

      updateGraph(graphData);
      getGraphData(genGraphTableData(graphData));
    }
  }, [stock, period, reportType, getGraphData]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  if (isUnAvailable) {
    return <UnAvailable />;
  }

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
