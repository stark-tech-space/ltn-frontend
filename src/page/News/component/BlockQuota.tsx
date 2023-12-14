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
      bgcolor={COLOR_BG_CONVERTER[color]}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      borderRadius="8px"
    >
      <Typography
        component="div"
        sx={{
          fontSize: "14px",
          color: "#475467",
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
          color: COLOR_TEXT_CONVERTER[color],
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
      title: "本益比 (倍)",
      field: "peRatio",
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
      value: "-13.36",
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

  useEffect(() => {
    // (async () => {
    //   const [rst1, rst2] = await Promise.all([
    //     fetchCompanyRatios(stock.Symbol, PERIOD.QUARTER, 4),
    //     fetchGrowthRates(stock.Symbol, PERIOD.QUARTER, 1),
    //   ]);
    //   setBlockList((old) => {
    //     const values = [...old];
    //     if (rst1 && rst1[0]) {
    //       values.forEach((item) => {
    //         let value = rst1[0]?.[item.field];
    //         if (item.field === "netIncomePerShare") {
    //           value = getAnnualNetIncomePerShareData(
    //             rst1 as unknown as IEaringPerShare[],
    //             "netIncomePerShare"
    //           );
    //           item.value = value ? value.toFixed(3) : "0";
    //         } else if (item.field === "roe") {
    //           value = getAnnualNetIncomePerShareData(
    //             rst1 as unknown as IEaringPerShare[],
    //             "roe"
    //           );
    //           item.value = value ? (value * 100).toFixed(3) : "0";
    //         } else {
    //           item.value = value ? value.toFixed(3) : "0";
    //         }
    //         item.color = value
    //           ? value > 0
    //             ? COLOR_TYPE.UP
    //             : COLOR_TYPE.DOWN
    //           : COLOR_TYPE.DOWN;
    //       });
    //     }
    //     if (rst2 && rst2[0]) {
    //       const index = values.findIndex((item) => item.field === "YOY");
    //       values[index].value = rst2[0]?.growthRevenue.toFixed(3);
    //       values[index].title = `${rst2[0]?.period}營收YOY`;
    //       values[index].color =
    //         parseFloat(values[index].value) > 0
    //           ? COLOR_TYPE.UP
    //           : COLOR_TYPE.DOWN;
    //     }
    //     return values;
    //   });
    // })();
  }, [stock.Symbol, setBlockList]);

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
