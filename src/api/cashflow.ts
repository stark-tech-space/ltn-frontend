import { ICashFLowItem } from "./../types/cashflow";
import { PERIOD } from "types/common";
import fmpApi from "./http/fmpApi";

// 获取现金流状态
export const fetchCashFlowStatement = async (
  symbol: string,
  period: PERIOD,
  limit: number = 1
): Promise<ICashFLowItem[] | undefined> => {
  try {
    const rst = await fmpApi.get(`/cash-flow-statement/${symbol}`, {
      params: { period, limit },
    });
    return rst.data;
  } catch (error) {
    console.error(`fetchCashFlowStatement error: ${error}`);
  }
};
