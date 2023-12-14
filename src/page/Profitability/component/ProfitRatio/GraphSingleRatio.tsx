import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig_01, singleLabelDataSets } from "./GrapConfig";
import type { Chart } from "chart.js";
import { getDataLimit } from "until";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { IProfitRatio } from "types/profitability";
import PeriodController from "component/PeriodController";
import { fetchProfitRatio } from "api/profitrato";

export const GRAPH_FIELDS = [
  {
    field: "effectiveTaxRate",
    headerName: "所得稅佔稅前淨利比",
  },
];

export default function GraphSingleRatio({
  getGraphData,
}: {
  getGraphData: (data: any[][]) => void;
}) {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  const updateGraph = (data: IProfitRatio[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof IProfitRatio],
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
          reportType === PERIOD.QUARTER ? `${item.calendarYear}-${item.period}` : item.calendarYear,
      });
    });

    GRAPH_FIELDS.forEach(({ field, headerName }) => {
      const dataSources: { [key: string]: any } = {
        title: headerName,
      };
      data?.forEach((item) => {
        if (reportType === PERIOD.ANNUAL) {
          dataSources[item.calendarYear] = (+item[field as keyof IProfitRatio] * 100).toFixed(2);
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
    const limit = getDataLimit(reportType, period);
    const rst = await fetchProfitRatio<IProfitRatio[]>(stock.Symbol, reportType, limit);
    if (rst) {
      const formatEffectiveTaxRate = (rst: IProfitRatio[]) =>
        rst.map((item) => ({
          ...item,
          effectiveTaxRate: Number((item.effectiveTaxRate * 100).toFixed(2)),
        }));

      updateGraph(formatEffectiveTaxRate(rst));
      getGraphData(genGraphTableData(rst));
    }
  }, [stock, period, reportType, getGraphData]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  return (
    <>
      <PeriodController onChangePeriod={setPeriod} onChangeReportType={setReportType} />
      <Box height={510} bgcolor="#fff" pb={3}>
        <ReactChart
          type="line"
          data={singleLabelDataSets}
          options={graphConfig_01 as any}
          ref={chartRef}
        />
      </Box>
    </>
  );
}
