import { useRecoilValue } from "recoil";
import { Chart } from "react-chartjs-2";
import { PERIOD, } from "types/common";
import { currentStock } from "recoil/selector";
import { fetchCompanyRatios } from "api/common";
import { getDataLimit } from "until";
import { OPTIONS } from "./GraphConfig";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Stack } from "@mui/material";
import TagCard from "../../../../component/tabCard";
import PeriodController from "component/PeriodController";

export default function PerStockShare() {
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  const [columnHeaders, setColumnHeaders] = useState<
    { field: string; headerName: string }[]
  >([]);
  const [rowData, setRowData] = useState<{ [key: string]: any }[]>([]);

  const defaultColDef = useMemo(() => {
    return {
      resizable: false,
      initialWidth: 200,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    };
  }, []);

  const [data, setData] = useState({
    labels: ["2021-01-01", "2022-01-01", "2023-01-01"],
    datasets: [
      {
        type: "bar" as const,
        label: "每股淨值",
        backgroundColor: "#405DF9",
        data: [0, 0, 0, 0],
        borderColor: "#405DF9",
        borderWidth: 1,
        yAxisID: "y",
        fill: false,
      },
    ],
  });

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
        },
      ];
      const rowData: { [key: string]: string } = {
        title: "每股淨值",
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

      setData({
        labels,
        datasets: [
          {
            type: "bar" as const,
            label: "每股淨值",
            backgroundColor: "rgba(64, 93, 249, 0.5)",
            data: chartData,
            borderColor: "#405DF9",
            borderWidth: 1,
            yAxisID: "y",
            fill: false,
          },
        ],
      });
    }
  }, [period, reportType, stock]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  return (
    <Stack rowGap={1}>
      <Box bgcolor="#fff" p={{ xs: 2, lg: 3 }} borderRadius="8px">
        <PeriodController
          onChangePeriod={setPeriod}
          onChangeReportType={setReportType}
        />
        <Box height={510} bgcolor="#fff" pb={3}>
          <Chart type="bar" data={data} options={OPTIONS as any} />
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
            defaultColDef={defaultColDef}
            domLayout="autoHeight"
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
