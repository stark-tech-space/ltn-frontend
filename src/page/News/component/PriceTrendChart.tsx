import { useEffect, useRef, useState } from "react";
import {
  PERIOD_TYPE,
  PRICE_SCALE_PERIOD,
  PRICE_SCALE_PERIOD_ITEM,
  PRICE_SCALE_TYPE,
} from "types/common";
import moment from "moment";
import { io } from "socket.io-client";
import { useRecoilValue } from "recoil";
import ltnApi from "api/http/ltnApi";
import { currentStock } from "recoil/selector";
import CircularLoading from "component/Loading";
import { Box, Button, Stack } from "@mui/material";
import * as lightweightCharts from "lightweight-charts";
import { genStartDateForPriceChart, timeToTz } from "until";
import { test_01 } from "./test";

interface IPrice {
  time: string;
  price: number;
}

interface IStockPushedDataItem {
  date: string;
  close: number;
}

interface IStockRst {
  success: boolean;
  data: IStockPushedDataItem;
}

const isClosedMarket = (now: number) => {
  return moment().isBefore("13:30:00");
};

// console.log(moment("2023-12-15T01:11:45.374Z").format("YYYY-MM-DD:HH:mm:ss"));

export default function PriceTrendChart() {
  const stock = useRecoilValue(currentStock);
  const chartRef = useRef<lightweightCharts.IChartApi | null>(null);
  const areaSeriesRef = useRef<lightweightCharts.ISeriesApi<"Area"> | null>(
    null
  );
  const toolTip = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLElement>(null);
  const graphPeriodType = useRef<PRICE_SCALE_TYPE>(PRICE_SCALE_TYPE.MINUTE);
  const firstReceived = useRef(true);

  const [graphPeriod, setGraphPeriod] = useState(PRICE_SCALE_PERIOD[0]);
  const [isLoading, setIsLoading] = useState(false);

  const format = (data: IPrice[], isBusinessDay: boolean) => {
    // debugger;
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

    return data.slice(0, -1).map((item: any) => ({
      time: moment(item.time).unix(),
      value: +item.price,
    }));

    // const totalItems = 4 * 60 + 30;

    // const all: any[] = new Array(totalItems).fill(0);
    // const test: any = [];

    // return all.map((_, index) => {
    //   if (index < formatData.length) {
    //     // test.push({
    //     //   ...formatData[index],
    //     //   fmt: moment(formatData[index].time * 1000).format(
    //     //     "YYYY-MM-DD:HH:mm:ss"
    //     //   ),
    //     // });
    //     // console.log(
    //     //   "has:",
    //     //   moment(formatData[index].time * 1000).format("YYYY-MM-DD:HH:mm:ss")
    //     // );

    //     return { ...formatData[index] };
    //   } else {
    //     const t = moment("09:00", "HH:mm").unix() + index * 60;
    //     // const date = moment(t * 1000);
    //     // console.log("none", date.format("YYYY-MM-DD:HH:mm:ss"));

    //     // test.push({
    //     //   time: t,
    //     //   value: undefined,
    //     //   // fmt: date.format("YYYY-MM-DD:HH:mm:ss"),
    //     // });

    //     return {
    //       time: t,
    //       value: undefined,
    //       // fmt: date.format("YYYY-MM-DD:HH:mm:ss"),
    //     };
    //   }
    // });

    // return list
    //   .map((item) => ({ time: item.time, value: item.value }))
    //   .reverse();

    // return isClosedMarket(+data[data.length - 1].time)
    //   ? formatData.slice(0, -1)
    //   : formatData;
  };

  const genGraphData = (periodType: PERIOD_TYPE, data: IPrice[]) => {
    return format(data, periodType !== "day");
  };

  const handleSubscribeCrosshairMove = () => {
    try {
      if (
        chartRef.current &&
        chartContainerRef.current &&
        toolTip.current &&
        areaSeriesRef.current
      ) {
        chartRef.current.subscribeCrosshairMove((param: any) => {
          const toolTipWidth = 80;
          const toolTipHeight = 80;
          const toolTipMargin = 15;
          const containerClientWidth =
            chartContainerRef.current?.clientWidth || 0;
          const containerClientHeight =
            chartContainerRef.current?.clientHeight || 0;

          if (
            param.point === undefined ||
            !param.time ||
            param.point.x < 0 ||
            param.point.x > containerClientWidth ||
            param.point.y < 0 ||
            param.point.y > containerClientHeight
          ) {
            toolTip.current!.style!.display = "none";
          } else {
            const dateStr =
              typeof param.time === "object"
                ? `${param.time.year}-${param.time.month}-${param.time.day}`
                : timeToTz(param.time, "Asia/Taipei").format(
                    "YYYY-MM-DD HH:mm"
                  );

            toolTip.current!.style.display = "block";
            const data: any = areaSeriesRef.current
              ? param.seriesData.get(areaSeriesRef.current)
              : {};

            const price = data?.value !== undefined ? data.value : "";
            toolTip.current!.innerHTML = `<div style="color: ${"#333"}">${
              stock.Name
            }</div><div style="font-size: 18px; margin: 4px 0px; color: ${"#333"}">
          ${price}
          </div><div style="color: ${"#333"}">
          ${dateStr}
          </div>`;

            const coordinate =
              areaSeriesRef.current?.priceToCoordinate(price) || 0;
            let shiftedCoordinate = param.point.x - 50;
            if (coordinate === null) {
              return;
            }
            shiftedCoordinate = Math.max(
              0,
              Math.min(containerClientWidth - toolTipWidth, shiftedCoordinate)
            );
            const coordinateY =
              coordinate - toolTipHeight - toolTipMargin > 0
                ? coordinate - toolTipHeight - toolTipMargin
                : Math.max(
                    0,
                    Math.min(
                      containerClientHeight - toolTipHeight - toolTipMargin,
                      coordinate + toolTipMargin
                    )
                  );
            toolTip.current!.style.left = shiftedCoordinate + "px";
            toolTip.current!.style.top = coordinateY + "px";
          }
        });
      }
    } catch (error) {
      console.error("updateToolTip error", error);
    }
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

        crosshair: {
          horzLine: {
            visible: false,
            labelVisible: false,
          },
          vertLine: {
            labelVisible: false,
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
      lineType: lightweightCharts.LineType.Simple,
      lastPriceAnimation: lightweightCharts.LastPriceAnimationMode.Disabled,
      priceFormat: {
        type: "custom",
        minMove: 2,
        formatter: (price: any) => (price ? price.toFixed(2) : ""),
      },
    });

    series.priceScale().applyOptions({
      autoScale: true,
      scaleMargins: {
        top: 0.1,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    areaSeriesRef.current = series;

    ltnApi
      .get<{ list: IPrice[] }>(`/financial/stock-prices`, {
        params: {
          securityCode: stock.No,
          priceType: "minute",
          startDate: genStartDateForPriceChart(graphPeriod),
          time: "desc",
        },
      })
      .then((rst: any) => {
        if (rst) {
          const graph = genGraphData(PERIOD_TYPE.DAY, rst.data.list);

          series.applyOptions({
            lastPriceAnimation:
              lightweightCharts.LastPriceAnimationMode.OnDataUpdate,
            // lastPriceAnimation: isClosedMarket(+graph[graph.length - 1].time)
            //   ? lightweightCharts.LastPriceAnimationMode.Disabled
            //   : lightweightCharts.LastPriceAnimationMode.Continuous,
          });
          series.setData(graph as any);
          chart.timeScale().applyOptions({
            timeVisible: true,
            secondsVisible: false,
          });
          handleSubscribeCrosshairMove();
          chart.timeScale().fitContent();
        }
      })
      .finally(() => setIsLoading(false));
    return () => {
      if (chartRef.current && areaSeriesRef.current) {
        chartRef.current.remove();
      }
    };
  }, [stock.No]);

  const updateLatestData = (rst: IStockRst) => {
    // if (!rst.success || firstReceived.current) {
    //   firstReceived.current = false;
    //   return;
    // }
    // if (chartRef.current && rst.data) {
    //   let nextData: { [key: string]: any } = {};
    //   const axisTime = timeToTz(
    //     new Date(rst.data.date).getTime() / 1000,
    //     "Asia/Taipei"
    //   );
    //   if (graphPeriodType.current === PRICE_SCALE_TYPE.MINUTE) {
    //     nextData.time = moment(
    //       `${axisTime.hour()}:${axisTime.minute()}`,
    //       "HH:mm"
    //     ).unix();
    //     nextData.value = +rst.data.close;
    //   } else {
    //     // 只有一天的数据才做分钟的刻度 （暂时如此）
    //     nextData.time = {
    //       year: axisTime.year(),
    //       month: axisTime.month(),
    //       day: axisTime.date(),
    //     };
    //     nextData.value = +rst.data.close;
    //   }
    //   console.log(nextData.time, axisTime.format("YYYY-MM-DD HH:mm"));
    //   areaSeriesRef.current?.update(nextData as lightweightCharts.AreaData);
    //   chartRef.current.timeScale().fitContent();
    // }
  };

  useEffect(() => {
    if (!stock.No) return;
    const socket = io("wss://financial-data-gateway-dev.intltrip.com");
    socket.on("connect", () => {
      socket.emit("subscribe-stock-price", { stockId: stock.No });
      console.log("訂閱成功");
    });
    // 订阅分钟级别的股价
    socket.on("stock-price", (data: IStockRst) => {
      console.log("data:", data);
      // console.log("graphPeriodType.current", graphPeriodType.current);
      if (graphPeriodType.current === PRICE_SCALE_TYPE.MINUTE) {
        // console.log("ddd:", data.data);
        updateLatestData(data);
      }
    });
    // 订阅半小时级别的股价
    socket.on("stock-price-half-hour", (data: IStockRst) => {
      if (graphPeriodType.current === PRICE_SCALE_TYPE.HOURLY) {
        updateLatestData(data);
      }
    });
    // 订阅一小时级别的股价
    socket.on("stock-price-hour", (data: IStockRst) => {
      if (graphPeriodType.current === PRICE_SCALE_TYPE.HOUR) {
        updateLatestData(data);
      }
    });
    // 订阅一天级别的股价
    socket.on("stock-price-day", (data: IStockRst) => {
      if (graphPeriodType.current === PRICE_SCALE_TYPE.DAY) {
        updateLatestData(data);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [stock.No]);

  const handleClickPeriod = async (targetPeriod: PRICE_SCALE_PERIOD_ITEM) => {
    if (!stock.No || isLoading) {
      return;
    }

    setGraphPeriod(targetPeriod);
    setIsLoading(true);
    graphPeriodType.current = targetPeriod.period;
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

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.resize(
          chartContainerRef.current.offsetWidth,
          chartContainerRef.current.offsetHeight
        );
        chartRef.current?.timeScale().fitContent();
      }
    };
    window.addEventListener("resize", handleResize, false);
    return () => {
      window.removeEventListener("resize", handleResize, false);
    };
  }, []);

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
            onClick={() => handleClickPeriod(item)}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
      <Box position="relative" pb={2}>
        <CircularLoading open={isLoading} />
        <Box ref={chartContainerRef} height={480} position="relative">
          <Box
            ref={toolTip}
            sx={{
              width: 120,
              height: 90,
              position: "absolute",
              display: "none",
              p: 1,
              boxSizing: "border-box",
              fontSize: "12px",
              textAlign: "left",
              left: "12px",
              top: "12px",
              pointerEvents: "none",
              borderRadius: "6px",
              bgcolor: "#fff",
              color: "#fff",
              zIndex: "100",
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0 1px 2px 0px, rgba(60, 64, 67, 0.15) 0 2px 6px 2px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
