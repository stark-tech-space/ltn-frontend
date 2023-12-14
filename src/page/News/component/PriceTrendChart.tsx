import { Box, Button, Stack } from "@mui/material";
import * as lightweightCharts from "lightweight-charts";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  PERIOD_TYPE,
  PRICE_SCALE_PERIOD,
  PRICE_SCALE_PERIOD_ITEM,
} from "types/common";
import CircularLoading from "component/Loading";
import { test_01 } from "./test";
import { io } from "socket.io-client";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import moment from "moment";
import ltnApi from "api/http/ltnApi";

import { genStartDateForPriceChart, timeToTz } from "until";

interface IPrice {
  time: string;
  price: number;
}

interface IStockPushedDataItem {
  date: string;
  close: number;
}

export default function PriceTrendChart() {
  const stock = useRecoilValue(currentStock);
  const chartRef = useRef<lightweightCharts.IChartApi | null>(null);
  const areaSeriesRef = useRef<lightweightCharts.ISeriesApi<"Area"> | null>(
    null
  );
  const chartContainerRef = useRef<HTMLElement | null>(null);

  const [graphPeriod, setGraphPeriod] = useState(PRICE_SCALE_PERIOD[0]);
  const [isLoading, setIsLoading] = useState(false);

  const toolTip = useRef<HTMLDivElement>();

  const format = (data: IPrice[], isBusinessDay: boolean) => {
    if (isBusinessDay) {
      return data.map((item: any) => {
        const axTime = moment(item.time);
        return {
          time: {
            year: axTime.year(),
            month: axTime.month() + 1,
            day: axTime.date(),
          },
          value: +item.price,
        };
      });
    }
    return data.map((item: any) => ({
      time: moment(item.time).unix(),
      value: +item.price,
    }));
  };

  // test udpate
  // const setIntervalGraph = () => {
  //   if (chartRef.current && areaSeriesRef.current) {
  //     index++;
  //     areaSeriesRef.current.update({
  //       time: moment(timeStamp * 1000)
  //         .add(1 * index, "minute")
  //         .unix(),
  //       value: +faker.finance.amount(579, 582),
  //     } as any);
  //     chartRef.current.timeScale().fitContent();
  //   }
  // };

  const genGraphData = (periodType: PERIOD_TYPE, data: IPrice[]) => {
    if (periodType === "day") {
      return data.slice(0, 100).map((item: IPrice) => ({
        time: moment(item.time).unix(),
        value: +item.price,
      }));
    }
    return format(data, true);
  };

  useEffect(() => {
    setIsLoading(true);
    const chart = lightweightCharts.createChart(
      chartContainerRef.current as HTMLDivElement,
      {
        width: chartContainerRef.current?.offsetWidth || 0,
        height: chartContainerRef.current?.offsetHeight || 0,
        localization: {
          locale: "zh-TW",
          timeFormatter: function (businessDayOrTimestamp: any) {
            if (lightweightCharts.isBusinessDay(businessDayOrTimestamp)) {
              return `${businessDayOrTimestamp.year}-${businessDayOrTimestamp.month}-${businessDayOrTimestamp.day}`;
            }
            return timeToTz(businessDayOrTimestamp, "Asia/Taipei").format(
              "YYYY-MM-DD HH:mm"
            );
          },
        },
        layout: {
          textColor: "#333",
          background: {
            type: lightweightCharts.ColorType.Solid,
            color: "#fff",
          },
        },
        grid: {
          vertLines: {
            visible: false,
          },
          horzLines: {
            visible: false,
          },
        },
        rightPriceScale: {
          borderVisible: false,
          visible: true,
          scaleMargins: {
            top: 0,
            bottom: 0,
          },
        },
        timeScale: {
          visible: true,
          fixLeftEdge: true,
          fixRightEdge: true,
          borderVisible: false,
          tickMarkFormatter: (
            time: lightweightCharts.Time,
            tickType: lightweightCharts.TickMarkType
          ) => {
            if (lightweightCharts.isBusinessDay(time)) {
              if (tickType === 0) {
                return `${time.year}`;
              }
              return tickType === 1 ? `${time.month}月` : `${time.day}`;
            }
            return timeToTz(time as number, "Asia/Taipei").format("HH:mm");
          },
        },
        handleScale: false,
      }
    );

    const series = chart.addAreaSeries({
      topColor: "rgba( 239, 83, 80, 0.05)",
      bottomColor: "rgba( 239, 83, 80, 0.01)",
      lineColor: "rgba( 239, 83, 80, 1)",
      lineWidth: 2,
      lineType: lightweightCharts.LineType.Curved,
      lastPriceAnimation: lightweightCharts.LastPriceAnimationMode.Continuous,
    });

    series.priceScale().applyOptions({
      autoScale: true,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    });

    chartRef.current = chart;
    areaSeriesRef.current = series;

    ltnApi
      .get<{ list: IPrice[] }>(`/financial/stock-prices`, {
        params: {
          securityCode: stock.No,
          priceType: "minute",
          startDate: moment("2023-12-14 08:00").toISOString(),
          time: "desc",
        },
      })
      .then((rst: any) => {
        if (rst) {
          const graph = genGraphData(PERIOD_TYPE.DAY, rst.data.list);
          series.applyOptions({
            lastPriceAnimation:
              +graph[graph.length - 1].time <= moment("13:30", "HH:mm").unix()
                ? lightweightCharts.LastPriceAnimationMode.Disabled
                : lightweightCharts.LastPriceAnimationMode.Continuous,
          });
          series.setData(graph as any);
          chart.timeScale().applyOptions({
            timeVisible: true,
            secondsVisible: false,
          });
          chart.timeScale().fitContent();
        }
      })
      .finally(() => setIsLoading(false));
  }, [stock.No]);

  useEffect(() => {
    if (!stock.No) return;
    const socket = io("wss://financial-data-gateway-dev.intltrip.com");

    socket.on("connect", () => {
      socket.emit("subscribe-stock-price", { stockId: stock.No });
      console.log(111);
    });

    // 订阅分钟级别的股价
    socket.on("stock-price", (data: any) => {
      console.log("data:", data);
    });

    // 订阅半小时级别的股价
    socket.on("stock-price-half-hour", (data: any) => {});

    // 订阅一小时级别的股价
    socket.on("stock-price-hour", (data: any) => {});

    // 订阅一天级别的股价
    socket.on("stock-price-day", (data: any) => {});

    return () => {
      socket.disconnect();
    };
  }, [stock.No]);

  const handleClickPeriod = async (targetPeriod: PRICE_SCALE_PERIOD_ITEM) => {
    if (!stock.No || isLoading) {
      return;
    }
    setIsLoading(true);

    const params = {
      priceType: "",
      time: "desc",
      securityCode: stock.No,
      startDate: genStartDateForPriceChart(targetPeriod),
    };

    if (targetPeriod.type === "day") {
      params.priceType = "minute";
    } else {
      params.priceType = "day";
    }
    // 历史股价暂时没有爬完，先只做天数
    // else if (targetPeriod.type === "month") {
    //   params.priceType = targetPeriod.value === 1 ? "day" : "hour";
    // } else if (targetPeriod.type === "year") {
    //   params.priceType = "day";
    // }

    const rst = await ltnApi
      .get<{ list: IPrice[] }>(`/financial/stock-prices`, {
        params,
      })
      .finally(() => {
        setIsLoading(false);
      });
    if (!rst.data.list) {
      return;
    }
    const graph = genGraphData(targetPeriod.type, rst.data.list);
    areaSeriesRef.current?.setData(graph as any);
    chartRef.current?.timeScale().fitContent();
  };

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        columnGap="2px"
        sx={{
          "&>button": {
            px: 0,
            width: "50px",
            bgcolor: "transparent",
            border: 0,
            cursor: "pointer",
          },
        }}
      >
        {PRICE_SCALE_PERIOD.map((item) => (
          <Button
            key={item.type}
            sx={{
              color:
                item.type === graphPeriod.type &&
                item.value === graphPeriod.value
                  ? "#405DF9"
                  : "#333",
            }}
            onClick={() => {
              setGraphPeriod(item);
              handleClickPeriod(item);
            }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
      <Box position="relative" pb={2}>
        <CircularLoading open={isLoading} />
        <Box ref={chartContainerRef} height={500} />
        <Box
          ref={toolTip}
          sx={{
            width: 80,
            height: 80,
            position: "absolute",
            display: "none",
            p: 1,
            boxSizing: "border-box",
            fontSize: "12px",
            textAlign: "left",
            left: "12px",
            top: "12px",
            pointerEvents: "none",
            border: "1px solid rgba( 38, 166, 154, 1)",
            borderRadius: "8px",
            bgcolor: "#000",
            color: "#fff",
          }}
        />
      </Box>
    </Box>
  );
}
