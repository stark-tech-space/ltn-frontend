import { Box, Button, Stack } from "@mui/material";
import {
  createChart,
  ColorType,
  LocalizationOptions,
  ChartOptions,
  IChartApi,
  ISeriesApi,
  IPriceLine,
  LineType,
  PriceScaleMode,
} from "lightweight-charts";
import { useCallback, useEffect, useRef, useState } from "react";
import { PRICE_SCALE_PERIOD } from "types/common";
import CircularLoading from "component/Loading";
import { test_01 } from "./test";
import { io } from "socket.io-client";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import moment from "moment";
import ltnApi from "api/http/ltnApi";

interface IPrice {
  time: string;
  price: number;
}

const CHART_OPTIONS = {
  // handleScale: false,
};

export default function PriceTrendChart() {
  const stock = useRecoilValue(currentStock);
  const chartRef = useRef<IChartApi>();
  const areaSeriesRef = useRef<ISeriesApi<"Area">>();
  const chartContainerRef = useRef<HTMLElement | null>(null);

  const [interval, setInterval] = useState(PRICE_SCALE_PERIOD[0]);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toolTip = useRef<HTMLDivElement>();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current as HTMLDivElement, {
      width: chartContainerRef.current?.offsetWidth || 0,
      height: chartContainerRef.current?.offsetHeight || 0,
      layout: {
        textColor: "#333",
        background: { type: ColorType.Solid, color: "#fff" },
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
          top: 0.05,
          bottom: 0.2,
        },
      },
      timeScale: {
        visible: true,
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
      },
      handleScale: false,
    });

    const series = chart.addAreaSeries({
      topColor: "rgba( 239, 83, 80, 0.05)",
      bottomColor: "rgba( 239, 83, 80, 0.018)",
      lineColor: "rgba( 239, 83, 80, 1)",
      lineWidth: 2,
    });
    series.priceScale().applyOptions({
      scaleMargins: {
        top: 0.2,
        bottom: 0.2,
      },
    });

    const graphData = test_01.map((item) => ({
      time: moment(item.time).unix(),
      value: +item.price,
    }));

    series.setData(graphData as any);
    // chart.timeScale().applyOptions({
    //   timeVisible: true,
    //   secondsVisible: false,
    // });
    chart.timeScale().fitContent();

    // ltnApi
    //   .get<{ list: IPrice[] }>(`/financial/stock-prices`, {
    //     params: {
    //       securityCode: stock.No,
    //       priceType: "minute",
    //       startDate: moment("2023-12-14 08:00").toISOString(),
    //       time: "desc",
    //     },
    //   })
    //   .then((rst: any) => {
    //     if (rst) {
    //       const graph = rst.data.list.map((item: IPrice) => ({
    //         time: moment(item.time).unix(),
    //         value: +item.price,
    //       }));

    //       series.setData(graph as any);
    //       chart.timeScale().fitContent();
    //     }
    //   });
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
              color: item.type === interval.type ? "#405DF9" : "#333",
            }}
            onClick={() => {
              setInterval(item);
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
