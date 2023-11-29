import React, { useEffect, useRef, useState } from "react";
import { Box, Button, ButtonGroup, Stack } from "@mui/material";
import { Chart } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { OPTIONS } from "./GraphConfig";
import { PERIOD, PERIOD_YEAR } from "types/common";

const labels = [
  "2021-01",
  "2021-02",
  "2021-03",
  "2021-04",
  "2021-05",
  "2021-06",
  "2021-07",
  "2021-08",
  "2021-09",
  "2021-10",
  "2021-11",
  "2021-12",
  "2022-01",
  "2022-02",
  "2022-03",
  "2022-04",
  "2022-05",
  "2022-06",
  "2022-07",
  "2022-08",
  "2022-09",
  "2022-10",
  "2022-11",
  "2022-12",
  "2023-01",
  "2023-02",
  "2023-03",
  "2023-04",
  "2023-05",
  "2023-06",
  "2023-07",
  "2023-08",
  "2023-09",
  "2023-10",
  "2023-11",
  "2023-12",
];

export default function EpsChart() {
  const [period, setPeriod] = useState(3);

  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  const [data, setData] = useState({
    labels,
    datasets: [
      {
        type: "line" as const,
        label: "月均價",
        borderColor: "#EB5757",
        borderWidth: 2,
        fill: false,
        data: labels.map(() => +faker.finance.amount(200, 600)),
        yAxisID: "y1",
      },
      {
        type: "bar" as const,
        label: "每月營收",
        backgroundColor: "rgba(237, 88, 157, 0.15)",
        data: labels.map(() => +faker.finance.amount(1200, 10000)),
        borderColor: "rgba(237, 88, 157, 0.35)",
        borderWidth: 1,
        yAxisID: "y",
        fill: false,
      },
    ],
  });

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
        <Chart type="bar" data={data} options={OPTIONS as any} />
      </Box>
    </>
  );
}
