import { Box } from "@mui/material";
import React, { useState } from "react";
import { SECURITY_PAGE_CONVERTER, SECURITY_PAGE_ENUM } from "types/security";
import StructureRatio from "./component/StructureRatio";
import QuickAndCurrentRatio from "./component/QuickAndCurrentRatio";
import TimesInterestEarned from "./component/TimesInterestEarned";
import PageNavigation from "component/PageNavigation";
import FlowRate from "./component/FlowRatio";
import OperatingNetIncomeRate from "./component/OperatingNetIncomeRate";
import ReinvestmentRate from "./component/ReinvestmentRate";
import { useActiveTabElement } from "Hooks/common";

const CHILDREN_MAP: Record<SECURITY_PAGE_ENUM, React.ReactNode> = {
  [SECURITY_PAGE_ENUM.PAGE1]: <StructureRatio />,
  [SECURITY_PAGE_ENUM.PAGE2]: <QuickAndCurrentRatio />,
  [SECURITY_PAGE_ENUM.PAGE3]: <TimesInterestEarned />,
  [SECURITY_PAGE_ENUM.PAGE4]: <FlowRate />,
  [SECURITY_PAGE_ENUM.PAGE5]: <OperatingNetIncomeRate />,
  [SECURITY_PAGE_ENUM.PAGE6]: <ReinvestmentRate />,
};

export default function SecurityAnalysisPage() {
  const [activeTab, setActiveTab] = useState<SECURITY_PAGE_ENUM>(
    SECURITY_PAGE_ENUM.PAGE1
  );

  const Child = useActiveTabElement<SECURITY_PAGE_ENUM>(
    activeTab,
    CHILDREN_MAP
  );

  return (
    <Box>
      <PageNavigation
        defaultActiveTab={SECURITY_PAGE_ENUM.PAGE1}
        menuConverter={SECURITY_PAGE_CONVERTER}
        onChange={(tab) => setActiveTab(tab as SECURITY_PAGE_ENUM)}
      />
      <Box mx={{ xs: 0, md: 3, lg: 6 }}>{Child}</Box>
    </Box>
  );
}
