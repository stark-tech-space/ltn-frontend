import request from "./request";
import { PERIOD } from "types/common";
import { IncomeStatementTable } from "types/financial";

// 公司损益表
export const fetchIncomeStatement = async (
  symbol: string,
  period: PERIOD,
  limit: number = 40
): Promise<IncomeStatementTable[] | undefined> => {
  try {
    const rst = await request.get(`/income-statement-growth/${symbol}`, {
      params: { period, limit },
    });
    return rst.data;
  } catch (error) {
    console.error(`fetchIncomeStatement error: ${error}`);
  }
};
