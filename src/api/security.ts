import { PERIOD } from 'types/common';
import fmpApi from './http/fmpApi';

// 成長分析、速動比、流動比
export async function fetchSecurityRatio<T>(
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
    console.error(`fetchSecurityRatio error: ${error}`);
  }
}

// // fetchBalanceSheetStatement
// export async function fetchBalanceSheetStatement<T>(
//   symbol: string,
//   period: PERIOD,
//   limit: number = 1
// ): Promise<T | undefined> {
//   try {
//     const rst = await fmpApi.get(`/balance-sheet-statement/${symbol}`, {
//       params: { period, limit },
//     });
//     return rst.data;
//   } catch (error) {
//     console.error(`fetchBalanceSheetStatement error: ${error}`);
//   }
// }
