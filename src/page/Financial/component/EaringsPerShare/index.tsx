import { Stack, Box } from "@mui/material";
import React, { useMemo, useState } from "react";
import TagCard from "../../../../component/tabCard";
import EpsTable from "./EpsTable";
import EpsChart from "./EpsChart";

export default function EarningsPerShare() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Stack rowGap={1}>
      <TagCard
        tabs={["單季EPS", "近4季累積EPS", "每股盈餘(年)"]}
        onChange={setTabIndex}
      >
        <Box bgcolor="#fff">
          <EpsChart />
        </Box>
      </TagCard>
      <TagCard tabs={["詳細數據"]}>
        <EpsTable />
      </TagCard>
    </Stack>
  );
}
