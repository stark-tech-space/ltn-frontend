import { PERIOD } from "types/common";
import { IMonthlyRevenue } from "types/financial";
import fmpApi from "./http/fmpApi";
import finMindApi from "./http/finmindApi";

// 公司损益表
export const fetchIncomeStatement = async (
  symbol: string,
  period: PERIOD,
  limit: number = 40
): Promise<any[] | undefined> => {
  try {
    const rst = await fmpApi.get(`/income-statement-growth/${symbol}`, {
      params: { period, limit },
    });
    return rst.data;
  } catch (error) {
    console.error(`fetchIncomeStatement error: ${error}`);
  }
};

// 公司營收
export async function fetchRevenue<T = IMonthlyRevenue>(params: {
  data_id: string;
  dataset: string;
  start_date?: string;
  end_date?: string;
}): Promise<T | undefined> {
  try {
    const rst = await finMindApi.get(`/finmind`, {
      params,
    });
    return rst.data;
  } catch (error) {
    console.error(`fetchRevenue error: ${error}`);
  }
}
