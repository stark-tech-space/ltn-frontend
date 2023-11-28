import {
  ICompanyState,
  IHistoricalChart,
  IHistoricalPriceFull,
  IQuote,
} from "types/news";
import request from "./request";

// 公司损益表
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
