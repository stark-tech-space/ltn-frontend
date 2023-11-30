import { Button, Stack, Link, Box } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { PageLayout } from "../../component/Layout";
import { PAGE_NAV_CONVERTER, PAGE_NAV_ENUM } from "types/financial";
import request from "api/request";
import styled from "@emotion/styled";
import EarningsPerShare from "./component/EaringsPerShare";
import MonthlyRevenue from "./component/MonthlyRevenue";
import Developing from "component/Developing";
import IncomeStatement from "./component/IncomeStatement";
import PerStockShare from "./component/PerStockValue";
import CashFlow from "./component/CashFlow";

const LinkTab = styled(Link)(({ isActive }: { isActive: boolean }) => ({
  padding: "12px 24px",
  fontWeight: 400,
  fontSize: "16px",
  borderRight: "1px solid #F2F2F2",
  color: isActive ? "#405DF9" : "#828282",
  textDecoration: "none",
  cursor: "pointer",
}));

const CHILDREN_MAP: Record<PAGE_NAV_ENUM, React.ReactNode> = {
  [PAGE_NAV_ENUM.MONTHLY_REVENUE]: <MonthlyRevenue />,
  [PAGE_NAV_ENUM.EARNINGS_PER_SHARE]: <EarningsPerShare />,
  [PAGE_NAV_ENUM.STOCK_PER_VALUE]: <PerStockShare />,
  [PAGE_NAV_ENUM.INCOME_TABLE]: <IncomeStatement />,
  [PAGE_NAV_ENUM.TOTAL_ASSETS]: <Developing />,
  [PAGE_NAV_ENUM.LIABILITIES_AND_SHAREHOLDERS]: <Developing />,
  [PAGE_NAV_ENUM.CASH_FLOW_STATEMENT]: <CashFlow />,
  [PAGE_NAV_ENUM.DIVIDEND_POLICY]: <Developing />,
  [PAGE_NAV_ENUM.EBOOK]: <Developing />,
};

function FinancialPage() {
  const [activeTab, setActiveTab] = useState<PAGE_NAV_ENUM>(
    PAGE_NAV_ENUM.MONTHLY_REVENUE
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
        {Object.entries(PAGE_NAV_CONVERTER).map(([key, value], index) => (
          <LinkTab
            key={key}
            variant="button"
            isActive={key === activeTab}
            onClick={() => setActiveTab(key as PAGE_NAV_ENUM)}
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
      <FinancialPage />
    </PageLayout>
  );
}
