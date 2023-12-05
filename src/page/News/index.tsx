import { Stack } from "@mui/material";
import { useState } from "react";
import { PageLayout } from "../../component/Layout";
import BlockQuota from "./component/BlockQuota";
import ReadTimePriceChart from "./component/ReadTime";
import RightSummary from "./component/RightSummary";
import BlockNewsList from "./component/BlockNewsList";
import TabCard from "component/tabCard";
import StockChartAnalyze from "./component/StockChartAnalyze";

function RealTimeNewsPage() {
  const [tab, setTab] = useState(0);
  return (
    <Stack
      flexDirection={{ xs: "column", lg: "row" }}
      gap={1}
      justifyContent="space-between"
    >
      <Stack flex={{ xs: 1, lg: 2 }} gap={1}>
        <TabCard tabs={["走勢圖", "技術分析"]} onChange={setTab}>
          <div style={{ display: tab === 0 ? "block" : "none" }}>
            <ReadTimePriceChart />
          </div>
          <div style={{ display: tab === 1 ? "block" : "none" }}>
            <StockChartAnalyze />
          </div>
        </TabCard>
        <BlockQuota />
        <BlockNewsList />
      </Stack>
      <Stack flex={1} mt={{ xs: 0, lg: "44px" }}>
        <RightSummary />
      </Stack>
    </Stack>
  );
}

export default function Page() {
  return (
    <PageLayout
      sx={{
        mx: {
          xs: 4,
          lg: 6,
        },
      }}
    >
      <RealTimeNewsPage />
    </PageLayout>
  );
}
