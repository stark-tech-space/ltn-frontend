import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import WrappedAgGrid from "component/WrappedAgGrid";
import { useRecoilValue } from "recoil";
import { getDataLimit } from "until";
import { fetchCashFlowStatement } from "api/cashflow";
import TagCard from "component/tabCard";
import { stockPerQuarterCountState } from "recoil/atom";
import { currentStock } from "recoil/selector";
import { PERIOD, PERIOD_YEAR } from "types/common";
import { Chart } from "chart.js";
import { OPTIONS, GRAPH_DATA } from "./GraphConfig";
import { PER_SHARE_OPTIONS, PER_SHARE_GRAPH_DATA } from "./GraphConfigPerShare";
import { Chart as ReactChart } from "react-chartjs-2";
import { ICashFLowItem } from "types/cashflow";
import numeral from "numeral";
import moment from "moment";

const GRAPH_FIELDS = [
  {
    field: "netCashProvidedByOperatingActivities",
    headerName: "營業現金流量",
  },
  {
    field: "netCashUsedProvidedByFinancingActivities",
    headerName: "融資現金流量",
  },
  {
    field: "netCashUsedForInvestingActivites",
    headerName: "投資現金流量",
  },
  {
    field: "freeCashFlow",
    headerName: "自由現金流量",
  },
  {
    field: "netChangeInCash",
    headerName: "淨現金流量",
  },
];

const PER_STOCK_GRAPH_FIELDS = [
  {
    field: "netCashProvidedByOperatingActivities",
    headerName: "每股營業現金流入",
  },
  {
    field: "netCashUsedProvidedByFinancingActivities",
    headerName: "每股融資現金流入",
  },
  {
    field: "netCashUsedForInvestingActivites",
    headerName: "每股投資現金流出",
  },
  {
    field: "freeCashFlow",
    headerName: "每股自由現金流量流入",
  },
  {
    field: "netChangeInCash",
    headerName: "每股淨現金流入",
  },
];

