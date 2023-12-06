import { Stack, Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { currentStock } from 'recoil/selector';
import { PERIOD } from 'types/common';
import { fetchCompanyRatios, fetchGrowthRates } from 'api/common';
import { COLOR_BG_CONVERTER, COLOR_TEXT_CONVERTER, COLOR_TYPE } from 'types/global';

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
          fontSize: '14px',
          color: '#475467',
          fontWeight: 400,
          lineHeight: '20px',
        }}
      >
        {title}
      </Typography>
      <Typography
        component="div"
        sx={{
          fontSize: '24px',
          fontWeight: 600,
          lineHeight: '32px',
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
      title: '本益比 (倍)',
      field: 'peRatio',
      value: '0',
      color: COLOR_TYPE.UP,
    },
    {
      title: '殖利率 (%)',
      value: '0',
      field: 'dividendYield',
      color: COLOR_TYPE.UP,
    },
    {
      title: '股價淨值比',
      value: '0',
      field: 'pbRatio',
      color: COLOR_TYPE.UP,
    },
    {
      title: '營收YOY',
      value: '-13.36',
      field: 'YOY',
      color: COLOR_TYPE.DOWN,
    },
    {
      title: '近4季EPS',
      value: '0',
      field: 'netIncomePerShare',
      color: COLOR_TYPE.UP,
    },
    {
      title: '近4季ROE% ',
      value: '0',
      field: 'roe',
      color: COLOR_TYPE.UP,
    },
  ]);

  const stock = useRecoilValue(currentStock);

  useEffect(() => {
    (async () => {
      const [rst1, rst2] = await Promise.all([
        fetchCompanyRatios(stock.Symbol, PERIOD.QUARTER, 1),
        fetchGrowthRates(stock.Symbol, PERIOD.ANNUAL, 1),
      ]);

      setBlockList((old) => {
        const values = [...old];
        if (rst1 && rst1[0]) {
          values.forEach((item) => {
            const value = rst1[0]?.[item.field];
            item.value = value ? value.toFixed(3) : '0';
            item.color = value ? (value > 0 ? COLOR_TYPE.UP : COLOR_TYPE.DOWN) : COLOR_TYPE.DOWN;
          });
        }
        if (rst2 && rst2[0]) {
          const index = values.findIndex((item) => item.field === 'YOY');
          values[index].value = rst2[0]?.growthRevenue.toFixed(3);
          values[index].color =
            parseFloat(values[index].value) > 0 ? COLOR_TYPE.UP : COLOR_TYPE.DOWN;
        }
        return values;
      });
    })();
  }, [stock.Symbol, setBlockList]);

  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      p={3}
      borderRadius="8px"
      bgcolor="#fff"
      columnGap={1}
    >
      {blockList.map((item) => (
        <BlockChild key={item.field} {...item} />
      ))}
    </Stack>
  );
}
