import { Stack, Link, Box } from "@mui/material";
import React, { useMemo, useState } from "react";
import {
  VALUE_ASSESSMENT_CONVERTER,
  VALUE_ASSESS_PAGE_ENUM,
} from "types/valueAssessment";
import Developing from "component/Developing";
import styled from "@emotion/styled";
import { PageLayout } from "../../component/Layout";

const LinkTab = styled(Link)(({ isActive }: { isActive: boolean }) => ({
  padding: "12px 24px",
  fontWeight: 400,
  fontSize: "16px",
  borderRight: "1px solid #F2F2F2",
  color: isActive ? "#405DF9" : "#828282",
  textDecoration: "none",
  cursor: "pointer",
}));

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
      <Stack
        flexDirection="row"
        alignItems="center"
        bgcolor="#fff"
        px="48px"
        mb={1}
        sx={{
          ".MuiTypography-button:last-child": {
            borderRight: "none",
          },
          ".MuiTypography-button:first-child": {
            pl: "16px",
          },
        }}
      >
        {Object.entries(VALUE_ASSESSMENT_CONVERTER).map(([key, value]) => (
          <LinkTab
            key={key}
            variant="button"
            isActive={key === activeTab}
            onClick={() => setActiveTab(key as VALUE_ASSESS_PAGE_ENUM)}
          >
            {value}
          </LinkTab>
        ))}
      </Stack>
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
