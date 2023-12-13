import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IDateField, PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig, labelDataSets } from "./GraphConfig";
import { getDataLimit } from "until";
import { maxBy, minBy } from "lodash";
import moment from "moment";
import { fetchProfitRatio } from "api/profitrato";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";

import PeriodController from "component/PeriodController";
import type { Chart } from "chart.js";
import { IValueAssessment } from "types/valueAssessment";

import { useAvgPriceByMonth } from "Hooks/common";
import numeral from "numeral";

interface IPriceToBookRatio extends IDateField {
  priceToBookRatio: number;
  averagePriceEarningsRatio: number;
}

export const GRAPH_FIELDS = [
  {
    field: "priceToBookRatio",
    headerName: "股價淨值比",
  },
  {
    field: "averagePriceEarningsRatio",
    headerName: "月均價",
  },
];

const TABLE_FIELDS = [
  {
    field: "priceToBookRatio",
    headerName: "股價淨值比",
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
  const [data, setData] = useState<Array<IPriceToBookRatio>>([]);

  const avgPrice = useAvgPriceByMonth(period);

  const finalData = useMemo(() => {
    const minDateInData = minBy(data, "date")?.date || "";
    const maxDateInData = moment(maxBy(data, "date")?.date, "YYYY-MM-DD")
      .add(1, "day")
      .format("YYYY-MM-DD");
    return data
      .concat(
        avgPrice
          .filter(
            (item) => item.date >= minDateInData && item.date <= maxDateInData
          )
          .map((item) => ({
            date: item.date,
            calendarYear: item.date.slice(0, 4),
            period: "",
            averagePriceEarningsRatio: item.sma,
            priceToBookRatio: NaN,
          }))
      )
      .sort((a, b) => (a.date > b.date ? -1 : 1));
  }, [data, avgPrice]);

  const updateGraph = (data: IPriceToBookRatio[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof IPriceToBookRatio]
          );
        }
      });
      chartRef.current.update();
    }
  };

  const genGraphTableData = <T extends IPriceToBookRatio>(data: T[]) => {
    if (data.length === 0) {
      return [[], []];
    }
    const dataAvailable = data.filter((item) =>
      TABLE_FIELDS.every(({ field }) => !Number.isNaN(item[field as keyof T]))
    );
    const rowData: any[] = [];
    const columnHeaders: any[] = [
      {
        field: "title",
        headerName: reportType === PERIOD.QUARTER ? "年度/季度" : "年度",
        pinned: "left",
      },
    ];

    dataAvailable?.forEach((item) => {
      columnHeaders.push({
        field:
          reportType === PERIOD.QUARTER
            ? `${item.calendarYear}-${item.period}`
            : item.calendarYear,
      });
    });

    TABLE_FIELDS.forEach(({ field, headerName }) => {
      const dataSources: { [key: string]: any } = {
        title: headerName,
      };
      dataAvailable?.forEach((item) => {
        if (reportType === PERIOD.ANNUAL) {
          dataSources[item.calendarYear] = numeral(
            item[field as keyof T]
          ).format("0,0.00");
        } else {
          dataSources[`${item.calendarYear}-${item.period}`] = numeral(
            item[field as keyof T]
          ).format("0,0.00");
        }
      });
      rowData.push(dataSources);
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
        date: moment(item.date).startOf("quarter").format("YYYY-MM-DD"),
        period: item.period,
        calendarYear: item.calendarYear,
        priceToBookRatio: item.priceToBookRatio,
        averagePriceEarningsRatio: NaN,
      }));
      setData(data);
    }
  }, [stock, period, reportType]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  useEffect(() => {
    updateGraph(finalData);
    getGraphData(genGraphTableData(finalData));
  }, [finalData]);

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
