import { Chip, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
// import { poll } from "poll";
import dayjs from "dayjs";

import { IRealTimeQuote } from "types/common";
import { fetchQuote } from "api/common";
import { addPlaceHolder, sleep, toFixed } from "until";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";

export default function TopStockBar() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [quote, setQuote] = React.useState<IRealTimeQuote>(
    {} as IRealTimeQuote
  );
  const stock = useRecoilValue(currentStock);
  let start = true;
  useEffect(() => {
    // if (!start) {
    //   return;
    // }
    // let stop = false;
    // poll(
    //   async () => {
    //     setIsUpdating(true);
    //     const rst = await fetchQuote(STOCK_SYMBOL).finally(async () => {
    //       await sleep(1000);
    //       setIsUpdating(false);
    //     });
    //     if (rst && rst[0]) {
    //       setQuote(rst[0]);
    //     }
    //   },
    //   10000,
    //   () => stop
    // );
    // return () => {
    //   stop = true;
    // };
    // (async () => {
    //   setIsUpdating(true);
    //   const rst = await fetchQuote(stock.Symbol).finally(async () => {
    //     await sleep(1000);
    //     setIsUpdating(false);
    //   });
    //   if (rst && rst[0]) {
    //     setQuote(rst[0]);
    //   }
    // })();
  }, [stock.Symbol]);

  return (
    <Stack flexDirection="row" columnGap="6px" alignItems="center">
      <Typography
        component="span"
        fontSize="26px"
        color="#333333"
        fontWeight={600}
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
      </Typography>

      <Typography
        component="div"
        sx={{
          fontSize: "24px",
          color: isUpdating ? "#BDBDBD" : "#EB5757",
          fontWeight: 600,
          lineHeight: "26px",
        }}
      >
        <Typography component="span" color="#BDBDBD" fontSize="16px" mr="4px">
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
            ? `${toFixed(quote?.change)} (${toFixed(quote.changesPercentage)}%)`
            : ""
        }
        sx={{
          px: 1,
          py: "4px",
          bgcolor: isUpdating ? "#BDBDBD" : "#EB57571A",
          color: isUpdating ? "#333" : "#EB5757",
          "&>.MuiSvgIcon-root": {
            color: isUpdating ? "#rgba(255, 255, 255,0.5)" : "#D92D20",
          },
        }}
      />
      <Typography component="span" sx={{ fontSize: "12px", color: "#BDBDBD" }}>
        {` 收盤 | ${dayjs(quote.timestamp * 1000).format(
          "YYYY/MM/DD HH:mm"
        )} 更新`}
      </Typography>
    </Stack>
  );
}
