import { Box } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { IDateField, PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig, labelDataSets } from "./GraphConfig";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";

import PeriodController from "component/PeriodController";
import type { Chart } from "chart.js";
import { useAvgPriceByMonth } from "Hooks/common";
import moment from "moment";
import { fetchDividendHistorical } from "api/value";
import { IDividendPerShareHistorical } from "types/value";

interface IDividendYieldRatio extends IDateField {
  dividendYield: number;
  averagePriceEarningsRatio: number;
}

export const GRAPH_FIELDS = [
  {
    field: "dividendYield",
    headerName: "現金股利殖利率",
  },
  {
    field: "averagePriceEarningsRatio",
    headerName: "月均價",
  },
];

const TABLE_FIELDS = [
  {
    field: "dividendYield",
    headerName: "現金股利殖利率",
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
  const [dividendPerShare, setDividendPerShare] = useState<
    Array<IDividendPerShareHistorical>
  >([]);

  const avgPrice = useAvgPriceByMonth(period);

  const finalData: Array<IDividendYieldRatio> = useMemo(() => {
    return avgPrice.map((item) => {
      const period = item.date.slice(5, 7);
      const availableTimeRangeStart = moment(item.date, "YYYY-MM-DD")
        .subtract(1, "year")
        .format("YYYY-MM-DD");
      const availableTimeRangeEnd = moment(item.date, "YYYY-MM-DD")
        .subtract(1, "day")
        .format("YYYY-MM-31");

      const dataAvailable = dividendPerShare.filter(
        (item) =>
          item.date >= availableTimeRangeStart &&
          item.date <= availableTimeRangeEnd
      );
      const dividendSum = dataAvailable.reduce(
        (prev, cur) => prev + (cur.dividend || NaN),
        0
      );

      return {
        date: item.date,
        calendarYear: item.date.slice(0, 4),
        period: period,
        averagePriceEarningsRatio: item.sma,
        dividendYield: (dividendSum * 100) / item.sma,
      };
    });
  }, [avgPrice, dividendPerShare]);

  const updateGraph = (data: IDividendYieldRatio[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof IDividendYieldRatio]
          );
        }
      });
      chartRef.current.update();
    }
  };

  const genGraphTableData = <T extends IDividendYieldRatio>(data: T[]) => {
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
    const periodTime = `${
      parseInt(moment().format("YYYY")) - period - 1
    }-00-00`;
    fetchDividendHistorical<{ historical: Array<IDividendPerShareHistorical> }>(
      stock.Symbol
    ).then((res) => {
      setDividendPerShare(
        res?.historical
          .filter((item) => item.date > periodTime)
          .sort((a, b) => (a?.date > b?.date ? -1 : 1)) || []
      );
    });
  }, [stock.Symbol, period]);

  useEffect(() => {
    updateGraph(finalData);
    getGraphData(genGraphTableData(finalData));
  }, [finalData]);

  return (
    <>
      <PeriodController
        onChangePeriod={setPeriod}
        onChangeReportType={setReportType}
        showReportType={false}
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
