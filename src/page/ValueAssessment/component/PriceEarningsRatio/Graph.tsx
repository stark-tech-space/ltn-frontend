import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { IDateField, PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig, labelDataSets } from "./GraphConfig";
import { getDataLimit } from "until";
import { fetchProfitRatio } from "api/profitrato";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";

import PeriodController from "component/PeriodController";
import type { Chart } from "chart.js";
import { IValueAssessment } from "types/valueAssessment";
import { useAvgPriceByMonth } from "Hooks/common";
import { minBy, maxBy } from "lodash";
import moment from "moment";

interface IPriceEarningsFields extends IDateField {
  priceEarningsRatio: number;
  averagePriceEarningsRatio: number;
}

interface ISma {
  date: string;
  sma: number;
}

export const GRAPH_FIELDS = [
  {
    field: "priceEarningsRatio",
    headerName: "本益比",
  },
  {
    field: "averagePriceEarningsRatio",
    headerName: "月均價",
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
  const [smaData, setSmaData] = useState<ISma[]>([]);
  const [graphData, setGraphData] = useState<IPriceEarningsFields[]>([]);
  const avgPrice = useAvgPriceByMonth(period);

  const updateGraph = (data: IPriceEarningsFields[], smaData: ISma[]) => {
    if (chartRef.current) {
      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          if (index === 0) {
            // @ts-ignore
            chartRef.current.data.datasets[index].data = data.map((item) => ({
              x: item.date,
              y: +item[field as keyof IPriceEarningsFields],
            }));
          } else {
            // @ts-ignore
            chartRef.current.data.datasets[index].data = smaData.map(
              (item) => ({
                x: item.date,
                y: +item.sma,
              })
            );
          }
        }
      });
      chartRef.current.update();
    }
  };

  const genGraphTableData = <T extends IPriceEarningsFields>(
    data: T[],
    smaData: ISma[]
  ) => {
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

    GRAPH_FIELDS.forEach(({ field, headerName }, index) => {
      if (index === 0) {
        const dataSources: { [key: string]: any } = {
          title: headerName,
        };
        data?.forEach((item) => {
          if (reportType === PERIOD.ANNUAL) {
            dataSources[item.calendarYear] = (+item[field as keyof T]).toFixed(
              2
            );
          } else {
            dataSources[`${item.calendarYear}-${item.period}`] = (+item[
              field as keyof T
            ]).toFixed(2);
          }
        });
        rowData.push(dataSources);
      }
    });
    return [columnHeaders, rowData];
  };

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(reportType, period);
    const rst = await fetchProfitRatio<IValueAssessment[]>(
      stock.Symbol,
      reportType,
      limit
    );
    if (rst) {
      const data = rst.map((item) => ({
        date: moment(item.date, "YYYY-MM-DD")
          .startOf("quarter")
          .format("YYYY-MM-DD"),
        period: item.period,
        calendarYear: item.calendarYear,
        priceEarningsRatio: item.priceEarningsRatio,
        averagePriceEarningsRatio: 0,
      }));

      setGraphData(data);
    }
  }, [stock, period, reportType]);

  useEffect(() => {
    const minDateInData = minBy(graphData, "date")?.date || "";
    const maxDateInData = moment(maxBy(graphData, "date")?.date, "YYYY-MM-DD")
      .add(1, "day")
      .format("YYYY-MM-DD");

    const avgPrice = smaData.filter(
      (item) => item.date >= minDateInData && item.date <= maxDateInData
    );

    updateGraph(graphData, avgPrice);
    getGraphData(genGraphTableData(graphData, avgPrice));
  }, [graphData, smaData]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  useEffect(() => {
    if (avgPrice.length > 0) {
      setSmaData(avgPrice);
    }
  }, [avgPrice]);

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
