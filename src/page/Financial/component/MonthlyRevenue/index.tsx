import { Stack, Box } from "@mui/material";
import React, { useMemo, useState } from "react";
import TagCard from "../../../../component/tabCard";
import EpsTable from "./EpsTable";
import EpsChart from "./EpsChart";

export default function EarningsPerShare() {
  return (
    <Stack rowGap={1}>
      <TagCard tabs={["每月營收", "月每股營收"]}>
        <Box height={509} bgcolor="#fff">
          <EpsChart />
        </Box>
      </TagCard>
      <TagCard tabs={["詳細數據"]}>
        <EpsTable />
      </TagCard>
    </Stack>
  );
}
