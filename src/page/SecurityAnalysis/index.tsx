import { Box } from "@mui/material";
import React, { useMemo, useState } from "react";
import { PageLayout } from "../../component/Layout";
import { SECURITY_PAGE_CONVERTER, SECURITY_PAGE_ENUM } from "types/security";
import Developing from "component/Developing";
import StructureRatio from "./component/StructureRatio";
import PageNavigation from "component/PageNavigation";

const CHILDREN_MAP: Record<SECURITY_PAGE_ENUM, React.ReactNode> = {
  [SECURITY_PAGE_ENUM.PAGE1]: <StructureRatio />,
  [SECURITY_PAGE_ENUM.PAGE2]: <Developing />,
  [SECURITY_PAGE_ENUM.PAGE3]: <Developing />,
  [SECURITY_PAGE_ENUM.PAGE4]: <Developing />,
  [SECURITY_PAGE_ENUM.PAGE5]: <Developing />,
  [SECURITY_PAGE_ENUM.PAGE6]: <Developing />,
};

function SecurityAnalysisPage() {
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
      <Box mx="48px">{Child}</Box>
    </Box>
  );
}

export default function Page() {
  return (
    <PageLayout sx={{ mx: 0, py: 0 }}>
      <SecurityAnalysisPage />
    </PageLayout>
  );
}
