import { Box } from "@mui/material";
import React, { useState } from "react";
import EarningsPerShare from "./component/EaringsPerShare";
import MonthlyRevenue from "./component/MonthlyRevenue";
import IncomeStatement from "./component/IncomeStatement";
import PerStockShare from "./component/PerStockValue";
import CashFlow from "./component/CashFlow";
import DividendPolicy from "./component/DividendPolicy";
import PageNavigation from "component/PageNavigation";
import { FINANCIAL_PAGE_CONVERTER, FINANCIAL_PAGE_ENUM } from "types/financial";
import DebtHolders from "./component/DebtHolders";
import EBooks from "./component/Ebook";
import { useActiveTabElement } from "Hooks/common";
import CompanyAssets from "./component/CompanyAssets";

const CHILDREN_MAP: Record<FINANCIAL_PAGE_ENUM, React.ReactNode> = {
  [FINANCIAL_PAGE_ENUM.PAGE1]: <MonthlyRevenue />,
  [FINANCIAL_PAGE_ENUM.PAGE2]: <EarningsPerShare />,
  [FINANCIAL_PAGE_ENUM.PAGE3]: <PerStockShare />,
  [FINANCIAL_PAGE_ENUM.PAGE4]: <IncomeStatement />,
  [FINANCIAL_PAGE_ENUM.PAGE5]: <CompanyAssets />,
  [FINANCIAL_PAGE_ENUM.PAGE6]: <DebtHolders />,
  [FINANCIAL_PAGE_ENUM.PAGE7]: <CashFlow />,
  [FINANCIAL_PAGE_ENUM.PAGE8]: <DividendPolicy />,
  [FINANCIAL_PAGE_ENUM.PAGE9]: <EBooks />,
};

export default function FinancialPage() {
  const [activeTab, setActiveTab] = useState<FINANCIAL_PAGE_ENUM>(
    FINANCIAL_PAGE_ENUM.PAGE1
  );

  const Child = useActiveTabElement<FINANCIAL_PAGE_ENUM>(
    activeTab,
    CHILDREN_MAP
  );

  return (
    <Box>
      <PageNavigation
        defaultActiveTab={FINANCIAL_PAGE_ENUM.PAGE1}
        menuConverter={FINANCIAL_PAGE_CONVERTER}
        onChange={(tab) => setActiveTab(tab as FINANCIAL_PAGE_ENUM)}
      />
      <Box mx={{ xs: 0, md: 3, lg: 6 }}>{Child}</Box>
    </Box>
  );
}
