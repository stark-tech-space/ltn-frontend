import { Stack, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { PERIOD } from "types/common";
import { fetchCompanyRatios, fetchGrowthRates } from "api/common";
import {
  COLOR_BG_CONVERTER,
  COLOR_TEXT_CONVERTER,
  COLOR_TYPE,
} from "types/global";
import { IEaringPerShare } from "types/financial";
import { fetchQuote } from "api/news";
import { fetchDividendHistorical } from "api/value";
import { IDividendPerShareHistorical } from "types/value";
import moment from "moment";
import fmpApi from "api/http/fmpApi";
import ltnApi from "api/http/ltnApi";
import { closedPriceState } from "recoil/atom";
import BigNumber from "bignumber.js";

interface IPrice {
  time: string;
  price: number;
}

function getAnnualNetIncomePerShareData(
  rst: IEaringPerShare[],
  field: keyof IEaringPerShare
) {
  const newNetIncomePerShare = rst.reduce(
    (sum, currentItem) => sum + (currentItem[field] as number),
    0
  );
  return newNetIncomePerShare;
}

const BlockChild = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: COLOR_TYPE;
}) => {
  return (
    <Box
      flex={1}
      p="12px"
      minWidth={100}
      height={64}
      bgcolor="#f8f8f8"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      borderRadius="8px"
    >
      <Typography
        component="div"
        sx={{
          fontSize: "14px",
          color: "rgb(67, 67, 67)",
          fontWeight: 400,
          lineHeight: "20px",
        }}
      >
        {title}
      </Typography>
      <Typography
        component="div"
        sx={{
          fontSize: "24px",
          fontWeight: 600,
          lineHeight: "32px",
          color: "rgb(35, 35, 35)",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

export default function BlockQuota() {
  const [blockList, setBlockList] = useState<
    {
      title: string;
      value: string;
      field: string;
      color: COLOR_TYPE;
    }[]
  >([
    {
      title: "PE",
      field: "pe",
      value: "0",
      color: COLOR_TYPE.UP,
    },
    {
      title: "殖利率 (%)",
      value: "0",
      field: "dividendYield",
      color: COLOR_TYPE.UP,
    },
    {
      title: "股價淨值比",
      value: "0",
      field: "pbRatio",
      color: COLOR_TYPE.UP,
    },
    {
      title: "營收YOY",
      value: "0",
      field: "YOY",
      color: COLOR_TYPE.DOWN,
    },
    {
      title: "近4季EPS",
      value: "0",
      field: "netIncomePerShare",
      color: COLOR_TYPE.UP,
    },
    {
      title: "近4季ROE% ",
      value: "0",
      field: "roe",
      color: COLOR_TYPE.UP,
    },
  ]);

  const stock = useRecoilValue(currentStock);
  const closedPrice = useRecoilValue(closedPriceState);

  useEffect(() => {
    (async () => {
      const [rst1, rst2, rst3] = await Promise.all([
        fetchCompanyRatios(stock.Symbol, PERIOD.QUARTER, 4),
        fetchGrowthRates(stock.Symbol, PERIOD.QUARTER, 1),
        fetchQuote(stock.Symbol),
      ]);

      setBlockList((old) => {
        const values = [...old];
        if (rst1 && rst1[0] && rst3) {
          values.forEach((item) => {
            let value = rst1[0]?.[item.field];
            if (item.field === "netIncomePerShare") {
              value = getAnnualNetIncomePerShareData(
                rst1 as unknown as IEaringPerShare[],
                "netIncomePerShare"
              );
              item.value = value ? value.toFixed(3) : "0";
            } else if (item.field === "roe") {
              value = getAnnualNetIncomePerShareData(
                rst1 as unknown as IEaringPerShare[],
                "roe"
              );
              item.value = value ? (value * 100).toFixed(3) : "0";
            } else {
              if (item.field !== "dividendYield") {
                item.value = value ? value.toFixed(3) : "0";
              }
            }
            item.color = value
              ? value > 0
                ? COLOR_TYPE.UP
                : COLOR_TYPE.DOWN
              : COLOR_TYPE.DOWN;
          });
        }

        if (rst2 && rst2[0]) {
          const index = values.findIndex((item) => item.field === "YOY");
          values[index].value = rst2[0]?.growthRevenue.toFixed(3);
          values[index].title = `${rst2[0]?.period}營收YOY`;
          values[index].color =
            parseFloat(values[index].value) > 0
              ? COLOR_TYPE.UP
              : COLOR_TYPE.DOWN;
        }

        if (rst3 && rst3[0]) {
          values[0].value = rst3[0]?.pe.toFixed(3);
        }

        return values;
      });
    })();
  }, [stock.Symbol, setBlockList]);

  useEffect(() => {
    (async () => {
      const rst = await fmpApi.get<{
        historical: IDividendPerShareHistorical[];
      }>(
        `/historical-price-full/stock_dividend/${stock.Symbol}?period=quarter&limit=4`
      );
      if (rst.data) {
        const total = rst.data.historical.reduce((sum, item) => {
          return sum + (item.dividend || 0);
        }, 0);
        setBlockList((old) => {
          return old.map((item) => {
            if (item.field === "dividendYield") {
              return {
                ...item,
                value: closedPrice
                  ? (
                      +new BigNumber(total)
                        .dividedBy(new BigNumber(closedPrice))
                        .toFormat(2) * 100
                    ).toFixed(2)
                  : "0",
              };
            }
            return item;
          });
        });
      }
    })();
  }, [stock.Symbol, closedPrice]);

  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      p={{ xs: 2, md: 3, lg: 3 }}
      borderRadius={{ xs: 0, md: "8px", lg: "8px" }}
      bgcolor="#fff"
      columnGap={1}
      sx={{
        flexWrap: "nowrap",
        scrollBehavior: "smooth",
        overflow: "auto hidden",
      }}
    >
      {blockList.map((item) => (
        <BlockChild key={item.field} {...item} />
      ))}
    </Stack>
  );
}
