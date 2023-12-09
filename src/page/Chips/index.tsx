import { Box } from "@mui/material";
import React, { useState } from "react";
import Developing from "component/Developing";

import PageNavigation from "component/PageNavigation";
import { CHIPS_PAGE_CONVERTER, CHIPS_PAGE_ENUM } from "types/chips";
import StockInstitutionalInvestorsBuySell from "./compoent/StockInstitutionalInvestorsBuySell";
import { useActiveTabElement } from "Hooks/common";

const CHILDREN_MAP: Record<CHIPS_PAGE_ENUM, React.ReactNode> = {
  [CHIPS_PAGE_ENUM.PAGE1]: <StockInstitutionalInvestorsBuySell />,
  [CHIPS_PAGE_ENUM.PAGE2]: <Developing />,
};

export default function ChipsPage() {
  const [activeTab, setActiveTab] = useState<CHIPS_PAGE_ENUM>(
    CHIPS_PAGE_ENUM.PAGE1
  );

  const Child = useActiveTabElement<CHIPS_PAGE_ENUM>(activeTab, CHILDREN_MAP);
  return (
    <Box>
      <PageNavigation
        defaultActiveTab={CHIPS_PAGE_ENUM.PAGE1}
        menuConverter={CHIPS_PAGE_CONVERTER}
        onChange={(tab) => setActiveTab(tab as CHIPS_PAGE_ENUM)}
      />
      <Box mx={{ xs: 0, md: 3, lg: 6 }}>{Child}</Box>
    </Box>
  );
}
