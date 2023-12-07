import { PERIOD } from "types/common";
import fmpApi from "./http/fmpApi";

// 成長分析
export async function fetchSecurityRatio<T>(
  symbol: string,
  period: PERIOD,
  limit: number = 1
): Promise<T | undefined> {
  try {
    const rst = await fmpApi.get(`/ratios/${symbol}`, {
      params: { period, limit },
    });
    return rst.data;
  } catch (error) {
    console.error(`fetchSecurityRatio error: ${error}`);
  }
}

export async function fetchSecurityBalanceSheetStatement<T>(
  symbol: string,
  period: PERIOD,
  limit: number = 1
): Promise<T | undefined> {
  try {
    const rst = await fmpApi.get(`/balance-sheet-statement/${symbol}`, {
      params: { period, limit },
    });
    return rst.data;
  } catch (error) {
    console.error(`fetchSecurityBalanceSheetStatement error: ${error}`);
  }
}
