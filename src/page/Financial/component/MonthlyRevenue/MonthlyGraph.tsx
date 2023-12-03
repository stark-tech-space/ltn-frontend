import { useCallback, useEffect, useMemo, useState } from "react";
import { Chart } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { Box, Button, Stack } from "@mui/material";
import { OPTIONS } from "./GraphConfig";
import { PERIOD_YEAR } from "types/common";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { fetchRevenue } from "api/financial";
import moment from "moment";

const genStartDate = (years: number) => {
  return moment().subtract(years, "years").startOf("year").format("YYYY-MM-DD");
};
export default function MonthlyGraph({
  getGraphData,
}: {
  getGraphData: (data: { date: string; revenue: number }[]) => void;
}) {
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [graphData, setGraphData] = useState<
    { date: string; revenue: number }[]
  >([]);

  const fetchData = useCallback(async () => {
    const rst = await fetchRevenue({
      data_id: stock.No,
      start_date: genStartDate(period),
      dataset: "TaiwanStockMonthRevenue",
    });

    if (rst?.status === 200) {
      setGraphData(
        rst.data.map((item) => ({ date: item.date, revenue: item.revenue }))
      );
      getGraphData(rst.data);
    }
  }, [stock.No, period, getGraphData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const graphDataSet = useMemo(() => {
    return {
      labels: graphData.map((item) => item.date),
      datasets: [
        {
          type: "line" as const,
          label: "月均價",
          borderColor: "#EB5757",
          borderWidth: 2,
          fill: false,
          data: new Array(graphData.length)
            .fill(0)
            .map((item) => +faker.finance.amount(300, 600)),
          yAxisID: "y1",
        },
        {
          type: "bar" as const,
          label: "每月營收",
          backgroundColor: "rgba(237, 88, 157, 0.15)",
          data: graphData.map((item) => item.revenue / 1000),
          borderColor: "rgba(237, 88, 157, 0.35)",
          borderWidth: 1,
          yAxisID: "y",
          fill: false,
        },
      ],
    };
  }, [graphData]);

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
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
      <Box height={510} bgcolor="#fff" pb={3}>
        <Chart type="bar" data={graphDataSet as any} options={OPTIONS as any} />
      </Box>
    </>
  );
}
