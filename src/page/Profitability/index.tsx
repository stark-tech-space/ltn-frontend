import { Stack, Link, Box } from "@mui/material";
import React, { useMemo, useState } from "react";
import { PageLayout } from "../../component/Layout";
import { PROFIT_PAGE_CONVERTER, PROFIT_PAGE_ENUM } from "types/profitability";

import styled from "@emotion/styled";
import ProfitRatio from "./component/ProfitRatio";
import OperatingRatio from "./component/OperatingRatio";
import OutSideProfitRatio from "./component/OutsideProfitRatio";
import RoEAndRoA from "./component/ROE";
import DuPontAnalysis from "./component/DuPontAnalysis";
import WeeklyTurnoverAbility from "./component/WeeklyTurnoverAbility";
import OperatingDays from "./component/OperatingDays";
import CashDividendRatio from "./component/CashDividendRatio";

const LinkTab = styled(Link)(({ isActive }: { isActive: boolean }) => ({
  padding: "12px 24px",
  fontWeight: 400,
  fontSize: "16px",
  borderRight: "1px solid #F2F2F2",
  color: isActive ? "#405DF9" : "#828282",
  textDecoration: "none",
  cursor: "pointer",
}));

const CHILDREN_MAP: Record<PROFIT_PAGE_ENUM, React.ReactNode> = {
  [PROFIT_PAGE_ENUM.PAGE1]: <ProfitRatio />,
  [PROFIT_PAGE_ENUM.PAGE2]: <OperatingRatio />,
  [PROFIT_PAGE_ENUM.PAGE3]: <OutSideProfitRatio />,
  [PROFIT_PAGE_ENUM.PAGE4]: <RoEAndRoA />,
  [PROFIT_PAGE_ENUM.PAGE5]: <DuPontAnalysis />,
  [PROFIT_PAGE_ENUM.PAGE6]: <WeeklyTurnoverAbility />,
  [PROFIT_PAGE_ENUM.PAGE7]: <OperatingDays />,
  [PROFIT_PAGE_ENUM.PAGE8]: <CashDividendRatio />,
};

function ProfitabilityPage() {
  const [activeTab, setActiveTab] = useState<PROFIT_PAGE_ENUM>(
    PROFIT_PAGE_ENUM.PAGE1
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
        {Object.entries(PROFIT_PAGE_CONVERTER).map(([key, value]) => (
          <LinkTab
            key={key}
            variant="button"
            isActive={key === activeTab}
            onClick={() => setActiveTab(key as PROFIT_PAGE_ENUM)}
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
