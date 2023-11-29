import { Stack, Box } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import TagCard from "../../../../component/tabCard";
import EpsTable from "./EpsTable";
import MonthlyIncomeChart from "./MonthlyIncomeChart";
import PerStockIncomeChart from "./PerStockIncomeChart";

export default function EarningsPerShare() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Stack rowGap={1}>
      <TagCard tabs={["每月營收", "月每股營收"]} onChange={setTabIndex}>
        <Box bgcolor="#fff">
          <div style={{ display: tabIndex === 0 ? "block" : "none" }}>
            <MonthlyIncomeChart />
          </div>
          <div style={{ display: tabIndex === 1 ? "block" : "none" }}>
            <PerStockIncomeChart />
          </div>
        </Box>
      </TagCard>
      <TagCard tabs={["詳細數據"]}>
        <EpsTable />
      </TagCard>
    </Stack>
  );
}
