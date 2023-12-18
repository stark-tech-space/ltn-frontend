import { useEffect, useRef } from "react";

import { Box } from "@mui/material";
import {
  init,
  dispose,
  Chart as IKlineChart,
  registerLocale,
} from "klinecharts";
import ltnApi from "api/http/ltnApi";
import { IApiKlineData, IKLineChartDataItem } from "types/news";
import moment from "moment";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { genStartDateForPriceChart } from "until";
import {
  PERIOD_TYPE,
  PRICE_SCALE_PERIOD,
  PRICE_SCALE_TYPE,
} from "types/common";

interface IKData {}

function genData(timestamp = new Date().getTime(), length = 800) {
  let basePrice = 5000;
  timestamp =
    Math.floor(timestamp / 1000 / 60) * 60 * 1000 - length * 60 * 1000;
  const dataList = [];
  for (let i = 0; i < length; i++) {
    const prices = [];
    for (let j = 0; j < 4; j++) {
      prices.push(basePrice + Math.random() * 60 - 30);
    }
    prices.sort();
    const open = +prices[Math.round(Math.random() * 3)].toFixed(2);
    const high = +prices[3].toFixed(2);
    const low = +prices[0].toFixed(2);
    const close = +prices[Math.round(Math.random() * 3)].toFixed(2);
    const volume = Math.round(Math.random() * 100) + 10;
    const turnover = ((open + high + low + close) / 4) * volume;
    dataList.push({ timestamp, open, high, low, close, volume, turnover });

    basePrice = close;
    timestamp += 60 * 1000;
  }
  return dataList;
}

export default function KLineChart() {
  const klineNodeRef = useRef<HTMLDivElement>(null);
  const klineChartRef = useRef<any>(null);

  const stock = useRecoilValue(currentStock);

  useEffect(() => {
    if (!klineNodeRef.current) return;
    klineChartRef.current = init(klineNodeRef.current, {
      locale: "zh-TW",
      timezone: "Asia/Taipei",
    }) as IKlineChart;

    registerLocale("zh-TW", {
      time: "時間：",
      open: "開：",
      high: "高：",
      low: "低：",
      close: "收：",
      volume: "成交量：",
      turnover: "成交額：",
      change: "漲幅：",
    });

    ltnApi
      .get<{ list: IApiKlineData[] }>(`/financial/stock-prices-detail`, {
        params: {
          securityCode: stock.No,
          startDate: genStartDateForPriceChart({
            label: "1天",
            value: 1,
            type: PERIOD_TYPE.DAY,
            period: PRICE_SCALE_TYPE.MINUTE,
          }),
          time: "desc",
        },
      })
      .then((rst) => {
        if (!rst) return;
        const list: any[] = [];
        const data: IKLineChartDataItem[] = rst.data.list.map((item) => {
          list.push({
            date: item.date,
            open: item.open,
            close: item.close,
            high: item.high,
            low: item.low,
            volume: item.volume,
            turnover: 0,
            time: moment(item.date).format("YYYY-MM-DD HH:mm:ss"),
          });
          return {
            timestamp: moment(item.date).unix() * 1000,
            open: item.open,
            close: item.close,
            high: item.high,
            low: item.low,
            volume: item.volume,
            turnover: 0,
          };
        });
        klineChartRef.current.applyNewData(data);
        // console.log("list:", list);
      });

    return () => {
      dispose(klineChartRef.current);
    };
  }, [stock]);

  return <Box ref={klineNodeRef} height={480} />;
}
