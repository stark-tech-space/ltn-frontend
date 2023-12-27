import { Box } from "@mui/material";
import KLineChart from "page/News/component/KlineChart";
import React from "react";

export default function Widget() {
  return (
    <Box sx={{ width: "100%", height: "100vh", bgcolor: "#fff" }}>
      <KLineChart height="calc(100vh - 48px)" />
    </Box>
  );
}
