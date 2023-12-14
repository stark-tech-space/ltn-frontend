import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";
import { PageLayout } from "../../component/Layout";
import BlockQuota from "./component/BlockQuota";
import PriceTrendChart from "./component/PriceTrendChart";
import { CompanyInformation, StockInformation } from "./component/RightSummary";
import BlockNewsList from "./component/BlockNewsList";
import TabCard from "component/tabCard";
import ArticleList from "./component/ArticleList";

function RealTimeNewsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Stack gap={1}>
      <Stack
        gap={1}
        flexDirection={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
      >
        <Box flex={{ xs: 1, lg: 2 }} gap={1}>
          <TabCard tabs={["走勢圖"]}>
            <PriceTrendChart />
          </TabCard>
        </Box>
        {isMobile && <BlockQuota />}
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
          {!isMobile && <BlockQuota />}
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
