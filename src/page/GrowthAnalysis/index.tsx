import { Box } from "@mui/material";
import React, { useMemo, useState } from "react";
import { GROWTH_PAGE_CONVERTER, GROWTH_PAGE_ENUM } from "types/growth";
import Developing from "component/Developing";
import { PageLayout } from "../../component/Layout";
import PageNavigation from "component/PageNavigation";

const CHILDREN_MAP: Record<GROWTH_PAGE_ENUM, React.ReactNode> = {
  [GROWTH_PAGE_ENUM.PAGE1]: <Developing />,
  [GROWTH_PAGE_ENUM.PAGE2]: <Developing />,
  [GROWTH_PAGE_ENUM.PAGE3]: <Developing />,
  [GROWTH_PAGE_ENUM.PAGE4]: <Developing />,
  [GROWTH_PAGE_ENUM.PAGE5]: <Developing />,
  [GROWTH_PAGE_ENUM.PAGE6]: <Developing />,
};

function GrowthAnalysisPage() {
  const [activeTab, setActiveTab] = useState<GROWTH_PAGE_ENUM>(
    GROWTH_PAGE_ENUM.PAGE1
  );

  const Child = useMemo(() => CHILDREN_MAP[activeTab], [activeTab]);
  return (
    <Box>
      <PageNavigation
        defaultActiveTab={GROWTH_PAGE_ENUM.PAGE1}
        menuConverter={GROWTH_PAGE_CONVERTER}
        onChange={(tab) => setActiveTab(tab as GROWTH_PAGE_ENUM)}
      />
      <Box mx="48px">{Child}</Box>
    </Box>
  );
}

export default function Page() {
  return (
    <PageLayout sx={{ mx: 0, py: 0 }}>
      <GrowthAnalysisPage />
    </PageLayout>
  );
}
