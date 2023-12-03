import { Box } from "@mui/material";
import React, { useMemo, useState } from "react";
import {
  VALUE_ASSESSMENT_CONVERTER,
  VALUE_ASSESS_PAGE_ENUM,
} from "types/valueAssessment";
import Developing from "component/Developing";
import { PageLayout } from "../../component/Layout";
import PageNavigation from "component/PageNavigation";

const CHILDREN_MAP: Record<VALUE_ASSESS_PAGE_ENUM, React.ReactNode> = {
  [VALUE_ASSESS_PAGE_ENUM.PAGE1]: <Developing />,
  [VALUE_ASSESS_PAGE_ENUM.PAGE2]: <Developing />,
  [VALUE_ASSESS_PAGE_ENUM.PAGE3]: <Developing />,
  [VALUE_ASSESS_PAGE_ENUM.PAGE4]: <Developing />,
  [VALUE_ASSESS_PAGE_ENUM.PAGE5]: <Developing />,
  [VALUE_ASSESS_PAGE_ENUM.PAGE6]: <Developing />,
  [VALUE_ASSESS_PAGE_ENUM.PAGE7]: <Developing />,
};

function ValueAssessmentPage() {
  const [activeTab, setActiveTab] = useState<VALUE_ASSESS_PAGE_ENUM>(
    VALUE_ASSESS_PAGE_ENUM.PAGE1
  );
  const Child = useMemo(() => CHILDREN_MAP[activeTab], [activeTab]);
  return (
    <Box>
      <PageNavigation
        defaultActiveTab={VALUE_ASSESS_PAGE_ENUM.PAGE1}
        menuConverter={VALUE_ASSESSMENT_CONVERTER}
        onChange={(tab) => setActiveTab(tab as VALUE_ASSESS_PAGE_ENUM)}
      />
      <Box mx="48px">{Child}</Box>
    </Box>
  );
}

export default function Page() {
  return (
    <PageLayout sx={{ mx: 0, py: 0 }}>
      <ValueAssessmentPage />
    </PageLayout>
  );
}
