import { Stack, Link, Box } from "@mui/material";
import React, { useMemo, useState } from "react";
import { GROWTH_PAGE_CONVERTER, GROWTH_PAGE_ENUM } from "types/growth";
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
        {Object.entries(GROWTH_PAGE_CONVERTER).map(([key, value]) => (
          <LinkTab
            key={key}
            variant="button"
            isActive={key === activeTab}
            onClick={() => setActiveTab(key as GROWTH_PAGE_ENUM)}
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
      <GrowthAnalysisPage />
    </PageLayout>
  );
}
