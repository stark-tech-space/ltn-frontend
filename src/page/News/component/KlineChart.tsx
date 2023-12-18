import { useEffect, useRef } from "react";

import { Box } from "@mui/material";
import { KLineChartPro, DefaultDatafeed, ChartPro } from "@klinecharts/pro";
import "@klinecharts/pro/dist/klinecharts-pro.css";
const apiKey = "nIqB08zspuDIE_BK2lwypBx6XG8p6HjS";

export default function KLineChart() {
  const klineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!klineRef.current) return;
    const chart: ChartPro = new KLineChartPro({
      container: klineRef.current as HTMLElement,
      // 初始化标的信息
      symbol: {
        exchange: "XNYS",
        market: "stocks",
        name: "Alibaba Group Holding Limited American Depositary Shares, each represents eight Ordinary Shares",
        shortName: "BABA",
        ticker: "BABA",
        priceCurrency: "usd",
        type: "ADRC",
      },
      watermark: undefined,
      // 初始化周期
      period: { multiplier: 15, timespan: "minute", text: "15m" },
      // 这里使用默认的数据接入，如果实际使用中也使用默认数据，需要去 https://polygon.io/ 申请 API key
      datafeed: new DefaultDatafeed(`${apiKey}`),
      subIndicators: undefined,
      mainIndicators: undefined,
    });
  }, []);

  return <Box ref={klineRef} height={480} />;
}
