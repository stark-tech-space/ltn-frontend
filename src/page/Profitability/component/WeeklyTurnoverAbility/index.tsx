import { Stack, Box, Button } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import TagCard from "../../../../component/tabCard";

import { Chart as ReactChart } from "react-chartjs-2";
import { AgGridReact } from "ag-grid-react";
import numeral from "numeral";

import { IProfitRatio } from "types/profitability";
import { PERIOD, PERIOD_YEAR } from "types/common";
import { getDataLimit } from "until";

import { currentStock } from "recoil/selector";
import { useRecoilValue } from "recoil";
import { fetchProfitRatio } from "api/profitrato";
import { TURNOVER_DATASETS, TURNOVER_GRAPH_OPTIONS } from "./GrapConfig";
import { Chart } from "chart.js";

const TABLE_FIELDS: Record<
  string,
  Array<{ field: string; headerName: string }>
> = {
  "0": [
    {
      field: "receivablesTurnover",
      headerName: "應收帳款週轉",
    },
    {
      field: "inventoryTurnover",
      headerName: "存貨週轉",
    },
  ],
  "1": [
    {
      field: "",
      headerName: "固定資產",
    },
    {
      field: "fixedAssetTurnover",
      headerName: "固定資產周轉",
    },
  ],
  "2": [
    {
      field: "TotalAssets",
      headerName: "總資產",
    },
    {
      field: "assetTurnover",
      headerName: "總資產週轉",
    },
  ],
};

export default function WeeklyTurnoverAbility() {
  const stock = useRecoilValue(currentStock);
  const chartRef = useRef<Chart>();

  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<IProfitRatio[]>([]);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState<PERIOD>(PERIOD.QUARTER);

  const handleUpdateGraph = (data: IProfitRatio[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      TABLE_FIELDS[tabIndex].forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof IProfitRatio]
          );
        }
      });

      chartRef.current.update();
    }
  };

  useEffect(() => {
    const limit = getDataLimit(reportType, period);
    fetchProfitRatio<IProfitRatio[]>(stock.Symbol, PERIOD.QUARTER, limit).then(
      (res) => {
        setData(res || []);
        handleUpdateGraph(res || []);
      }
    );
  }, [stock, reportType, period]);

  useEffect(() => {
    handleUpdateGraph(data);
  }, [tabIndex]);

  const columnHeaders = useMemo(() => {
    const columns: any[] = [
      {
        field: "title",
        headerName: reportType === PERIOD.QUARTER ? "年度/季度" : "年度",
        pinned: "left",
      },
    ];
    data?.forEach((item) => {
      columns.push({
        field:
          reportType === PERIOD.QUARTER
            ? `${item.calendarYear}-${item.period}`
            : item.calendarYear,
      });
    });
    return columns;
  }, [data, reportType]);

  const tableRowData = useMemo(
    () =>
      TABLE_FIELDS[tabIndex.toString()].map(({ headerName, field }) => {
        const dataSources: { [key: string]: any } = {
          title: headerName,
        };

        data?.forEach((item) => {
          if (reportType === PERIOD.ANNUAL) {
            dataSources[item.calendarYear] = numeral(
              item[field as keyof IProfitRatio]
            ).format("0,0.000");
          } else {
            dataSources[`${item.calendarYear}-${item.period}`] = numeral(
              item[field as keyof IProfitRatio]
            ).format("0,0.000");
          }
        });
        return dataSources;
      }),
    [data, reportType, tabIndex]
  );

  return (
    <Stack rowGap={1}>
      {/* 資產的資料問題，先不做固定資產周轉與總資展週轉 */}
      {/* <TagCard tabs={["營運周轉", "固定資產周轉", "總資產周轉"]} onChange={setTabIndex}> */}
      <TagCard tabs={["營運周轉"]} onChange={setTabIndex}>
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
        <Box bgcolor="#fff" height={510}>
          <ReactChart
            type="line"
            data={TURNOVER_DATASETS[tabIndex.toString()]}
            options={TURNOVER_GRAPH_OPTIONS[tabIndex.toString()]}
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
            defaultColDef={{
              resizable: false,
              initialWidth: 200,
              wrapHeaderText: true,
              autoHeaderHeight: true,
              // flex: 1,
            }}
            domLayout="autoHeight"
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
