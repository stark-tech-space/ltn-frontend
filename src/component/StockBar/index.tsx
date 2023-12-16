import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { io } from "socket.io-client";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { currentStock } from "recoil/selector";
import { IReadTimeStockPrice, IRealTimePriceRst } from "types/common";
import { addPlaceHolder, isClosedMarket, sleep } from "until";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {
  COLOR_BG_CONVERTER,
  COLOR_TEXT_CONVERTER,
  COLOR_TYPE,
} from "types/global";
import { closedPriceState } from "recoil/atom";

export default function TopStockBar() {
  const theme = useTheme();
  const stock = useRecoilValue(currentStock);
  const [isUpdating, setIsUpdating] = useState(false);
  const [realTimePrice, setRealTimePrice] = useState<IReadTimeStockPrice>();
  const setClosedPrice = useSetRecoilState(closedPriceState);

  useEffect(() => {
    const socket = io("wss://financial-data-gateway-dev.intltrip.com");
    socket.on("connect", () => {
      socket.emit("subscribe-stock-price", { stockId: stock.No });
    });

    socket.on("stock-price-minute", async (rst: IRealTimePriceRst) => {
      setIsUpdating(false);
      if (rst.success) {
        setRealTimePrice(rst.data);
        setClosedPrice(+(rst.data.prevClose || 0));
        await sleep(500);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [stock.No]);

  const quote = useMemo(() => {
    if (!realTimePrice) {
      return;
    }
    const isClosed = isClosedMarket(realTimePrice.date);
    const changePrice =
      parseFloat(realTimePrice?.close) - parseFloat(realTimePrice?.prevClose);
    const changeRate = (
      (changePrice / parseFloat(realTimePrice?.prevClose)) *
      100
    ).toFixed(2);

    return {
      changePrice,
      changeRate,
      color:
        COLOR_TEXT_CONVERTER[changePrice > 0 ? COLOR_TYPE.UP : COLOR_TYPE.DOWN],
      bgColor:
        COLOR_BG_CONVERTER[changePrice > 0 ? COLOR_TYPE.UP : COLOR_TYPE.DOWN],
      price: +realTimePrice?.close,
      isUp: changePrice > 0,
      closedText: isClosed ? "收盤" : "",
      updateText: isClosed ? "" : "更新",
      time: moment(realTimePrice.date).format("YYYY-MM-DD HH:mm"),
    };
  }, [realTimePrice]);

  return (
    <Stack
      flexDirection="row"
      sx={{
        alignItems: "center",
        [theme.breakpoints.up("md")]: {
          gap: "6px",
        },
        [theme.breakpoints.down("md")]: {
          flex: 1,
          gap: "0",
          justifyContent: "space-between",
        },
      }}
    >
      <Box
        sx={{
          fontWeight: 600,
          color: "#333",
          [theme.breakpoints.up("md")]: {
            fontSize: "28px",
          },
          [theme.breakpoints.down("md")]: {
            fontSize: "20px",
          },
        }}
      >
        {stock.Name}
        <Typography
          component="span"
          fontSize="16px"
          color="#333333"
          fontWeight={400}
          ml="4px"
        >
          {stock.No}
        </Typography>
      </Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center", lg: "center" }}
        gap={{ xs: "2px", md: "6px", ld: "6px" }}
      >
        <Stack direction="row" alignItems="center" columnGap="6px">
          <Typography
            component="div"
            color={quote?.color}
            fontWeight={600}
            fontSize={{ xs: "18px", md: "24px" }}
            lineHeight={1.2}
          >
            <Typography
              component="span"
              color="#BDBDBD"
              fontSize={{ xs: "14px", md: "16px" }}
              mr="4px"
            >
              NT$
            </Typography>
            {addPlaceHolder(quote?.price)}
          </Typography>
          <Chip
            icon={
              quote?.isUp ? (
                <ArrowDropUpIcon fontSize="small" />
              ) : (
                <ArrowDropDownIcon fontSize="small" />
              )
            }
            label={
              quote
                ? `${quote.changePrice.toFixed(2)} (${quote.changeRate}%)`
                : ""
            }
            sx={{
              px: 1,
              py: "4px",
              height: 26,
              bgcolor: isUpdating ? "#BDBDBD" : quote?.bgColor,
              color: isUpdating ? "#333" : quote?.color,
              "&>.MuiSvgIcon-root": {
                color: isUpdating
                  ? "#rgba(255, 255, 255,0.5)"
                  : quote?.color || "#D92D20",
              },
            }}
          />
        </Stack>
        <Typography
          component="span"
          sx={{ fontSize: "12px", color: "#BDBDBD", opacity: quote ? 1 : 0 }}
        >
          {` ${quote?.closedText} | ${quote?.time} ${quote?.updateText}`}
        </Typography>
      </Stack>
    </Stack>
  );
}
