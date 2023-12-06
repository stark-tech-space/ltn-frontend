export interface IRealTimeQuote {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  exchange: string;
  volume: number;
  avgVolume: number;
  open: number;
  previousClose: number;
  eps: number;
  pe: number;
  sharesOutstanding: number;
  timestamp: number;
}

export interface IStockObject {
  No: string;
  Name: string;
}

// 查询财报的时间段：年度、季度
export enum PERIOD {
  ANNUAL = "annual",
  QUARTER = "quarter",
}

export interface IFinancialStatementRatio {
  // 本益比 (倍)
  peRatio: number;
  // 殖利率 (%)
  dividendYield: number;
  //股價淨值比
  pbRatio: number;
  //盈餘殖利率
  earningsYield: number;

  bookValuePerShare: number;

  [field: string]: number;
}

export const PERIOD_YEAR = [
  { label: "近3年", value: 3 },
  { label: "近5年", value: 5 },
  { label: "近8年", value: 8 },
];

export interface IFinMindApiResponse {
  msg: string;
  status: number;
  data: any;
}

export interface IFinMindDataItem {
  date: string;
  value: number;
  type: string;
  origin_name: string;
}

export interface IDateField {
  // 日期
  date: string;
  // 年度/季
  period: string;
  // 年
  calendarYear: string;
}

export interface IStockCount {
  date: string;
  StockCount: number;
  EPS: number;
}
