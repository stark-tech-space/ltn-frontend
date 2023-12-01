import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useRecoilValue } from "recoil";
import { getDataLimit } from "until";
import { fetchCashFlowStatement } from "api/cashflow";
import TagCard from "component/tabCard";
import { currentStock } from "recoil/selector";
import { PERIOD, PERIOD_YEAR } from "types/common";
import type { Chart } from "chart.js";
import { OPTIONS, GRAPH_DATA } from "./GraphConfig";
import { Chart as ReactChart } from "react-chartjs-2";
import { ICashFLowItem } from "types/cashflow";
import numeral from "numeral";

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

export default function CashFlow() {
  const stock = useRecoilValue(currentStock);
  const chartRef = useRef<Chart>();

  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);
  const [graphData, setGraphData] = useState<ICashFLowItem[]>([]);

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(reportType, period);
    const rst = await fetchCashFlowStatement(stock.Symbol, reportType, limit);
    if (rst) {
      setGraphData(rst);
      updateGraph(rst);
    }
  }, [stock, period, reportType]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

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

    return rowData;
  }, [graphData, reportType]);

  return (
    <Stack rowGap={1}>
      <TagCard tabs={["現金流表", "每股現金流表"]}>
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
          <ReactChart
            type="line"
            data={GRAPH_DATA}
            options={OPTIONS as any}
            ref={chartRef}
          />
        </Box>
      </TagCard>
      <TagCard tabs={["詳細數據"]}>
        <Box
          className="ag-theme-alpine"
          style={{
            paddingBottom: "24px",
          }}
        >
          <AgGridReact
            rowData={tableRowData}
            columnDefs={columnHeaders as any}
            domLayout="autoHeight"
            defaultColDef={{
              resizable: true,
              initialWidth: 200,
              wrapHeaderText: true,
              autoHeaderHeight: true,
            }}
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
