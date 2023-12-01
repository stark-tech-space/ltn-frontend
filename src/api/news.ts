import { ICompanyState, IQuote } from "types/news";
import fmpApi from "./http/fmpApi";

// 完整報價,提供股票的最新买入价和卖出价，以及成交量和最后成交价。
export const fetchQuote = async (
  symbol: string
): Promise<IQuote[] | undefined> => {
  try {
    const rst = await fmpApi.get(`/quote/${symbol}`);
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
    const rst = await fmpApi.get(`/profile/${symbol}`);
    return rst.data;
  } catch (error) {
    console.error(`fetchSymbolInfo error: ${error}`);
  }
};
