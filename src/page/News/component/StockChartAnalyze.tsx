// TradingViewWidget.jsx

import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";

let tvScriptLoadingPromise: any = null;
function createWidget() {
  if (document.getElementById("tradingview_4b410") && "TradingView" in window) {
    //@ts-ignore
    new window.TradingView.widget({
      autosize: true,
      symbol: "NASDAQ:TSLA",
      interval: "D",
      timezone: "Asia/Taipei",
      theme: "light",
      style: "1",
      locale: "zh_CN",
      enable_publishing: false,
      hide_legend: true,
      container_id: "tradingview_4b410",
    });
  }
}

export default function StockChartAnalyze() {
  const onLoadScriptRef = useRef<any>();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => {
      onLoadScriptRef.current = null;
    };
  }, []);

  return (
    <Box
      sx={{
        height: "549px",
        bgcolor: "#fff",
        borderRadius: "8px",
        flex: 1,
        position: "relative",
      }}
    >
      <div
        className="tradingview-widget-container"
        style={{ height: "100%", width: "100%" }}
      >
        <div
          id="tradingview_4b410"
          style={{ height: "calc(100% - 32px)", width: "100%" }}
        />
        <div className="tradingview-widget-copyright"></div>
      </div>
    </Box>
  );
}
