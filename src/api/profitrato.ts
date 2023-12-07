import { PERIOD } from 'types/common';
import fmpApi from './http/fmpApi';

// 获取现金流状态
export async function fetchProfitRatio<T>(
  symbol: string,
  period: PERIOD,
  limit: number = 1,
): Promise<T | undefined> {
  try {
    const rst = await fmpApi.get(`/ratios/${symbol}`, {
      params: { period, limit },
    });
    return rst.data;
  } catch (error) {
    console.error(`fetchProfitRatio error: ${error}`);
  }
}

// fetchBalanceSheetStatement
export async function fetchBalanceSheetStatement<T>(
  symbol: string,
  period: PERIOD,
  limit: number = 1,
): Promise<T | undefined> {
  try {
    const rst = await fmpApi.get(`/balance-sheet-statement/${symbol}`, {
      params: { period, limit },
    });
    return rst.data;
  } catch (error) {
    console.error(`fetchBalanceSheetStatement error: ${error}`);
  }
}