export default function CashFlow() {
  const stock = useRecoilValue(currentStock);
  const stockCountByQuarterArray = useRecoilValue(stockPerQuarterCountState);
  const chartRef = useRef<Chart>();
  const perShareChartRef = useRef<Chart>();

  const [tab, setTab] = useState(0);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);
  const [graphData, setGraphData] = useState<ICashFLowItem[]>([]);

  const stockCountByPeriod = useMemo(() => {
    if (reportType === PERIOD.QUARTER) {
      return Object.fromEntries(
        stockCountByQuarterArray.map(({ date, StockCount }) => [
          moment(date).startOf("quarter").format("YYYY-MM-DD"),
          StockCount,
        ])
      );
    }

    if (reportType === PERIOD.ANNUAL) {
      return stockCountByQuarterArray.reduce<Record<string, number>>(
        (prev, { date, StockCount }) => {
          const year = date.slice(0, 4);
          if (prev[year]) {
            prev[year] += StockCount;
          } else {
            prev[year] = StockCount;
          }
          return prev;
        },
        {}
      );
    }

    return {};
  }, [stockCountByQuarterArray, reportType]);

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(reportType, period);
    const rst = await fetchCashFlowStatement(stock.Symbol, reportType, limit);

    if (rst) {
      const data = rst.map((item) => ({
        ...item,
        date: moment(item.date, "YYYY-MM-DD")
          .startOf("quarter")
          .format("YYYY-MM-DD"),
      }));

      setGraphData(data.reverse());
      updateGraph(data);
    }
  }, [stock, period, reportType]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  useEffect(() => {
    updateGraph(graphData);
  }, [tab]);

  const handleChangeTab = (index: number) => {
    setTab(index);
  };

  const updateGraph = (data: ICashFLowItem[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof ICashFLowItem] / 1000
          );
        }
      });
      chartRef.current.update();
    }
    if (perShareChartRef.current) {
      const labels = data.map((item) => item.date);
      perShareChartRef.current.data.labels = labels;
      PER_STOCK_GRAPH_FIELDS.forEach(({ field }, index) => {
        if (perShareChartRef.current) {
          if (reportType === PERIOD.ANNUAL) {
            perShareChartRef.current.data.datasets[index].data = data.map(
              (item) =>
                +item[field as keyof ICashFLowItem] /
                (stockCountByPeriod[item.calendarYear] || 0)
            );
          }
          if (reportType === PERIOD.QUARTER) {
            perShareChartRef.current.data.datasets[index].data = data.map(
              (item) =>
                +item[field as keyof ICashFLowItem] /
                (stockCountByPeriod[item.date] || 0)
            );
          }
        }
      });

      perShareChartRef.current.update();
    }
  };

  const columnHeaders = useMemo(() => {
    const columns: any[] = [
      {
        field: "title",
        headerName: reportType === PERIOD.QUARTER ? "年度/季度" : "年度",
        pinned: "left",
      },
    ];
    graphData?.forEach((item) => {
      columns.push({
        field:
          reportType === PERIOD.QUARTER
            ? `${item.calendarYear}-${item.period}`
            : item.calendarYear,
      });
    });
    return columns;
  }, [graphData, reportType]);

  const tableRowData = useMemo(() => {
    const rowData: any[] = [];
    if (tab === 0) {
      GRAPH_FIELDS.forEach(({ field, headerName }) => {
        const dataSources: { [key: string]: any } = {
          title: headerName,
        };

        graphData?.forEach((item) => {
          if (reportType === PERIOD.ANNUAL) {
            dataSources[item.calendarYear] = numeral(
              item[field as keyof ICashFLowItem]
            ).format("0,0");
          } else {
            dataSources[`${item.calendarYear}-${item.period}`] = numeral(
              item[field as keyof ICashFLowItem]
            ).format("0,0");
          }
        });
        rowData.push(dataSources);
      });
    }

    if (tab === 1) {
      PER_STOCK_GRAPH_FIELDS.forEach(({ field, headerName }) => {
        const dataSources: { [key: string]: any } = {
          title: headerName,
        };

        graphData?.forEach((item) => {
          if (reportType === PERIOD.ANNUAL) {
            dataSources[item.calendarYear] = numeral(
              Number(item[field as keyof ICashFLowItem]) /
                stockCountByPeriod[item.calendarYear]
            ).format("0,0");
          } else {
            dataSources[`${item.calendarYear}-${item.period}`] = numeral(
              Number(item[field as keyof ICashFLowItem]) /
                (stockCountByPeriod[item.date] || 0)
            ).format("0,0.00");
          }
        });
        rowData.push(dataSources);
      });
    }
    return rowData;
  }, [graphData, reportType, tab, stockCountByPeriod]);

  return (
    <Stack rowGap={1}>
      <TagCard tabs={["現金流表", "每股現金流表"]} onChange={handleChangeTab}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            mb: 3,
            "&>button": {
              mx: 1,
              bgcolor: "transparent",
              border: 0,
              cursor: "pointer",
            },
          }}
        >
          {PERIOD_YEAR.map((item) => (
            <Button
              key={item.value}
              sx={{
                color: item.value === period ? "primary" : "#333",
              }}
              onClick={() => setPeriod(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
        <Box height={510} bgcolor="#fff" pb={3}>
          {tab === 0 && (
            <ReactChart
              type="line"
              data={GRAPH_DATA}
              options={OPTIONS as any}
              ref={chartRef}
            />
          )}
          {tab === 1 && (
            <ReactChart
              type="line"
              data={PER_SHARE_GRAPH_DATA}
              options={PER_SHARE_OPTIONS as any}
              ref={perShareChartRef}
            />
          )}
        </Box>
      </TagCard>
      <TagCard tabs={["詳細數據"]}>
        <Box
          className="ag-theme-alpine"
          style={{
            paddingBottom: "24px",
          }}
        >
          <WrappedAgGrid
            rowData={tableRowData}
            columnDefs={columnHeaders as any}
            defaultColDef={{
              resizable: true,
              initialWidth: 160,
              wrapHeaderText: true,
              autoHeaderHeight: true,
            }}
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
