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
import numeral from "numeral";

interface IAvgDividendYieldRatio extends IDateField {
  dividendYield: number;
  averagePriceEarningsRatio: number;
  threeYearAvgDividendYield: number;
  fiveYearAvgDividendYield: number;
}

export const GRAPH_FIELDS = [
  {
    field: "dividendYield",
    headerName: "現金股利殖利率",
  },
  {
    field: "threeYearAvgDividendYield",
    headerName: "3年平均現金股息殖利率",
  },
  {
    field: "fiveYearAvgDividendYield",
    headerName: "5年平均現金股息殖利率",
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
  {
    field: "threeYearAvgDividendYield",
    headerName: "3年平均現金股息殖利率",
  },
  {
    field: "fiveYearAvgDividendYield",
    headerName: "5年平均現金股息殖利率",
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

  const finalData: Array<IAvgDividendYieldRatio> = useMemo(() => {
    const handleGetTimeRange = (date: string, timeLength: number) => {
      const start = moment(date, "YYYY-MM-DD")
        .subtract(timeLength, "year")
        .format("YYYY-MM-DD");
      const end = moment(date, "YYYY-MM-DD")
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      return { start, end };
    };
    const handleGetTimeRangeByYear = (date: string, timeLength: number) => {
      const start = moment(date, "YYYY-MM-DD")
        .subtract(timeLength + 1, "year")
        .format("YYYY-MM-DD");
      const end = moment(date, "YYYY-MM-DD")
        .subtract(timeLength, "day")
        .format("YYYY-MM-DD");
      return { start, end };
    };

    return avgPrice.map((item) => {
      const period = item.date.slice(5, 7);
      // 現金殖利率
      const dividendYieldRange = handleGetTimeRange(item.date, 1);
      const dataAvailable = dividendPerShare.filter(
        (item) =>
          item.date >= dividendYieldRange.start &&
          item.date <= dividendYieldRange.end
      );
      const dividendSum = dataAvailable.reduce(
        (prev, cur) => prev + (cur.dividend || 0),
        0
      );

      const yearDividendSum = Array.from({ length: 5 }).map((_, index) => {
        const range = handleGetTimeRangeByYear(item.date, index);
        const dividendData = dividendPerShare.filter(
          (item) => item.date > range.start && item.date <= range.end
        );
        return dividendData.reduce(
          (prev, cur) => prev + (cur.dividend || 0),
          0
        );
      });
      // 3年平均
      const threeDividendRange = handleGetTimeRange(item.date, 3);
      const threeDividendData = dividendPerShare.filter(
        (item) =>
          item.date > threeDividendRange.start &&
          item.date <= threeDividendRange.end
      );
      const threeDividendSum = threeDividendData.reduce(
        (prev, cur) => prev + (cur.dividend || 0),
        0
      );
      // 5年平均
      const fiveDividendRange = handleGetTimeRange(item.date, 5);
      const fiveDividendData = dividendPerShare.filter(
        (item) =>
          item.date > fiveDividendRange.start &&
          item.date <= fiveDividendRange.end
      );
      const fiveDividendSum = fiveDividendData.reduce(
        (prev, cur) => prev + (cur.dividend || 0),
        0
      );

      return {
        date: item.date,
        calendarYear: item.date.slice(0, 4),
        period: period,
        averagePriceEarningsRatio: item.sma,
        dividendYield: (dividendSum * 100) / item.sma,
        threeYearAvgDividendYield: (threeDividendSum * 100) / 3 / item.sma,
        fiveYearAvgDividendYield: (fiveDividendSum * 100) / 5 / item.sma,
      };
    });
  }, [avgPrice, dividendPerShare]);

  const updateGraph = (data: IAvgDividendYieldRatio[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof IAvgDividendYieldRatio]
          );
        }
      });
      chartRef.current.update();
    }
  };

  const genGraphTableData = <T extends IAvgDividendYieldRatio>(data: T[]) => {
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
