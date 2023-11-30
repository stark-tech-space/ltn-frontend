import { Stack, Box, ButtonGroup, Button } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import TagCard from "../../../../component/tabCard";
import numeral from "numeral";
import { AgGridReact } from "ag-grid-react";
import { PERIOD, PERIOD_YEAR } from "types/common";
import { Chart } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { OPTIONS } from "./GraphConfig";

import { getDataLimit } from "until";
import { fetchKeyMetrics } from "api/common";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";

export default function EarningsPerShare() {
  const stock = useRecoilValue(currentStock);
  const [tabIndex, setTabIndex] = useState(0);

  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);
  const [graphData, setGraphData] = useState<
    {
      date: string;
      netIncomePerShare: number;
      period: string;
      calendarYear: string;
    }[]
  >([]);

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(reportType, period);
    const rst = await fetchKeyMetrics(stock.Symbol, reportType, limit);

    if (rst) {
      setGraphData(rst as any);
    }
  }, [period, reportType, stock]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

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
    const dataSources: { [key: string]: any } = {
      title: reportType === PERIOD.QUARTER ? "單季EPS" : "EPS",
    };
    graphData?.forEach((item) => {
      if (reportType === PERIOD.ANNUAL) {
        dataSources[item.calendarYear] = item.netIncomePerShare.toFixed(2);
      } else {
        dataSources[`${item.calendarYear}-${item.period}`] =
          item.netIncomePerShare.toFixed(2);
      }
    });
    return [dataSources];
  }, [graphData, reportType]);

  const graphDataSets = useMemo(() => {
    return {
      labels: graphData.map((item) => item.date),
      datasets: [
        {
          type: "line" as const,
          label: "月均價",
          borderColor: "#EB5757",
          borderWidth: 2,
          fill: false,
          data: new Array(graphData.length)
            .fill(0)
            .map((item) => +faker.finance.amount(300, 600)),
          yAxisID: "y1",
        },
        {
          type: "bar" as const,
          label: "單季度EPS",
          backgroundColor: "rgba(237, 88, 157, 0.15)",
          data: graphData.map((item) => +item.netIncomePerShare.toFixed(2)),
          borderColor: "rgba(237, 88, 157, 0.35)",
          borderWidth: 1,
          yAxisID: "y",
          fill: false,
        },
      ],
    };
  }, [graphData]);

  return (
    <Stack rowGap={1}>
      <TagCard
        tabs={["單季EPS", "近4季累積EPS"]}
        onChange={setTabIndex}
        visible={reportType !== PERIOD.ANNUAL}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: 3,
            px: 3,
            "&>button": {
              mx: 1,
              bgcolor: "transparent",
              border: 0,
              cursor: "pointer",
            },
          }}
        >
          <Box>
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
          </Box>
          <ButtonGroup variant="outlined">
            <Button
              variant={reportType === PERIOD.QUARTER ? "contained" : "outlined"}
              onClick={() => setReportType(PERIOD.QUARTER)}
            >
              季報
            </Button>
            <Button
              variant={reportType === PERIOD.ANNUAL ? "contained" : "outlined"}
              onClick={() => setReportType(PERIOD.ANNUAL)}
            >
              年報
            </Button>
          </ButtonGroup>
        </Stack>
        <Box height={510} bgcolor="#fff" pb={3}>
          <Chart type="bar" data={graphDataSets} options={OPTIONS as any} />
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
            rowData={tableRowData as any}
            columnDefs={columnHeaders as any}
            defaultColDef={{
              resizable: true,
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
