import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, ButtonGroup, Stack } from "@mui/material";
import { Chart } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { OPTIONS } from "./GraphConfig";
import { PERIOD, PERIOD_YEAR } from "types/common";
import { getDataLimit } from "until";
import { fetchKeyMetrics } from "api/common";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";

export default function EpsGraph({
  getGraphData,
  getReport,
}: {
  getReport: (data: PERIOD) => void;
  getGraphData: (data: any) => void;
}) {
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);
  const [graphData, setGraphData] = useState<{ date: string; netIncomePerShare: number }[]>([]);

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(reportType, period);
    const rst = await fetchKeyMetrics(stock.Symbol, reportType, limit);

    if (rst) {
      setGraphData(rst as any);
      getGraphData(rst as any);
    }
  }, [period, reportType, stock, getGraphData]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

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
          data: new Array(graphData.length).fill(0).map((item) => +faker.finance.amount(300, 600)),
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
    <>
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
    </>
  );
}
