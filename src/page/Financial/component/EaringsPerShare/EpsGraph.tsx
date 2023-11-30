import React, { useEffect, useRef, useState } from "react";
import { Box, Button, ButtonGroup, Stack } from "@mui/material";
import { Chart } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { OPTIONS } from "./GraphConfig";
import { PERIOD, PERIOD_YEAR } from "types/common";

export default function EpsGraph({
  getGraphData,
}: {
  getGraphData: (data: any) => void;
}) {
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

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
        {/* <Chart type="bar" data={data} options={OPTIONS as any} /> */}
      </Box>
    </>
  );
}
