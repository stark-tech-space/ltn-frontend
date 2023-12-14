import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig, labelDataSets } from "./GrapConfig";
import type { Chart } from "chart.js";
import { getDataLimit } from "until";
import { fetchProfitRatio } from "api/profitrato";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { IProfitRatio } from "types/profitability";
import PeriodController from "component/PeriodController";
import { fetchFindMindAPI } from "api/common";
import { IDividendPolicyItem } from "types/financial";
import moment from "moment";
import { groupBy, sumBy } from "lodash";
import numeral from "numeral";

export const GRAPH_FIELDS = [
  {
    field: "payoutRatio1",
    headerName: "現金股利",
  },
  {
    field: "payoutRatio",
    headerName: "現金股利發放率",
  },
];

const genStartDate = (years: number) => {
  return moment().subtract(years, "years").startOf("year").format("YYYY-MM-DD");
};

export default function Graph({
  getGraphData,
}: {
  getGraphData: (data: any[][]) => void;
}) {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.ANNUAL);

  const updateGraph = (data: IProfitRatio[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) =>
              +item[field as keyof IProfitRatio] *
              (field === "payoutRatio" ? 100 : 1)
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
          dataSources[item.calendarYear] = numeral(
            +item[field as keyof IProfitRatio] *
              (field === "payoutRatio" ? 100 : 1)
          ).format("0,0.00");
        } else {
          dataSources[`${item.calendarYear}-${item.period}`] = (+item[
            field as keyof IProfitRatio
          ]).toFixed(2);
        }
      });
      rowData.push(dataSources);
    });
    return [columnHeaders, rowData];
  };

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(reportType, period);
    const startDate = genStartDate(period);
    const rst = await fetchProfitRatio<IProfitRatio[]>(
      stock.Symbol,
      reportType,
      limit
    );
    const rst2 = await fetchFindMindAPI<IDividendPolicyItem[]>({
      data_id: stock.No,
      dataset: "TaiwanStockDividend",
      start_date: startDate,
    });

    if (rst) {
      if (rst2) {
        const finMindCashEarningByYear = groupBy(rst2 || [], (item) =>
          item.date.slice(0, 4)
        );
        rst.forEach((item) => {
          const date = item.date.split("-").slice(0, 2).join("-");
          if (reportType === PERIOD.QUARTER) {
            const target = rst2?.find((item2) => item2.date.startsWith(date));
            if (target) {
              //@ts-ignore
              item.payoutRatio1 = target.CashEarningsDistribution;
            }
            item.date = moment(item.date, "YYYY-MM-DD")
              .startOf("quarter")
              .format("YYYY-MM-DD");
          }
          if (reportType === PERIOD.ANNUAL) {
            item.date = moment(item.date, "YYYY-MM-DD")
              .startOf("year")
              .format("YYYY-MM-DD");
            const year = item.calendarYear;
            //@ts-ignore
            item.payoutRatio1 = sumBy(
              finMindCashEarningByYear[year],
              "CashEarningsDistribution"
            );
          }
        });
      }
      updateGraph(rst);
      getGraphData(genGraphTableData(rst));
    }
  }, [stock, period, reportType, getGraphData]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

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
