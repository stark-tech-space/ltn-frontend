import { PERIOD } from "types/common";
import { IIncomeStatements, IMonthlyRevenue } from "types/financial";
import fmpApi from "./http/fmpApi";
import finMindApi from "./http/finmindApi";
import ltnApi from "./http/ltnApi";

// 公司损益表
export const fetchIncomeStatement = async (
  symbol: string,
  period: PERIOD,
  limit: number = 40
): Promise<IIncomeStatements[] | undefined> => {
  try {
    const rst = await fmpApi.get(`/income-statement/${symbol}`, {
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

// 公司營收
export async function fetchEbooks<T>(params: {
  securityCode?: string;
  size?: number;
  year?: number;
  page?: number;
  quarter?: string;
}): Promise<T | undefined> {
  try {
    const rst = await ltnApi.get(`/financial/reports`, {
      params,
    });
    return rst.data;
  } catch (error) {
    console.error(`fetchEbooks error: ${error}`);
  }
}
