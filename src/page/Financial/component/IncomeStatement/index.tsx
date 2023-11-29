import { Stack, Box } from "@mui/material";
import React, { useMemo, useState } from "react";
import TagCard from "../../../../component/tabCard";

export default function IncomeStatement() {
  return (
    <Stack rowGap={1}>
      <Box height={510} bgcolor="#fff"></Box>

      <TagCard tabs={["詳細數據"]}>
        <div>table</div>
      </TagCard>
    </Stack>
  );
}
