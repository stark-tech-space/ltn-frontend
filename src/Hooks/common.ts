import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "@mui/material";
import { fetchIndicators } from "api/common";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { useMatch } from "react-router-dom";

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

export const useFetchIndicators = () => {
  const stock = useRecoilValue(currentStock);
  const [data, setData] = useState<any[]>([]);
  const fetchData = useCallback(async () => {
    const rst = await fetchIndicators({
      period: 20,
      timeKey: "1day",
      type: "sma",
      symbol: stock.Symbol,
      from: "2021-01-01",
      to: "2021-02-01",
    });

    setData(rst as any[]);
  }, [stock.Symbol]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return useMemo(() => data, [data]);
};
