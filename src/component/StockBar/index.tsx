import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { IRealTimeQuote } from "types/common";
import { fetchQuote } from "api/common";
import { addPlaceHolder, sleep, toFixed } from "until";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { realTimeStockPriceState } from "recoil/atom";
import ltnApi from "api/http/ltnApi";
import moment from "moment";

export default function TopStockBar() {
  const theme = useTheme();
  const [isUpdating, setIsUpdating] = useState(false);
  const [quote, setQuote] = React.useState<IRealTimeQuote>(
    {} as IRealTimeQuote
  );
  const stock = useRecoilValue(currentStock);

  // const realTimeQuote = useRecoilValue(realTimeStockPriceState);

  // const priceInfo = useMemo(() => {
  //   if (realTimeQuote) {
  //     return realTimeQuote;
  //   }
  //   return quote;
  // }, [realTimeQuote, quote]);

  function getColor(value: number, nextValue: number) {
    if (value > nextValue) {
      return "#D92D20";
    } else {
      return "#27AE60";
    }
  }

  useEffect(() => {
    const pollFetch = async () => {
      if (!stock.Symbol) {
        return;
      }
      setIsUpdating(true);
      const rst = await fetchQuote(stock.Symbol).finally(async () => {
        await sleep(1000);
        setIsUpdating(false);
      });
      if (rst && rst[0]) {
        setQuote(rst[0]);
      }

      // if (!stock.No) {
      //   return;
      // }
      // const rst = await ltnApi.get(`/financial/stock-prices`, {
      //   params: {
      //     securityCode: stock.No,
      //     priceType: "minute",
      //     startDate: moment("2023-12-14 13:30:00").toISOString(),
      //   },
      // });
      // console.log(
      //   "rst:",
      //   moment(rst.data[0].time).format("YYYY-MM-DD HH:mm:ss")
      // );
    };

    pollFetch();
  }, [stock.No]);

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
            sx={{
              color: isUpdating
                ? "#BDBDBD"
                : getColor(quote.price, quote.previousClose),
              fontWeight: 600,
            }}
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
              quote.changesPercentage < 0 ? (
                <ArrowDropDownIcon fontSize="small" />
              ) : (
                <ArrowDropUpIcon fontSize="small" />
              )
            }
            label={
              quote
                ? `${toFixed(quote?.change)} (${toFixed(
                    quote.changesPercentage
                  )}%)`
                : ""
            }
            sx={{
              px: 1,
              py: "4px",
              height: 26,
              bgcolor: isUpdating ? "#BDBDBD" : "#EB57571A",
              color: isUpdating ? "#333" : "#EB5757",
              "&>.MuiSvgIcon-root": {
                color: isUpdating ? "#rgba(255, 255, 255,0.5)" : "#D92D20",
              },
            }}
          />
        </Stack>
        <Typography
          component="span"
          sx={{ fontSize: "12px", color: "#BDBDBD" }}
        >
          {` 收盤 | ${dayjs(quote.timestamp * 1000).format(
            "YYYY/MM/DD HH:mm"
          )} 更新`}
        </Typography>
      </Stack>
    </Stack>
  );
}
