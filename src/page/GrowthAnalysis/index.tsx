import { Box } from "@mui/material";
import React, { useState } from "react";
import { GROWTH_PAGE_CONVERTER, GROWTH_PAGE_ENUM } from "types/growth";
import PageNavigation from "component/PageNavigation";
import MonthlyRevenueGrowthRate from "./component/MonthlyRevenueGrowthRate";
import RevenueGrowthRate from "./component/RevenueGrowthRate";
import GrossProfitGrowthRate from "./component/GrossProfitGrowthRate";
import OperatingIncomeGrowthRate from "./component/OperatingIncomeGrowthRate";
import NetIncomeGrowthRate from "./component/NetIncomeGrowthRate";
import EpsGrowthRate from "./component/EpsGrowthRate";
import { useActiveTabElement } from "Hooks/common";

const CHILDREN_MAP: Record<GROWTH_PAGE_ENUM, React.ReactNode> = {
  [GROWTH_PAGE_ENUM.PAGE1]: <MonthlyRevenueGrowthRate />,
  [GROWTH_PAGE_ENUM.PAGE2]: <RevenueGrowthRate />,
  [GROWTH_PAGE_ENUM.PAGE3]: <GrossProfitGrowthRate />,
  [GROWTH_PAGE_ENUM.PAGE4]: <OperatingIncomeGrowthRate />,
  [GROWTH_PAGE_ENUM.PAGE5]: <NetIncomeGrowthRate />,
  [GROWTH_PAGE_ENUM.PAGE6]: <EpsGrowthRate />,
};

export default function GrowthAnalysisPage() {
  const [activeTab, setActiveTab] = useState<GROWTH_PAGE_ENUM>(
    GROWTH_PAGE_ENUM.PAGE1
  );
  const Child = useActiveTabElement<GROWTH_PAGE_ENUM>(activeTab, CHILDREN_MAP);
  return (
    <Box>
      <PageNavigation
        defaultActiveTab={GROWTH_PAGE_ENUM.PAGE1}
        menuConverter={GROWTH_PAGE_CONVERTER}
        onChange={(tab) => setActiveTab(tab as GROWTH_PAGE_ENUM)}
      />
      <Box mx={{ xs: 0, md: 3, lg: 6 }}>{Child}</Box>
    </Box>
  );
}
