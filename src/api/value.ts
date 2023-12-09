import fmpApi from "./http/fmpApi";

export async function fetchDividendHistorical<T>(symbol: string): Promise<T | undefined> {
  try {
    const rst = await fmpApi.get(`/historical-price-full/stock_dividend/${symbol}`);
    return rst.data;
  } catch (error) {
    console.error(`fetchDividendHistorical error: ${error}`);
  }
}
