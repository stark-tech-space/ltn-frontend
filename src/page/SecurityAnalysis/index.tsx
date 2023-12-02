import { Stack, Link, Box } from "@mui/material";
import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { PageLayout } from "../../component/Layout";
import { SECURITY_PAGE_CONVERTER, SECURITY_PAGE_ENUM } from "types/security";
import Developing from "component/Developing";
import StructureRatio from "./component/StructureRatio";

const LinkTab = styled(Link)(({ isActive }: { isActive: boolean }) => ({
  padding: "12px 24px",
  fontWeight: 400,
  fontSize: "16px",
  borderRight: "1px solid #F2F2F2",
  color: isActive ? "#405DF9" : "#828282",
  textDecoration: "none",
  cursor: "pointer",
}));

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
        {Object.entries(SECURITY_PAGE_CONVERTER).map(([key, value]) => (
          <LinkTab
            key={key}
            variant="button"
            isActive={key === activeTab}
            onClick={() => setActiveTab(key as SECURITY_PAGE_ENUM)}
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
      <SecurityAnalysisPage />
    </PageLayout>
  );
}
