import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IFinancialStatementRatio, PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig } from "./GrapConfig";
import type { Chart } from "chart.js";
import { getDataLimit } from "until";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { IProfitRatio } from "types/profitability";
import PeriodController from "component/PeriodController";
import { fetchGrowthRates } from "api/common";
import moment from "moment";
import { useAvgPriceByMonth } from "Hooks/common";

export const GRAPH_FIELDS = [
  {
    field: "growthRevenue",
    headerName: "營收年增率",
  },
];

interface ISma {
  date: string;
  sma: number;
}

const genStartDate = (years: number) => {
  return moment().subtract(years, "years").startOf("year").format("YYYY-MM-DD");
};

export default function Graph({ getGraphData }: { getGraphData: (data: any[][]) => void }) {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);
  const [smaData, setSmaData] = useState<ISma[]>([]);
  const [graphData, setGraphData] = useState<IFinancialStatementRatio[]>([]);
  const avgPrice = useAvgPriceByMonth(period);

  const updateGraph = (data: IFinancialStatementRatio[]) => {
    if (chartRef.current) {
      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map((item) => ({
            x: item.date,
            y: +item[field as keyof IFinancialStatementRatio] * (field === "payoutRatio" ? 100 : 1),
          }));
        }
      });
      chartRef.current.update();
    }
  };

  const genGraphTableData = (data: IFinancialStatementRatio[]) => {
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
    const rst = await fetchGrowthRates(stock.Symbol, PERIOD.QUARTER, limit);
    if (rst) {
      setGraphData(rst);
      getGraphData(genGraphTableData(rst));
    }
  }, [stock, period, reportType, getGraphData]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  useEffect(() => {
    if (avgPrice.length > 0) {
      setSmaData(avgPrice);
    }
  }, [avgPrice]);

  const graphDataSets = useMemo(() => {
    console.log("smaData", smaData);
    console.log("graphData", graphData);
    return {
      datasets: [
        {
          type: "line" as const,
          label: "月均價",
          borderColor: "#EB5757",
          backgroundColor: "#EB5757",
          borderWidth: 2,
          fill: false,
          data: smaData.map((item) => ({ x: item.date, y: item.sma })),
          yAxisID: "y",
        },
        {
          type: "line" as const,
          label: "營收年增率",
          backgroundColor: "rgb(0, 99, 232)",
          data: graphData.map((item) => ({
            x: item.date + "",
            y: +(item.growthRevenue * 100).toFixed(2),
          })),
          borderColor: "rgb(0, 99, 232)",
          borderWidth: 1,
          yAxisID: "y1",
          fill: false,
        },
      ],
    };
  }, [graphData, smaData]);

  return (
    <>
      <PeriodController
        onChangePeriod={setPeriod}
        onChangeReportType={setReportType}
        showReportType={false}
      />
      <Box height={510} bgcolor="#fff" pb={3}>
        <ReactChart type="line" data={graphDataSets} options={graphConfig as any} />
      </Box>
    </>
  );
}
