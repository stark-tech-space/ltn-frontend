import { Box } from "@mui/material";
import React, { useMemo, useState } from "react";
import { SECURITY_PAGE_CONVERTER, SECURITY_PAGE_ENUM } from "types/security";
import Developing from "component/Developing";
import StructureRatio from "./component/StructureRatio";
import PageNavigation from "component/PageNavigation";
import OperatingNetIncomeRate from "./component/OperatingNetIncomeRate";
import FlowRate from "./component/FlowRatio";

const CHILDREN_MAP: Record<SECURITY_PAGE_ENUM, React.ReactNode> = {
  [SECURITY_PAGE_ENUM.PAGE1]: <StructureRatio />,
  [SECURITY_PAGE_ENUM.PAGE2]: <Developing />,
  [SECURITY_PAGE_ENUM.PAGE3]: <Developing />,
  [SECURITY_PAGE_ENUM.PAGE4]: <FlowRate />,
  [SECURITY_PAGE_ENUM.PAGE5]: <OperatingNetIncomeRate />,
  [SECURITY_PAGE_ENUM.PAGE6]: <Developing />,
};

export default function SecurityAnalysisPage() {
  const [activeTab, setActiveTab] = useState<SECURITY_PAGE_ENUM>(
    SECURITY_PAGE_ENUM.PAGE1
  );

  const Child = useMemo(() => CHILDREN_MAP[activeTab], [activeTab]);
  return (
    <Box>
      <PageNavigation
        defaultActiveTab={SECURITY_PAGE_ENUM.PAGE1}
        menuConverter={SECURITY_PAGE_CONVERTER}
        onChange={(tab) => setActiveTab(tab as SECURITY_PAGE_ENUM)}
      />
      <Box mx={{ xs: 2, md: 4, lg: 6 }}>{Child}</Box>
    </Box>
  );
}
