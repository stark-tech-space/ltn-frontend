import { Box } from "@mui/material";
import React, { useMemo, useState } from "react";
import { PageLayout } from "../../component/Layout";
import EarningsPerShare from "./component/EaringsPerShare";
import MonthlyRevenue from "./component/MonthlyRevenue";
import Developing from "component/Developing";
import IncomeStatement from "./component/IncomeStatement";
import PerStockShare from "./component/PerStockValue";
import CashFlow from "./component/CashFlow";
import DividendPolicy from "./component/DividendPolicy";
import PageNavigation from "component/PageNavigation";
import { FINANCIAL_PAGE_CONVERTER, FINANCIAL_PAGE_ENUM } from "types/financial";
import DebtHolders from "./component/DebtHolders";

const CHILDREN_MAP: Record<FINANCIAL_PAGE_ENUM, React.ReactNode> = {
  [FINANCIAL_PAGE_ENUM.PAGE1]: <MonthlyRevenue />,
  [FINANCIAL_PAGE_ENUM.PAGE2]: <EarningsPerShare />,
  [FINANCIAL_PAGE_ENUM.PAGE3]: <PerStockShare />,
  [FINANCIAL_PAGE_ENUM.PAGE4]: <IncomeStatement />,
  [FINANCIAL_PAGE_ENUM.PAGE5]: <Developing />,
  [FINANCIAL_PAGE_ENUM.PAGE6]: <DebtHolders />,
  [FINANCIAL_PAGE_ENUM.PAGE7]: <CashFlow />,
  [FINANCIAL_PAGE_ENUM.PAGE8]: <DividendPolicy />,
  [FINANCIAL_PAGE_ENUM.PAGE9]: <Developing />,
};

function FinancialPage() {
  const [activeTab, setActiveTab] = useState<FINANCIAL_PAGE_ENUM>(FINANCIAL_PAGE_ENUM.PAGE1);
  const Child = useMemo(() => CHILDREN_MAP[activeTab], [activeTab]);
  return (
    <Box>
      <PageNavigation
        defaultActiveTab={FINANCIAL_PAGE_ENUM.PAGE1}
        menuConverter={FINANCIAL_PAGE_CONVERTER}
        onChange={(tab) => setActiveTab(tab as FINANCIAL_PAGE_ENUM)}
      />
      <Box mx={{ xs: 4, lg: 6 }}>{Child}</Box>
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
