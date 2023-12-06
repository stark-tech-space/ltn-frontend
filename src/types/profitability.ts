import { IDateField } from "./common";
export enum PROFIT_PAGE_ENUM {
  PAGE1 = "PAGE1",
  PAGE2 = "PAGE2",
  PAGE3 = "PAGE3",
  PAGE4 = "PAGE4",
  PAGE5 = "PAGE5",
  PAGE6 = "PAGE6",
  PAGE7 = "PAGE7",
  PAGE8 = "PAGE8",
}

export const PROFIT_PAGE_CONVERTER: Record<PROFIT_PAGE_ENUM, string> = {
  [PROFIT_PAGE_ENUM.PAGE1]: "利潤比率",
  [PROFIT_PAGE_ENUM.PAGE2]: "營業費用率拆解",
  [PROFIT_PAGE_ENUM.PAGE3]: "業外佔稅前淨利比例",
  [PROFIT_PAGE_ENUM.PAGE4]: "ROE / ROA",
  [PROFIT_PAGE_ENUM.PAGE5]: "杜邦分析",
  [PROFIT_PAGE_ENUM.PAGE6]: "經營週轉能力",
  [PROFIT_PAGE_ENUM.PAGE7]: "營運週轉天數",
  [PROFIT_PAGE_ENUM.PAGE8]: "現金股利發放率",
};

export interface IProfitRatio extends IDateField {
  //毛利率
  grossProfitMargin: number;
  // 營業利率
  operatingProfitMargin: number;
  // 稅前淨利率
  pretaxProfitMargin: number;
  // 稅後淨利率
  netProfitMargin: number;
  // 所得稅佔稅前淨利比
  effectiveTaxRate: number;
  // ROE
  returnOnEquity: number;
  //ROA
  returnOnAssets: number;
}

export interface IDuPontAnalysisGraph1 extends IDateField {
  // 稅後淨利率
  netProfitMargin: number;
  // 總資產迴轉
  assetTurnover: number;
  // ROA
  returnOnEquity: number;
}

export interface IDuPontAnalysisGraph2 extends IDateField {
  totalAssets: number;
  totalStockholdersEquity: number;
}

export interface IOutsideProfitRatio extends IDateField {
  TotalNonoperatingIncomeAndExpense: number;
}

export interface IPreTaxIncome extends IDateField {
  PreTaxIncome: number;
}

export interface IOperatingItem extends IDateField {
  // 應收帳款收現天數
  receivablesTurnover: number;
  // 存貨週轉天數
  inventoryTurnover: number;
}
