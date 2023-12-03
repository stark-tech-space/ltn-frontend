import { Box } from "@mui/material";
import React, { useMemo, useState } from "react";
import Developing from "component/Developing";
import { PageLayout } from "../../component/Layout";
import PageNavigation from "component/PageNavigation";
import { INDICATORS_CONVERTER, INDICATORS_PAGE_ENUM } from "types/indicators";

const CHILDREN_MAP: Record<INDICATORS_PAGE_ENUM, React.ReactNode> = {
  [INDICATORS_PAGE_ENUM.PAGE1]: <Developing />,
  [INDICATORS_PAGE_ENUM.PAGE2]: <Developing />,
  [INDICATORS_PAGE_ENUM.PAGE3]: <Developing />,
  [INDICATORS_PAGE_ENUM.PAGE4]: <Developing />,
  [INDICATORS_PAGE_ENUM.PAGE5]: <Developing />,
  [INDICATORS_PAGE_ENUM.PAGE6]: <Developing />,
  [INDICATORS_PAGE_ENUM.PAGE7]: <Developing />,
  [INDICATORS_PAGE_ENUM.PAGE8]: <Developing />,
  [INDICATORS_PAGE_ENUM.PAGE9]: <Developing />,
  [INDICATORS_PAGE_ENUM.PAGE10]: <Developing />,
};

function IndicatorsPage() {
  const [activeTab, setActiveTab] = useState<INDICATORS_PAGE_ENUM>(
    INDICATORS_PAGE_ENUM.PAGE1
  );
  const Child = useMemo(() => CHILDREN_MAP[activeTab], [activeTab]);
  return (
    <Box>
      <PageNavigation
        defaultActiveTab={INDICATORS_PAGE_ENUM.PAGE1}
        menuConverter={INDICATORS_CONVERTER}
        onChange={(tab) => setActiveTab(tab as INDICATORS_PAGE_ENUM)}
      />
      <Box mx="48px">{Child}</Box>
    </Box>
  );
}

export default function Page() {
  return (
    <PageLayout sx={{ mx: 0, py: 0 }}>
      <IndicatorsPage />
    </PageLayout>
  );
}
