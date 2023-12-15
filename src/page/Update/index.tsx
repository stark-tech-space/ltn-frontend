import { fetchPerQuarterStocks } from "api/common";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { currentStock } from "recoil/selector";
import { stockPerQuarterCountState } from "recoil/atom";
import { IStockCount } from "types/common";
import { genFullDateObject, getBeforeYears } from "until";

export function UpdateStockCount() {
  const stock = useRecoilValue(currentStock);
  const setStockCount = useSetRecoilState(stockPerQuarterCountState);

  useEffect(() => {
    // // 默认拿12年的数据
    fetchPerQuarterStocks<IStockCount[]>({
      data_id: stock.No,
      start_date: getBeforeYears(12),
      limit: 12 * 4,
    }).then((rst) => {
      const data = rst?.map((item) => ({
        ...genFullDateObject(item.date),
        StockCount: item.StockCount,
        EPS: item.EPS,
      }));
      setStockCount(data as any);
    });
  }, [setStockCount, stock.No]);

  return null;
}

export default function Update() {
  return <UpdateStockCount />;
}
