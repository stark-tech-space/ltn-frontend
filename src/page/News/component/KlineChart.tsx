import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Fade,
  IconButton,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import {
  init,
  dispose,
  Chart as IKlineChart,
  registerLocale,
} from "klinecharts";
import ltnApi from "api/http/ltnApi";
import { IApiKlineData } from "types/news";
import moment from "moment";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { IFetchKlineDataPeriod, IFetchKlinePeriodRecord } from "types/common";
// import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import CircularLoading from "component/Loading";
import ShareIcon from "@mui/icons-material/Share";
import CodeIcon from "@mui/icons-material/Code";
import { copyAsync } from "until";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Slide, { SlideProps } from "@mui/material/Slide";

import { TransitionProps } from "@mui/material/transitions";

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

function genFetchKlineStartDate(timeKey: IFetchKlineDataPeriod) {
  const HH_MM = "09:00";
  if (timeKey === IFetchKlineDataPeriod.Minute_Detail) {
    return moment(HH_MM, "HH:mm").subtract(48, "hours").toISOString();
  }
  if (timeKey === IFetchKlineDataPeriod.Five_Minute_Detail) {
    return moment(HH_MM, "HH:mm").subtract(48, "hours").toISOString();
  }
  if (timeKey === IFetchKlineDataPeriod.Hour_Detail) {
    return moment(HH_MM, "HH:mm").subtract(45, "days").toISOString();
  }
  if (timeKey === IFetchKlineDataPeriod.Day_Detail) {
    return moment(HH_MM, "HH:mm").subtract(24, "months").toISOString();
  }
  return moment(HH_MM, "HH:mm").subtract(5, "years").toISOString();
}

export default function KLineChart({
  height = 510,
}: {
  height?: number | string;
}) {
  const klineNodeRef = useRef<HTMLDivElement>(null);
  const klineChartRef = useRef<any>(null);

  const stock = useRecoilValue(currentStock);
  const [timeKey, setTimeKey] = useState(IFetchKlineDataPeriod.Week_Detail);
  const [isLoading, setIsLoading] = useState(false);

  const [snackBarState, setSnackBarState] = useState({
    open: false,
    message: "",
  });

  const genGraphData = (data: IApiKlineData[]) => {
    return data.map((item) => ({
      timestamp: moment(item.time).unix() * 1000,
      open: +item.open,
      close: +item.close,
      high: +item.high,
      low: +item.low,
      volume: +item.volume,
      turnover:
        (Number(item.open) +
          Number(item.high) +
          Number(item.low) +
          Number(item.close)) /
        (4 * Number(item.volume)),
    }));
  };

  useEffect(() => {
    if (!klineNodeRef.current) {
      return;
    }
    setIsLoading(true);
    klineChartRef.current = init(klineNodeRef.current, {
      locale: "zh-TW",
      timezone: "Asia/Taipei",
      styles: {
        candle: {
          bar: {
            upColor: "rgba(249, 40, 85, .7)",
            downColor: "rgba(45, 192, 142, .7)",
            upBorderColor: "rgba(249, 40, 85, .7)",
            downBorderColor: "rgba(45, 192, 142, .7)",
            upWickColor: "rgba(249, 40, 85, .7)",
            downWickColor: "rgba(45, 192, 142, .7)",
          },
        },
        indicator: {
          bars: [
            {
              borderSize: 1,
              borderDashedValue: [2, 2],
              upColor: "rgba(45, 192, 142, .7)",
              downColor: "rgba(249, 40, 85, .7)",
              noChangeColor: "#888888",
            },
          ],
        },
      },
    }) as IKlineChart;
    klineChartRef.current.setZoomEnabled(false);
    klineChartRef.current.setMaxOffsetLeftDistance(0);
    klineChartRef.current.setMaxOffsetRightDistance(20);

    ltnApi
      .get<{ list: IApiKlineData[] }>(`/financial/stock-prices`, {
        params: {
          securityCode: stock.No,
          startDate: genFetchKlineStartDate(timeKey),
          endDate: moment("13:30", "HH:MM").toISOString(),
          time: "desc",
          priceType: timeKey,
        },
      })
      .then((rst) => {
        if (!rst) return;
        const data = genGraphData(rst.data.list);
        klineChartRef.current.createIndicator("VOL", true);

        klineChartRef.current.applyNewData(data, false, () => {});
      })
      .finally(() => setIsLoading(false));
    return () => {
      dispose(klineChartRef.current);
    };
  }, [stock.No]);

  const handleClickTimeKey = (key: IFetchKlineDataPeriod) => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeKey(key);
    ltnApi
      .get<{ list: IApiKlineData[] }>(`/financial/stock-prices`, {
        params: {
          securityCode: stock.No,
          startDate: genFetchKlineStartDate(key),
          endDate: moment("13:30", "HH:MM").toISOString(),
          time: "desc",
          priceType: key,
        },
      })
      .then((rst) => {
        if (!rst) return;
        klineChartRef.current.applyNewData(genGraphData(rst.data.list), false);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const handleResize = () => {
      if (klineChartRef.current) {
        klineChartRef.current.resize();
      }
    };
    window.addEventListener("resize", handleResize, false);
    return () => {
      window.removeEventListener("resize", handleResize, false);
    };
  }, []);

  const handleShareUrl = () => {
    const widgetUrl = `${window.location.origin}/embed/${stock.No}`;
    copyAsync(widgetUrl);
    setSnackBarState({ open: true, message: "成功圖表複製網址" });
  };

  const handleCopyEmbedCode = () => {
    const embedCode = `
      <iframe width="100%" height="510" src="${window.location.origin}/embed/${stock.No}" title="LTN Stock embed widget demo" frameborder="0" allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    `;
    copyAsync(embedCode);
    setSnackBarState({ open: true, message: "成功複製內嵌程式碼" });
  };

  return (
    <>
      <Stack>
        <Stack
          direction={"row"}
          columnGap={1}
          alignItems="center"
          borderBottom="1px solid #ebedf1"
          borderTop="1px solid #ebedf1"
          pl={1}
          height="48px"
          boxSizing={"border-box"}
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" columnGap={1}>
            <Typography component="span" px={1}>
              {stock.Name}
            </Typography>
            <Divider orientation="vertical" />
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                "&>button": {
                  px: "6px",
                  mx: "4px",
                  bgcolor: "transparent",
                  border: 0,
                  cursor: "pointer",
                  color: "#333",
                },
              }}
            >
              {IFetchKlinePeriodRecord.map((item) => (
                <button
                  key={item.type}
                  style={{ color: item.type === timeKey ? "#405DF9" : "#333" }}
                  onClick={() => handleClickTimeKey(item.type)}
                >
                  {item.label}
                </button>
              ))}
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" columnGap={2} pr="49px">
            <IconButton onClick={handleShareUrl}>
              <ShareIcon htmlColor="#405df9" fontSize="small" />
            </IconButton>
            <IconButton onClick={handleCopyEmbedCode}>
              <CodeIcon htmlColor="#405df9" />
            </IconButton>
          </Stack>
        </Stack>
        <Box position="relative" height={height}>
          <CircularLoading open={isLoading} />
          <Box ref={klineNodeRef} height={height} />
        </Box>
      </Stack>
      <Snackbar
        open={snackBarState.open}
        onClose={() => setSnackBarState((old) => ({ ...old, open: false }))}
        TransitionComponent={Fade}
        message="複製成功"
        autoHideDuration={1200}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setSnackBarState((old) => ({ ...old, open: false }))}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackBarState.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
