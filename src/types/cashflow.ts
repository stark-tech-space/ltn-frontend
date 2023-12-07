// 现金流相关

import { IDateField } from "./common";

export interface ICashFLowItem extends IDateField {
  // 营业现金流
  netCashProvidedByOperatingActivities: number;
  // 融资现金流
  netCashUsedProvidedByFinancingActivities: number;
  // 投资现金流
  netCashUsedForInvestingActivites: number;
  // 自由现金流
  freeCashFlow: number;
  // 净现金流
  netChangeInCash: number;
  // 季度、年度
  period: string;

  // 税后净利润
  netIncome: number;

  calendarYear: string;

  date: string;
}
