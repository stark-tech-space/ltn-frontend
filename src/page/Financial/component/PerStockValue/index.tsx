import { useRecoilValue } from "recoil";
import { Box, Stack } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PERIOD } from "types/common";
import { currentStock } from "recoil/selector";
import { fetchCompanyRatios } from "api/common";
import WrappedAgGrid from "component/WrappedAgGrid";
import { getDataLimit } from "until";
import { OPTIONS, labelDataSets } from "./GraphConfig";
import type { Chart } from "chart.js";
import { Chart as ReactChart } from "react-chartjs-2";
import PeriodController from "component/PeriodController";
import TagCard from "../../../../component/tabCard";
import { useAvgPriceByMonth } from "Hooks/common";
import moment from "moment";
import { maxBy, minBy } from "lodash";

export default function PerStockShare() {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  const [columnHeaders, setColumnHeaders] = useState<
    { field: string; headerName: string }[]
  >([]);
  const [rowData, setRowData] = useState<{ [key: string]: any }[]>([]);
  const [dataDateInfo, setDataDateInfo] = useState<{
    start: string;
    end: string;
  }>({ start: "", end: "" });

  const avgPrice = useAvgPriceByMonth(period);

  const filteredAvgPrice = useMemo(
    () =>
      dataDateInfo.start && dataDateInfo.end
        ? avgPrice.filter(
            ({ date }) => dataDateInfo.start <= date && date <= dataDateInfo.end
          )
        : avgPrice,
    [dataDateInfo, avgPrice]
  );

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(reportType, period);
    const rst = await fetchCompanyRatios(stock.Symbol, reportType, limit);
    if (rst) {
      const data = rst?.reverse();
      const chartData: Array<{ x: string; y: number }> = [];
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

      data.forEach((item, index) => {
        const field =
          reportType === PERIOD.ANNUAL
            ? item.calendarYear.toString()
            : `${item.calendarYear}-${item.period}`;

        chartData.push({
          x: moment(item.date, "YYYY-MM-DD")
            .startOf("quarter")
            .format("YYYY-MM-DD"),
          y: item.bookValuePerShare,
        });
        columnHeaders.push({ field });
        rowData[field] = item.bookValuePerShare.toFixed(2);
      });

      setColumnHeaders(columnHeaders as any);
      setRowData([rowData]);
      setDataDateInfo({
        start:
          moment(minBy(rst, "date")?.date, "YYYY-MM-DD")
            .startOf("quarter")
            .format("YYYY-MM-DD") || "",
        end:
          moment(maxBy(rst, "date")?.date, "YYYY-MM-DD")
            .endOf("quarter")
            .format("YYYY-MM-DD") || "",
      });

      if (chartRef.current) {
        // @ts-ignore
        chartRef.current.data.datasets[0].data = chartData;
        chartRef.current.update();
      }
    }
  }, [period, reportType, stock.Symbol]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  useEffect(() => {
    if (chartRef.current && filteredAvgPrice.length > 0) {
      //@ts-ignore
      chartRef.current.data.datasets[1].data = filteredAvgPrice.map((item) => ({
        x: item.date,
        y: item.sma,
      }));
      chartRef.current.update();
    }
  }, [filteredAvgPrice]);

  return (
    <Stack rowGap={1}>
      <Box bgcolor="#fff" p={{ xs: 2, lg: 3 }} borderRadius="8px">
        <PeriodController
          onChangePeriod={setPeriod}
          onChangeReportType={setReportType}
          showReportType={false}
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
          <WrappedAgGrid
            rowData={rowData as any}
            columnDefs={columnHeaders as any}
            defaultColDef={{
              resizable: false,
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
