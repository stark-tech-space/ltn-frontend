import {
  IFinMindApiResponse,
  IFinancialStatementRatio,
  IRealTimeQuote,
  PERIOD,
} from "types/common";

import fmpApi from "./http/fmpApi";
import finMindApi from "./http/finmindApi";

// 实时提供股票的最新买入价和卖出价，以及成交量和最后成交价。
export const fetchQuote = async (
  symbol: string
): Promise<IRealTimeQuote[] | undefined> => {
  try {
    const rst = await fmpApi.get(`/quote/${symbol}`);
    return rst.data;
  } catch (error) {
    console.error(`fetchQuote error: ${error}`);
  }
};

// 获取公司的财务比率
export const fetchCompanyRatios = async (
  symbol: string,
  period: PERIOD,
  limit: number = 4
): Promise<IFinancialStatementRatio[] | undefined> => {
  try {
    const rst = await fmpApi.get(`/key-metrics/${symbol}`, {
      params: { period, limit },
    });
    return rst.data;
  } catch (error) {
    console.error(`fetchCompanyRatios error: ${error}`);
  }
};

// 获取公司的收入增长率。
export const fetchGrowthRates = async (
  symbol: string,
  period: PERIOD,
  limit: number = 40
): Promise<IFinancialStatementRatio[] | undefined> => {
  try {
    const rst = await fmpApi.get(`/income-statement-growth/${symbol}`, {
      params: { period, limit },
    });
    return rst.data;
  } catch (error) {
    console.error(`fetchGrowthRates error: ${error}`);
  }
};

// 获取關鍵指標數據
export const fetchKeyMetrics = async (
  symbol: string,
  period: PERIOD,
  limit: number = 140
): Promise<{ [field: string]: any }[] | undefined> => {
  try {
    const rst = await fmpApi.get(`/key-metrics/${symbol}`, {
      params: { period, limit },
    });
    return rst.data;
  } catch (error) {
    console.error(`fetchKeyMetrics error: ${error}`);
  }
};

// findmind api
export async function fetchFindMindAPI<T>(params: {
  data_id: string;
  dataset: string;
  start_date?: string;
  end_date?: string;
}): Promise<T | undefined> {
  try {
    const rst = await finMindApi.get<IFinMindApiResponse>(`/finmind`, {
      params,
    });
    if (!rst.data.data) {
      return;
    }
    return rst.data.data;
  } catch (error) {
    console.error(`finMindApi ${params.dataset} error: ${error}`);
  }
}
