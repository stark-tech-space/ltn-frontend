import { Button, Stack, Link, Box } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { PageLayout } from "../../component/Layout";
import { FINANCIAL_PAGE_CONVERTER, FINANCIAL_PAGE_ENUM } from "types/financial";

import styled from "@emotion/styled";
import EarningsPerShare from "./component/EaringsPerShare";
import MonthlyRevenue from "./component/MonthlyRevenue";
import Developing from "component/Developing";
import IncomeStatement from "./component/IncomeStatement";
import PerStockShare from "./component/PerStockValue";
import CashFlow from "./component/CashFlow";
import DividendPolicy from "./component/DividendPolicy";

const LinkTab = styled(Link)(({ isActive }: { isActive: boolean }) => ({
  padding: "12px 24px",
  fontWeight: 400,
  fontSize: "16px",
  borderRight: "1px solid #F2F2F2",
  color: isActive ? "#405DF9" : "#828282",
  textDecoration: "none",
  cursor: "pointer",
}));

const CHILDREN_MAP: Record<FINANCIAL_PAGE_ENUM, React.ReactNode> = {
  [FINANCIAL_PAGE_ENUM.MONTHLY_REVENUE]: <MonthlyRevenue />,
  [FINANCIAL_PAGE_ENUM.EARNINGS_PER_SHARE]: <EarningsPerShare />,
  [FINANCIAL_PAGE_ENUM.STOCK_PER_VALUE]: <PerStockShare />,
  [FINANCIAL_PAGE_ENUM.INCOME_TABLE]: <IncomeStatement />,
  [FINANCIAL_PAGE_ENUM.TOTAL_ASSETS]: <Developing />,
  [FINANCIAL_PAGE_ENUM.LIABILITIES_AND_SHAREHOLDERS]: <Developing />,
  [FINANCIAL_PAGE_ENUM.CASH_FLOW_STATEMENT]: <CashFlow />,
  [FINANCIAL_PAGE_ENUM.DIVIDEND_POLICY]: <DividendPolicy />,
  [FINANCIAL_PAGE_ENUM.EBOOK]: <Developing />,
};

function FinancialPage() {
  const [activeTab, setActiveTab] = useState<FINANCIAL_PAGE_ENUM>(
    FINANCIAL_PAGE_ENUM.MONTHLY_REVENUE
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
        {Object.entries(FINANCIAL_PAGE_CONVERTER).map(([key, value], index) => (
          <LinkTab
            key={key}
            variant="button"
            isActive={key === activeTab}
            onClick={() => setActiveTab(key as FINANCIAL_PAGE_ENUM)}
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
