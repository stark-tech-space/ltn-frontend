import { Box, Stack } from "@mui/material";
import { useState } from "react";
import { PageLayout } from "../../component/Layout";
import BlockQuota from "./component/BlockQuota";
import ReadTimePriceChart from "./component/ReadTime";
import { CompanyInformation, StockInformation } from "./component/RightSummary";
import BlockNewsList from "./component/BlockNewsList";
import TabCard from "component/tabCard";
import StockChartAnalyze from "./component/StockChartAnalyze";
import ArticleList from "./component/ArticleList";

function RealTimeNewsPage() {
  const [tab, setTab] = useState(0);
  return (
    <Stack gap={1}>
      <Stack
        gap={1}
        flexDirection={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
      >
        <Box flex={{ xs: 1, lg: 2 }} gap={1}>
          <TabCard tabs={["走勢圖", "技術分析"]} onChange={setTab}>
            <div style={{ display: tab === 0 ? "block" : "none" }}>
              <ReadTimePriceChart />
            </div>
            <div style={{ display: tab === 1 ? "block" : "none" }}>
              <StockChartAnalyze />
            </div>
          </TabCard>
          <Box height="8px" />
          <BlockQuota />
        </Box>
        <Box flex={1} mt={{ xs: 0, lg: "44px" }}>
          <StockInformation />
        </Box>
      </Stack>
      <Stack
        gap={1}
        flexDirection={{ xs: "column-reverse", lg: "row" }}
        justifyContent="space-between"
      >
        <Stack flex={{ xs: 1, lg: 2 }} gap={1}>
          <BlockNewsList />
        </Stack>
        <Box flex={1} gap={1}>
          <CompanyInformation />
          <Box height="8px" />
          <ArticleList />
        </Box>
      </Stack>
    </Stack>
  );
}

export default function Page() {
  return (
    <PageLayout>
      <RealTimeNewsPage />
    </PageLayout>
  );
}
