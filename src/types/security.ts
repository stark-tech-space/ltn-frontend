import { IDateField } from "./common";

export enum SECURITY_PAGE_ENUM {
  PAGE1 = "PAGE1",
  PAGE2 = "PAGE2",
  PAGE3 = "PAGE3",
  PAGE4 = "PAGE4",
  PAGE5 = "PAGE5",
  PAGE6 = "PAGE6",
}

export const SECURITY_PAGE_CONVERTER: Record<SECURITY_PAGE_ENUM, string> = {
  [SECURITY_PAGE_ENUM.PAGE1]: "財務結構比率",
  [SECURITY_PAGE_ENUM.PAGE2]: "流速動比率",
  [SECURITY_PAGE_ENUM.PAGE3]: "利息保障倍數",
  [SECURITY_PAGE_ENUM.PAGE4]: "現金流量分析",
  [SECURITY_PAGE_ENUM.PAGE5]: "營業現金流對淨利比",
  [SECURITY_PAGE_ENUM.PAGE6]: "盈餘再投資比率",
};

export interface ISecurityRatio extends IDateField {
  // 負責比率
  debtRatio: number;
}

export interface IDebtAssetsRatio extends IDateField {
  longTermDebt: number;
  totalStockholdersEquity: number;
}
