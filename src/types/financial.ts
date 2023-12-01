import { IFinMindApiResponse } from "./common";

export enum PAGE_NAV_ENUM {
  MONTHLY_REVENUE = "MONTHLY_REVENUE",
  EARNINGS_PER_SHARE = "EARNINGS_PER_SHARE",
  STOCK_PER_VALUE = "STOCK_PER_VALUE",
  INCOME_TABLE = "INCOME_TABLE",
  TOTAL_ASSETS = "TOTAL_ASSETS",
  LIABILITIES_AND_SHAREHOLDERS = "LIABILITIES_AND_SHAREHOLDERS",
  CASH_FLOW_STATEMENT = "CASH_FLOW_STATEMENT",
  DIVIDEND_POLICY = "DIVIDEND_POLICY",
  EBOOK = "EBOOK",
}

export const PAGE_NAV_CONVERTER: Record<PAGE_NAV_ENUM, string> = {
  [PAGE_NAV_ENUM.MONTHLY_REVENUE]: "每月營收",
  [PAGE_NAV_ENUM.EARNINGS_PER_SHARE]: "每股盈餘",
  [PAGE_NAV_ENUM.STOCK_PER_VALUE]: "每股淨值",
  [PAGE_NAV_ENUM.INCOME_TABLE]: "損益表",
  [PAGE_NAV_ENUM.TOTAL_ASSETS]: "總資產",
  [PAGE_NAV_ENUM.LIABILITIES_AND_SHAREHOLDERS]: "負債和股東權益",
  [PAGE_NAV_ENUM.CASH_FLOW_STATEMENT]: "現金流量表",
  [PAGE_NAV_ENUM.DIVIDEND_POLICY]: "股利政策",
  [PAGE_NAV_ENUM.EBOOK]: "電子書",
};

// 每月營收

export interface IMonthlyRevenue extends IFinMindApiResponse {
  data: {
    date: string;
    revenue: number;
  }[];
}

export type IncomeType =
  // 营收
  | "Revenue"
  // 毛利
  | "GrossProfit"
  // 營業費用
  | "OperatingExpenses"
  // 營業成本
  | "CostOfGoodsSold"
  // 營業利益
  | "OperatingIncome"
  // 稅前淨利
  | "PreTaxIncome"
  // 母公司
  | "EquityAttributableToOwnersOfParent";

export interface IIncome extends IFinMindApiResponse {
  data: {
    date: string;
    type: IncomeType;
    value: number;
  }[];
}

export interface IDividendPolicyItem {
  //公告日
  AnnouncementDate: string;
  //現金股利
  CashEarningsDistribution: number;
  //除息日
  CashExDividendTradingDate: string;
  //現金股利發放日
  CashDividendPaymentDate: string;
  // 股票股利
  StockEarningsDistribution: number;

  date: string;

  year: string;

  // 除權日-不確定
  // 填息花費日數-不確定
}

export interface IDividendPolicyRst extends IFinMindApiResponse {
  data: IDividendPolicyItem[];
}
