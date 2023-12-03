import { Box } from "@mui/material";
import React, { useMemo, useState } from "react";
import { PageLayout } from "../../component/Layout";
import { PROFIT_PAGE_CONVERTER, PROFIT_PAGE_ENUM } from "types/profitability";

import ProfitRatio from "./component/ProfitRatio";
import OperatingRatio from "./component/OperatingRatio";
import OutSideProfitRatio from "./component/OutsideProfitRatio";
import RoEAndRoA from "./component/ROE";
import DuPontAnalysis from "./component/DuPontAnalysis";
import WeeklyTurnoverAbility from "./component/WeeklyTurnoverAbility";
import OperatingDays from "./component/OperatingDays";
import CashDividendRatio from "./component/CashDividendRatio";
import PageNavigation from "component/PageNavigation";

const CHILDREN_MAP: Record<PROFIT_PAGE_ENUM, React.ReactNode> = {
  [PROFIT_PAGE_ENUM.PAGE1]: <ProfitRatio />,
  [PROFIT_PAGE_ENUM.PAGE2]: <OperatingRatio />,
  [PROFIT_PAGE_ENUM.PAGE3]: <OutSideProfitRatio />,
  [PROFIT_PAGE_ENUM.PAGE4]: <RoEAndRoA />,
  [PROFIT_PAGE_ENUM.PAGE5]: <DuPontAnalysis />,
  [PROFIT_PAGE_ENUM.PAGE6]: <WeeklyTurnoverAbility />,
  [PROFIT_PAGE_ENUM.PAGE7]: <OperatingDays />,
  [PROFIT_PAGE_ENUM.PAGE8]: <CashDividendRatio />,
};

function ProfitabilityPage() {
  const [activeTab, setActiveTab] = useState<PROFIT_PAGE_ENUM>(
    PROFIT_PAGE_ENUM.PAGE1
  );
  const Child = useMemo(() => CHILDREN_MAP[activeTab], [activeTab]);

  return (
    <Box>
      <PageNavigation
        defaultActiveTab={PROFIT_PAGE_ENUM.PAGE1}
        menuConverter={PROFIT_PAGE_CONVERTER}
        onChange={(tab) => setActiveTab(tab as PROFIT_PAGE_ENUM)}
      />
      <Box mx="48px">{Child}</Box>
    </Box>
  );
}

export default function Page() {
  return (
    <PageLayout sx={{ mx: 0, py: 0 }}>
      <ProfitabilityPage />
    </PageLayout>
  );
}
