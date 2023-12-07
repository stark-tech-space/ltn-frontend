import { useRecoilValue } from "recoil";
import { Box, Stack } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { PERIOD } from "types/common";
import { currentStock } from "recoil/selector";
import { fetchCompanyRatios } from "api/common";
import { AgGridReact } from "ag-grid-react";
import { getDataLimit } from "until";
import { OPTIONS, labelDataSets } from "./GraphConfig";
import type { Chart } from "chart.js";
import { Chart as ReactChart } from "react-chartjs-2";
import PeriodController from "component/PeriodController";
import TagCard from "../../../../component/tabCard";
import { useAvgPriceByMonth } from "Hooks/common";

export default function PerStockShare() {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  const [columnHeaders, setColumnHeaders] = useState<
    { field: string; headerName: string }[]
  >([]);
  const [rowData, setRowData] = useState<{ [key: string]: any }[]>([]);

  const avgPrice = useAvgPriceByMonth(period - 1);

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(reportType, period);
    const rst = await fetchCompanyRatios(stock.Symbol, reportType, limit);

    if (rst) {
      const labels: string[] = [];
      const chartData: number[] = [];

      const columnHeaders: {
        field: string;
        headerName?: string;
        pinned?: string;
      }[] = [
        {
          field: "title",
          headerName: reportType === PERIOD.ANNUAL ? "年度" : "年度/季度",
          pinned: "left",
        },
      ];
      const rowData: { [key: string]: string } = {
        title: "每股淨值",
        pinned: "left",
      };

      rst.forEach((item, index) => {
        const field =
          reportType === PERIOD.ANNUAL
            ? item.calendarYear.toString()
            : `${item.calendarYear}-${item.period}`;

        labels.push(item.date.toString());
        chartData.push(item.bookValuePerShare);
        columnHeaders.push({ field });
        rowData[field] = item.bookValuePerShare.toFixed(2);
      });

      setColumnHeaders(columnHeaders as any);
      setRowData([rowData]);

      if (chartRef.current) {
        chartRef.current.data.labels = labels;
        chartRef.current.data.datasets[0].data = chartData;
        chartRef.current.update();
      }
    }
  }, [period, reportType, stock.Symbol]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  useEffect(() => {
    if (chartRef.current && avgPrice.length > 0) {
      chartRef.current.data.datasets[1].data = avgPrice.map((item) => item.sma);
      chartRef.current.update();
    }
  }, [avgPrice]);

  return (
    <Stack rowGap={1}>
      <Box bgcolor="#fff" p={{ xs: 2, lg: 3 }} borderRadius="8px">
        <PeriodController
          onChangePeriod={setPeriod}
          onChangeReportType={setReportType}
        />
        <Box height={510} bgcolor="#fff" pb={3}>
          <ReactChart
            type="bar"
            data={labelDataSets}
            options={OPTIONS as any}
            ref={chartRef}
          />
        </Box>
      </Box>
      <TagCard tabs={["詳細數據"]}>
        <Box
          className="ag-theme-alpine"
          style={{
            paddingBottom: "24px",
          }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={columnHeaders as any}
            defaultColDef={{
              resizable: false,
              initialWidth: 200,
              wrapHeaderText: true,
              autoHeaderHeight: true,
            }}
            domLayout="autoHeight"
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
