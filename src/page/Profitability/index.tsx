import { Button, Stack, Link, Box } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { PageLayout } from "../../component/Layout";
import {
  PROFITABILITY_PAGE_ENUM,
  PROFITABILITY_PAGE_CONVERTER,
} from "types/profitability";

import styled from "@emotion/styled";
import Developing from "component/Developing";
import ProfitRatio from "./component/ProfitRatio";
import OperatingRatio from "./component/OperatingRatio";
import OutSideProfitRatio from "./component/OutsideProfitRatio";
import RoEAndRoA from "./component/ROE";

const LinkTab = styled(Link)(({ isActive }: { isActive: boolean }) => ({
  padding: "12px 24px",
  fontWeight: 400,
  fontSize: "16px",
  borderRight: "1px solid #F2F2F2",
  color: isActive ? "#405DF9" : "#828282",
  textDecoration: "none",
  cursor: "pointer",
}));

const CHILDREN_MAP: Record<PROFITABILITY_PAGE_ENUM, React.ReactNode> = {
  [PROFITABILITY_PAGE_ENUM.PAGE1]: <ProfitRatio />,
  [PROFITABILITY_PAGE_ENUM.PAGE2]: <OperatingRatio />,
  [PROFITABILITY_PAGE_ENUM.PAGE3]: <OutSideProfitRatio />,
  [PROFITABILITY_PAGE_ENUM.PAGE4]: <RoEAndRoA />,
  [PROFITABILITY_PAGE_ENUM.PAGE5]: <Developing />,
  [PROFITABILITY_PAGE_ENUM.PAGE6]: <Developing />,
  [PROFITABILITY_PAGE_ENUM.PAGE7]: <Developing />,
};

function ProfitabilityPage() {
  const [activeTab, setActiveTab] = useState<PROFITABILITY_PAGE_ENUM>(
    PROFITABILITY_PAGE_ENUM.PAGE1
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
        {Object.entries(PROFITABILITY_PAGE_CONVERTER).map(([key, value]) => (
          <LinkTab
            key={key}
            variant="button"
            isActive={key === activeTab}
            onClick={() => setActiveTab(key as PROFITABILITY_PAGE_ENUM)}
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
      <ProfitabilityPage />
    </PageLayout>
  );
}
