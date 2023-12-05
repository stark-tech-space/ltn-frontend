import { IFinMindApiResponse } from "./common";

export enum FINANCIAL_PAGE_ENUM {
  PAGE1 = "PAGE1",
  PAGE2 = "PAGE2",
  PAGE3 = "PAGE3",
  PAGE4 = "PAGE4",
  PAGE5 = "PAGE5",
  PAGE6 = "PAGE6",
  PAGE7 = "PAGE7",
  PAGE8 = "PAGE8",
  PAGE9 = "PAGE9",
}

export const FINANCIAL_PAGE_CONVERTER: Record<FINANCIAL_PAGE_ENUM, string> = {
  [FINANCIAL_PAGE_ENUM.PAGE1]: "每月營收",
  [FINANCIAL_PAGE_ENUM.PAGE2]: "每股盈餘",
  [FINANCIAL_PAGE_ENUM.PAGE3]: "每股淨值",
  [FINANCIAL_PAGE_ENUM.PAGE4]: "損益表",
  [FINANCIAL_PAGE_ENUM.PAGE5]: "資產項目",
  [FINANCIAL_PAGE_ENUM.PAGE6]: "負債和股東權益",
  [FINANCIAL_PAGE_ENUM.PAGE7]: "現金流量表",
  [FINANCIAL_PAGE_ENUM.PAGE8]: "股利政策",
  [FINANCIAL_PAGE_ENUM.PAGE9]: "電子書",
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

export interface IDebtTableItem {
  date: string;
  value: number;
}
