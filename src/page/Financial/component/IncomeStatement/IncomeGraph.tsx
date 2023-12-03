import { useCallback, useEffect, useMemo, useState } from "react";
import { Chart } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { Box, Button, Stack } from "@mui/material";
import { OPTIONS } from "./GraphConfig";
import { PERIOD, PERIOD_YEAR } from "types/common";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { fetchRevenue } from "api/financial";
import moment from "moment";
import { IIncome } from "types/financial";

const genStartDate = (years: number) => {
  return moment().subtract(years, "years").startOf("year").format("YYYY-MM-DD");
};

export default function IncomeGraph({
  getGraphData,
}: {
  getGraphData: (data: any) => void;
}) {
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [incomeData, setIncomeData] = useState<
    { date: string; value: number }[]
  >([]);
  const [grossProfitData, setGrossProfitData] = useState<
    { date: string; value: number }[]
  >([]);
  const [operatingExpenses, setOperatingExpenses] = useState<
    { date: string; value: number }[]
  >([]);
  const [costOfGoodsSold, setCostOfGoodsSold] = useState<
    { date: string; value: number }[]
  >([]);
  const [operatingIncome, setOperatingIncome] = useState<
    { date: string; value: number }[]
  >([]);
  const [preTaxIncome, setPreTaxIncome] = useState<
    { date: string; value: number }[]
  >([]);
  const [
    equityAttributableToOwnersOfParent,
    setEquityAttributableToOwnersOfParent,
  ] = useState<
    {
      date: string;
      value: number;
    }[]
  >([]);

  const fetchData = useCallback(async () => {
    const rst = await fetchRevenue<IIncome>({
      data_id: stock.No,
      start_date: genStartDate(period - 1),
      dataset: "TaiwanStockFinancialStatements",
    });
    if (rst?.status === 200) {
      const revenseData = rst.data.filter((item) => item.type === "Revenue");
      const grossProfitData = rst.data.filter(
        (item) => item.type === "GrossProfit"
      );
      const operatingExpenses = rst.data.filter(
        (item) => item.type === "OperatingExpenses"
      );
      const costOfGoodsSold = rst.data.filter(
        (item) => item.type === "CostOfGoodsSold"
      );
      const operatingIncome = rst.data.filter(
        (item) => item.type === "OperatingIncome"
      );
      const preTaxIncome = rst.data.filter(
        (item) => item.type === "PreTaxIncome"
      );
      const equityAttributableToOwnersOfParent = rst.data.filter(
        (item) => item.type === "EquityAttributableToOwnersOfParent"
      );

      setIncomeData(
        revenseData.map((item) => ({ date: item.date, value: item.value }))
      );
      setGrossProfitData(
        grossProfitData.map((item) => ({ date: item.date, value: item.value }))
      );
      setOperatingExpenses(
        operatingExpenses.map((item) => ({
          date: item.date,
          value: item.value,
        }))
      );
      setCostOfGoodsSold(
        costOfGoodsSold.map((item) => ({ date: item.date, value: item.value }))
      );
      setOperatingIncome(
        operatingIncome.map((item) => ({ date: item.date, value: item.value }))
      );
      setPreTaxIncome(
        preTaxIncome.map((item) => ({ date: item.date, value: item.value }))
      );
      setEquityAttributableToOwnersOfParent(
        equityAttributableToOwnersOfParent.map((item) => ({
          date: item.date,
          value: item.value,
        }))
      );

      getGraphData({
        date: revenseData.map((item) => item.date),
        revenue: revenseData.map((item) => item.value),
        grossProfit: grossProfitData.map((item) => item.value),
        operatingExpenses: operatingExpenses.map((item) => item.value),
        costOfGoodsSold: costOfGoodsSold.map((item) => item.value),
        operatingIncome: operatingIncome.map((item) => item.value),
        preTaxIncome: preTaxIncome.map((item) => item.value),
        equityAttributableToOwnersOfParent:
          equityAttributableToOwnersOfParent.map((item) => item.value),
      });
    }
  }, [stock.No, period, getGraphData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const graphDataSet = useMemo(() => {
    return {
      labels: incomeData.map((item) => item.date),
      datasets: [
        {
          type: "line" as const,
          label: "營收",
          backgroundColor: "rgb(232,175,0)",
          data: incomeData.map((item) => item.value / 1000),
          borderColor: "rgb(232,175,0)",
          borderWidth: 1,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "毛利",
          backgroundColor: "rgba(237, 88, 157, 0.15)",
          data: grossProfitData.map((item) => item.value / 1000),
          borderColor: "rgba(237, 88, 157, 0.35)",
          borderWidth: 1,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "營業費用",
          backgroundColor: "rgb(0, 99, 132)",
          data: operatingExpenses.map((item) => item.value / 1000),
          borderColor: "rgb(0, 99, 132)",
          borderWidth: 1,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "營業成本",
          backgroundColor: "rgb(0, 199, 132)",
          data: costOfGoodsSold.map((item) => item.value / 1000),
          borderColor: "rgb(0, 199, 132)",
          borderWidth: 1,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "營業利益",
          backgroundColor: "rgb(0, 99, 232)",
          data: operatingIncome.map((item) => item.value / 1000),
          borderColor: "rgb(0, 99, 232)",
          borderWidth: 1,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "稅前淨利",
          backgroundColor: "rgb(100, 99, 132)",
          data: preTaxIncome.map((item) => item.value / 1000),
          borderColor: "rgb(100, 99, 132)",
          borderWidth: 1,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "母公司主業利益",
          backgroundColor: "rgb(200, 99, 132)",
          data: equityAttributableToOwnersOfParent.map(
            (item) => item.value / 1000
          ),
          borderColor: "rgb(200, 99, 132)",
          borderWidth: 1,
          yAxisID: "y",
          fill: false,
        },
      ],
    };
  }, [incomeData]);

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          mt: 3,
          mb: 3,
          px: 3,
          button: {
            mx: 1,
            bgcolor: "transparent",
            border: 0,
            cursor: "pointer",
          },
        }}
      >
        {PERIOD_YEAR.map((item) => (
          <Button
            key={item.value}
            sx={{
              color: item.value === period ? "primary" : "#333",
            }}
            onClick={() => setPeriod(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
      <Box height={510} bgcolor="#fff" pb={3} px={3}>
        <Chart type="bar" data={graphDataSet as any} options={OPTIONS as any} />
      </Box>
    </>
  );
}
