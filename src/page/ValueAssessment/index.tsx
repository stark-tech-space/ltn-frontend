import { Box } from "@mui/material";
import React, { useState } from "react";
import {
  VALUE_ASSESSMENT_CONVERTER,
  VALUE_ASSESS_PAGE_ENUM,
} from "types/valueAssessment";
import Developing from "component/Developing";

import PageNavigation from "component/PageNavigation";
import PriceEarningsRatio from "./component/PriceEarningsRatio";
import PriceToBookRatio from "./component/ToBookRatio";
import CashDividend from "./component/CashDividend";
import AvgCashDividend from "./component/AvgCashDividend";
import { useActiveTabElement } from "Hooks/common";

const CHILDREN_MAP: Record<VALUE_ASSESS_PAGE_ENUM, React.ReactNode> = {
  [VALUE_ASSESS_PAGE_ENUM.PAGE1]: <PriceEarningsRatio />,
  [VALUE_ASSESS_PAGE_ENUM.PAGE2]: <Developing />,
  [VALUE_ASSESS_PAGE_ENUM.PAGE3]: <PriceToBookRatio />,
  [VALUE_ASSESS_PAGE_ENUM.PAGE4]: <Developing />,
  [VALUE_ASSESS_PAGE_ENUM.PAGE5]: <CashDividend />,
  [VALUE_ASSESS_PAGE_ENUM.PAGE6]: <AvgCashDividend />,
  [VALUE_ASSESS_PAGE_ENUM.PAGE7]: <Developing />,
};
//
export default function ValueAssessmentPage() {
  const [activeTab, setActiveTab] = useState<VALUE_ASSESS_PAGE_ENUM>(
    VALUE_ASSESS_PAGE_ENUM.PAGE1
  );
  const Child = useActiveTabElement<VALUE_ASSESS_PAGE_ENUM>(
    activeTab,
    CHILDREN_MAP
  );
  return (
    <Box>
      <PageNavigation
        defaultActiveTab={VALUE_ASSESS_PAGE_ENUM.PAGE1}
        menuConverter={VALUE_ASSESSMENT_CONVERTER}
        onChange={(tab) => setActiveTab(tab as VALUE_ASSESS_PAGE_ENUM)}
      />
      <Box mx={{ xs: 0, md: 3, lg: 6 }}>{Child}</Box>
    </Box>
  );
}
