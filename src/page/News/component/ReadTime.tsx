import { Box } from "@mui/material";
import TradingViewTrendChart from "./TradingViewTrendChart";

export default function ReadTimePriceChart() {
  return (
    <Box
      sx={{
        height: "549px",
        bgcolor: "#fff",
        borderRadius: "8px",
        flex: 1,
        position: "relative",
      }}
    >
      <TradingViewTrendChart />
    </Box>
  );
}
