import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "@mui/material";
import { fetchIndicators } from "api/common";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { useMatch } from "react-router-dom";
import { stockPerQuarterCountState } from "recoil/atom";
import { genFullDateObject, getBeforeYears } from "until";
import { IIndicatorItem } from "types/common";
import { getSmaByMonth } from "lib/sma";

export const useWindowResize = (node: HTMLDivElement, chart: any) => {
  const handleResize = debounce(() => {
    if (node && chart) {
      chart?.resize(node.clientWidth, node.clientHeight);
      console.log("resize", node.clientWidth, node.clientHeight);
    } else {
      console.log("resize", 0, 0);
    }
  }, 60);

  useEffect(() => {
    setTimeout(() => {
      window.addEventListener("resize", handleResize, false);
      return () => {
        window.removeEventListener("resize", handleResize, false);
      };
    }, 2000);
  }, [chart, node, handleResize]);
};

// 获取月股票数量

export const useGetStockCountByMonth = () => {
  const stockCountLit = useRecoilValue(stockPerQuarterCountState);
  return useCallback(
    (date: string) => {
      const dateObject = genFullDateObject(date);
      return stockCountLit.find((item) => {
        return item.period === dateObject.period;
      });
    },
    [stockCountLit]
  );
};

export const useAvgPriceByMonth = (period: number) => {
  const [sma, setSma] = useState<{ sma: number; date: string }[]>([]);
  const stock = useRecoilValue(currentStock);

  useEffect(() => {
    fetchIndicators<IIndicatorItem[]>({
      symbol: stock.Symbol,
      type: "sma",
      period: 20,
      timeKey: "1day",
      from: getBeforeYears(period),
    }).then((rst) => {
      if (rst) {
        const data = getSmaByMonth(rst);
        setSma(data);
      }
    });
  }, [stock.Symbol, period]);

  return useMemo(() => sma, [sma]);
};
