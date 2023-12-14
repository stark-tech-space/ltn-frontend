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

export enum PERIOD_TYPE {
  YEAR = "year",
  MONTH = "month",
  QUARTER = "quarter",
}

export enum PRICE_SCALE_TYPE {
  MINUTE = "minute",
  HOURLY = "half_hour",
  DAY = "day",
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
  // { label: "近1月", value: 1, type: PERIOD_TYPE.MONTH },
  // { label: "近1年", value: 1, type: PERIOD_TYPE.YEAR },
  { label: "近3年", value: 3, type: PERIOD_TYPE.YEAR },
  { label: "近5年", value: 5, type: PERIOD_TYPE.YEAR },
  { label: "近8年", value: 8, type: PERIOD_TYPE.YEAR },
];

export const PRICE_SCALE_PERIOD = [
  { label: "1天", value: 1, type: PRICE_SCALE_TYPE.MINUTE },
  { label: "1月", value: 1, type: PRICE_SCALE_TYPE.HOURLY },
  { label: "1年", value: 1, type: PRICE_SCALE_TYPE.DAY },
  { label: "3年", value: 3, type: PRICE_SCALE_TYPE.DAY },
];

// const INTERVALS_CONVERTER: Record<string, string> = {
//   "1D": "1天",
//   "5D": "5天",
//   "1M": "1個月",
//   "1HM": "6個月",
//   "1Y": "1年",
//   MAX: "最大",
// };

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

export interface ILTNDataItem {
  code: string;
  date: string;
  name: string;
  value: string;
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

export interface IIndicatorItem {
  date: string;
  sma: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IStockPrice {
  Trading_Volume: number;
  Trading_money: number;
  Trading_turnover: number;
  close: number;
  date: string;
  max: number;
  min: number;
  open: number;
  spread: number;
  stock_id: string;
}

export interface ILtnApiCommonData {
  total: number;
  totalPage: number;
  currentPage: number;
  size: number;
}
