import {
  ICompanyState,
  IHistoricalChart,
  IHistoricalPriceFull,
  IQuote,
} from "types/news";
import request from "./request";

// 歷史日盤價格
export const fetchHistoricalPriceFull = async (params: {
  symbol: string;
  from?: string;
  to?: string;
}): Promise<IHistoricalPriceFull | undefined> => {
  try {
    const rst = await request.get(`/historical-price-full/${params.symbol}`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
    return rst.data;
  } catch (error) {
    console.error(`fetchHistoricalPriceFull error: ${error}`);
  }
};

// 每日價格走勢key: 1m, 5m, 15m, 30m, 60m, 1d, 1w, 1M
export const fetchHistoricalChart = async (params: {
  symbol: string;
  from?: string;
  to?: string;
  timeframe?: string;
}): Promise<IHistoricalChart[] | undefined> => {
  try {
    const rst = await request.get(
      `/historical-chart/${params.timeframe || "15min"}/${params.symbol}`,
      {
        params: {
          from: params.from,
          to: params.to,
          //   serietype: "line",
        },
      }
    );
    return rst.data;
  } catch (error) {
    console.error(`fetchHistoricalChart error: ${error}`);
  }
};

// 完整報價,提供股票的最新买入价和卖出价，以及成交量和最后成交价。
export const fetchQuote = async (
  symbol: string
): Promise<IQuote[] | undefined> => {
  try {
    const rst = await request.get(`/quote/${symbol}`);
    return rst.data;
  } catch (error) {
    console.error(`fetchQuote error: ${error}`);
  }
};

// 提供价格、贝塔值、市值、描述、总部等关键信息。
export const fetchSymbolInfo = async (
  symbol: string
): Promise<ICompanyState[] | undefined> => {
  try {
    const rst = await request.get(`/profile/${symbol}`);
    return rst.data;
  } catch (error) {
    console.error(`fetchSymbolInfo error: ${error}`);
  }
};
