import request from "./request";
import { PERIOD } from "types/common";
import { IMonthlyRevenue, IncomeStatementTable } from "types/financial";
import http from "./http";

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

// 公司營收
export const fetchRevenue = async (params: {
  data_id: string;
  dataset: string;
  start_date?: string;
  end_date?: string;
}): Promise<IMonthlyRevenue | undefined> => {
  try {
    const rst = await http.get(`/data`, {
      params,
    });
    return rst.data;
  } catch (error) {
    console.error(`fetchIncomeStatement error: ${error}`);
  }
};
