import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Stack,
  Button,
  Menu,
  MenuItem,
  Fade,
  IconButton,
} from "@mui/material";
import { createChart, IChartApi } from "lightweight-charts";

import SaveAltIcon from "@mui/icons-material/SaveAlt";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import dayjs from "dayjs";
import { fetchHistoricalChart, fetchHistoricalPriceFull } from "api/news";
import { IHistoricalChart } from "types/news";
import CircularLoading from "component/Loading";
import { STOCK_SYMBOL } from "constant";
import TradingViewTrendChart from "./TradingViewTrendChart";

const INTERVALS_CONVERTER: Record<string, string> = {
  "1D": "1天",
  "5D": "5天",
  "1M": "1個月",
  "1HM": "6個月",
  "1Y": "1年",
  MAX: "最大",
};

const CHART_OPTIONS = {
  layout: {
    textColor: "#333",
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
    visible: false,
  },
  timeScale: {
    borderVisible: false,
  },
  crosshair: {
    horzLine: {
      visible: false,
    },
  },
};

const genParams = (timeKey: string) => {
  switch (timeKey) {
    case "1D":
      return {
        timeframe: "30min",
        from: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
      };
    case "5D":
      return {
        timeframe: "1hour",
        from: dayjs().subtract(5, "day").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
      };
    case "1M":
      return {
        timeframe: "1day",
        from: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
      };
    case "1HM":
      return {
        from: dayjs().subtract(6, "month").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
      };
    case "1Y":
      return {
        from: dayjs().subtract(1, "year").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
      };
    default:
      return {};
  }
};

export default function ReadTimePriceChart() {
  const areaSeriesRef = useRef<any>();
  const chartRef = useRef<IChartApi | null>(null);
  const chartContainerRef = useRef<HTMLElement | null>(null);

  const [timeKey, setTimeKey] = useState("1D");
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    const t = setInterval(() => {
      if (chartContainerRef.current) {
        setIsReady(true);
        clearInterval(t);
      }
    }, 100);
  }, []);

  useEffect(() => {
    // if (!isReady && !chartRef.current) {
    //   return;
    // }
    // if (chartRef.current && areaSeriesRef.current) {
    //   chartRef.current.removeSeries(areaSeriesRef.current);
    // }
    // const chart = createChart(chartContainerRef.current as HTMLDivElement, {
    //   ...CHART_OPTIONS,
    //   width: chartContainerRef.current?.offsetWidth || 0,
    //   height: chartContainerRef.current?.offsetHeight || 0,
    // });
    // const areaSeries = chart.addAreaSeries({
    //   topColor: "rgba(76, 175, 80, 0.56)",
    //   bottomColor: "rgba(76, 175, 80, 0.04)",
    //   lineColor: "rgba(76, 175, 80, 1)",
    //   lineWidth: 2,
    // });
    // getChartData("1D", (data: any) => {
    //   areaSeries.setData(data);
    //   chart.timeScale().fitContent();
    // });
    // chartRef.current = chart;
    // areaSeriesRef.current = areaSeries;
    // return () => {
    //   chartRef.current?.remove();
    // };
  }, [isReady]);

  const getChartData = async (
    timeKey: string,
    setChartData: (data: any) => void
  ) => {
    // try {
    //   const params = genParams(timeKey);
    //   let chartData: { time: number | string; value: number }[] = [];
    //   setIsLoading(true);
    //   if (params?.timeframe) {
    //     const rst = await fetchHistoricalChart({
    //       symbol: STOCK_SYMBOL,
    //       ...params,
    //     });
    //     if (rst) {
    //       chartData = rst
    //         .map((item) => ({
    //           time: dayjs(item.date).unix(),
    //           value: item.close,
    //         }))
    //         .sort((a, b) => a.time - b.time);
    //     }
    //   } else {
    //     const rst = await fetchHistoricalPriceFull({
    //       symbol: STOCK_SYMBOL,
    //       ...params,
    //     });
    //     if (rst?.historical) {
    //       chartData = rst.historical
    //         .map((item) => ({
    //           time: item.date,
    //           value: item.close,
    //         }))
    //         .sort((a, b) => dayjs(a.time).valueOf() - dayjs(b.time).valueOf());
    //     }
    //   }
    //   setChartData(chartData);
    //   setIsLoading(false);
    // } catch (error) {
    //   setIsLoading(false);
    // }
  };

  const onSwitchTimeKey = (key: string) => {
    setAnchorEl(null);
    setTimeKey(key);
    getChartData(key, (data: any) => {
      areaSeriesRef.current?.setData(data);
    });
  };

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
      {/* <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          <Button
            id="fade-button"
            aria-controls={open ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            sx={{
              px: 2,
              color: "#333",
            }}
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              setAnchorEl(event.currentTarget);
            }}
            endIcon={<KeyboardArrowDownIcon />}
          >
            {INTERVALS_CONVERTER[timeKey]}
          </Button>
          <Menu
            id="fade-menu"
            MenuListProps={{
              "aria-labelledby": "fade-button",
              sx: {
                width: "86px",
              },
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            TransitionComponent={Fade}
          >
            {Object.entries(INTERVALS_CONVERTER).map(([key, value]) => (
              <MenuItem key={key} onClick={() => onSwitchTimeKey(key)}>
                {value}
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <Stack flexDirection="row" alignItems="center" columnGap={3}>
          <IconButton sx={{ transform: "rotate(90deg)" }}>
            <FullscreenIcon htmlColor="#000000" />
          </IconButton>
          <IconButton sx={{ mt: "-4px" }}>
            <SaveAltIcon htmlColor="#000000" />
          </IconButton>
        </Stack>
      </Stack>
      <Box sx={{ height: "509px" }} position="relative">
        <CircularLoading open={isLoading} />
        <Box ref={chartContainerRef} height="100%" />
      </Box> */}
      <TradingViewTrendChart />
    </Box>
  );
}
