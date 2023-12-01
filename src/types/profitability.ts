export enum PROFITABILITY_PAGE_ENUM {
  PAGE1 = "PAGE1",
  PAGE2 = "PAGE2",
  PAGE3 = "PAGE3",
  PAGE4 = "PAGE4",
  PAGE5 = "PAGE5",
  PAGE6 = "PAGE6",
  PAGE7 = "PAGE7",
}

export const PROFITABILITY_PAGE_CONVERTER: Record<
  PROFITABILITY_PAGE_ENUM,
  string
> = {
  [PROFITABILITY_PAGE_ENUM.PAGE1]: "利潤比率",
  [PROFITABILITY_PAGE_ENUM.PAGE2]: "營業費用率拆解",
  [PROFITABILITY_PAGE_ENUM.PAGE3]: "業外佔稅前淨利比例",
  [PROFITABILITY_PAGE_ENUM.PAGE4]: "ROE / ROA",
  [PROFITABILITY_PAGE_ENUM.PAGE5]: "杜邦分析",
  [PROFITABILITY_PAGE_ENUM.PAGE6]: "經營週轉能力",
  [PROFITABILITY_PAGE_ENUM.PAGE7]: "營運週轉天數",
};

export interface IProfitRatio {
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
  // 日期
  date: string;
  // 年度/季
  period: string;
  // 年
  calendarYear: string;
  // ROE
  returnOnEquity: number;
  //ROA
  returnOnAssets: number;
}
