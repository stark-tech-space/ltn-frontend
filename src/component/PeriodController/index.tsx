import { Box, Button, ButtonGroup, Stack } from "@mui/material";
import { useState } from "react";

import { PERIOD_YEAR, PERIOD, PERIOD_TYPE } from "types/common";

export default function PeriodController({
  onChangePeriod,
  onChangeReportType,
  showReportType = true,
  showMonthType = false,
}: {
  showReportType?: boolean;
  showMonthType?: boolean;
  onChangePeriod?: (value: number, type?: PERIOD_TYPE) => void;
  onChangeReportType?: (value: PERIOD) => void;
}) {
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  return (
    <Stack
      className="period-controller"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
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
      <Box>
        {PERIOD_YEAR.map((item) => (
          <Button
            key={item.value}
            sx={{
              color: item.value === period ? "#405DF9" : "#333",
            }}
            onClick={() => {
              setPeriod(item.value);
              onChangePeriod?.(item.value, item.type);
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
      {showReportType && (
        <ButtonGroup variant="outlined">
          <Button
            variant={reportType === PERIOD.QUARTER ? "contained" : "outlined"}
            onClick={() => {
              setReportType(PERIOD.QUARTER);
              onChangeReportType?.(PERIOD.QUARTER);
            }}
          >
            季報
          </Button>
          <Button
            variant={reportType === PERIOD.ANNUAL ? "contained" : "outlined"}
            onClick={() => {
              setReportType(PERIOD.ANNUAL);
              onChangeReportType?.(PERIOD.ANNUAL);
            }}
          >
            年報
          </Button>
        </ButtonGroup>
      )}
    </Stack>
  );
}
