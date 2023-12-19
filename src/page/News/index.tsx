import { useMediaQuery, useTheme } from "@mui/material";
import { PageLayout } from "../../component/Layout";
import BlockQuota from "./component/BlockQuota";
import { StockInformation } from "./component/RightSummary";
import BlockNewsList from "./component/BlockNewsList";
import TabCard from "component/tabCard";
import ArticleList from "./component/ArticleList";
import { useState } from "react";
import { Box, Stack } from "@mui/material";
import PriceTrendChart from "./component/PriceTrendChart";
import KLineChart from "./component/KlineChart";

function RealTimeNewsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Stack gap={1}>
      <Stack
        gap={1}
        flexDirection={{ xs: "column", md: "row", lg: "row" }}
        justifyContent="space-between"
      >
        <Box flex={{ xs: 1, md: 2, lg: 2 }} gap={1}>
          <TabCard
            tabs={["走勢圖", "技術分析"]}
            defaultedValue={0}
            onChange={setTabIndex}
          >
            {tabIndex === 0 ? <PriceTrendChart /> : <KLineChart />}
          </TabCard>
        </Box>
        {isMobile && <BlockQuota />}
        <Box flex={1} mt={{ xs: 0, md: "44px", lg: "44px" }}>
          <StockInformation />
        </Box>
      </Stack>
      <Stack
        gap={1}
        flexDirection={{ xs: "column-reverse", md: "row", lg: "row" }}
        justifyContent="space-between"
      >
        <Stack flex={{ xs: 1, md: 2, lg: 2 }} gap={1}>
          {!isMobile && <BlockQuota />}
          <BlockNewsList />
        </Stack>
        <Box flex={1} gap={1}>
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
