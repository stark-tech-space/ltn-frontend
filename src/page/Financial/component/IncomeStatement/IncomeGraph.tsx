import { useCallback, useEffect, useMemo, useState } from "react";
import { Chart } from "react-chartjs-2";
import { Box } from "@mui/material";
import { OPTIONS } from "./GraphConfig";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { fetchIncomeStatement, fetchRevenue } from "api/financial";
import moment from "moment";
import { IIncome } from "types/financial";
import PeriodController from "component/PeriodController";
import { getDataLimit } from "until";
import { PERIOD } from "types/common";

interface IGraphData {
  date: string;
  value: number;
}

interface IIncomeGraph {
  revenue: IGraphData[];
  grossProfit: IGraphData[];
  operatingExpenses: IGraphData[];
  costOfGoodsSold: IGraphData[];
  operatingIncome: IGraphData[];
  preTaxIncome: IGraphData[];
  incomeAfterTaxes: IGraphData[];
  equityAttributableToOwnersOfParent: IGraphData[];
}

const genStartDate = (years: number) => {
  return moment().subtract(years, "years").startOf("year").format("YYYY-MM-DD");
};

export default function IncomeGraph({ getGraphData }: { getGraphData: (data: any) => void }) {
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [graphData, setGraphData] = useState<IIncomeGraph>();

  const fetchData = useCallback(async () => {
    const rst = await fetchRevenue<IIncome>({
      data_id: stock.No,
      start_date: genStartDate(period - 1),
      dataset: "TaiwanStockFinancialStatements",
    });

    if (rst?.status === 200) {
      const revenueData = rst.data.filter((item) => item.type === "Revenue");
      const grossProfitData = rst.data.filter((item) => item.type === "GrossProfit");
      const operatingExpenses = rst.data.filter((item) => item.type === "OperatingExpenses");
      const costOfGoodsSold = rst.data.filter((item) => item.type === "CostOfGoodsSold");
      const operatingIncome = rst.data.filter((item) => item.type === "OperatingIncome");
      const preTaxIncome = rst.data.filter((item) => item.type === "PreTaxIncome");
      const equityAttributableToOwnersOfParent = rst.data.filter(
        (item) => item.type === "EquityAttributableToOwnersOfParent",
      );
      const incomeAfterTaxes = rst.data.filter((item) => item.type === "IncomeAfterTaxes");
      const date = revenueData.map((item) => item.date);
      let sellingAndMarketingExpenses: any[] = [];
      let generalAndAdministrativeExpenses: any[] = [];
      let researchAndDevelopmentExpenses: any[] = [];

      setGraphData({
        revenue: revenueData,
        grossProfit: grossProfitData,
        operatingExpenses,
        costOfGoodsSold,
        operatingIncome,
        preTaxIncome,
        incomeAfterTaxes,
        equityAttributableToOwnersOfParent,
      });

      const data = await fetchExpenseData();
      if (data) {
        date.forEach((item, index) => {
          data.forEach((item2, index2) => {
            if (item2.date === item) {
              sellingAndMarketingExpenses.push(item2.sellingAndMarketingExpenses);
              generalAndAdministrativeExpenses.push(item2.generalAndAdministrativeExpenses);
              researchAndDevelopmentExpenses.push(item2.researchAndDevelopmentExpenses);
            }
          });
        });
      }

      console.log("sellingAndMarketingExpenses", sellingAndMarketingExpenses);
      console.log("generalAndAdministrativeExpenses", generalAndAdministrativeExpenses);
      console.log("researchAndDevelopmentExpenses", researchAndDevelopmentExpenses);

      getGraphData({
        date,
        revenue: revenueData.map((item) => item.value),
        grossProfit: grossProfitData.map((item) => item.value),
        operatingExpenses: operatingExpenses.map((item) => item.value),
        costOfGoodsSold: costOfGoodsSold.map((item) => item.value),
        operatingIncome: operatingIncome.map((item) => item.value),
        preTaxIncome: preTaxIncome.map((item) => item.value),
        afterTaxIncome: incomeAfterTaxes.map((item) => item.value),
        equityAttributableToOwnersOfParent: equityAttributableToOwnersOfParent.map(
          (item) => item.value,
        ),
        sellingAndMarketingExpenses,
        generalAndAdministrativeExpenses,
        researchAndDevelopmentExpenses,
      });
    }
  }, [stock.No, period, getGraphData]);

  const fetchExpenseData = async () => {
    const limit = getDataLimit(PERIOD.QUARTER, period);
    const rst = await fetchIncomeStatement(stock.Symbol, PERIOD.QUARTER, limit);
    return rst;
  };

  useEffect(() => {
    fetchData();
    fetchExpenseData();
  }, [fetchData]);

  const graphDataSet = useMemo(() => {
    return {
      labels: graphData?.revenue.map((item) => item.date),
      datasets: [
        {
          type: "line" as const,
          label: "營收",
          backgroundColor: "rgb(232,175,0)",
          data: graphData?.revenue.map((item) => item.value / 1000),
          borderColor: "rgb(232,175,0)",
          borderWidth: 1,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "毛利",
          backgroundColor: "rgba(237, 88, 157, 0.15)",
          data: graphData?.grossProfit.map((item) => item.value / 1000),
          borderColor: "rgba(237, 88, 157, 0.35)",
          borderWidth: 1,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "營業利益",
          backgroundColor: "rgb(0, 99, 232)",
          data: graphData?.operatingIncome.map((item) => item.value / 1000),
          borderColor: "rgb(0, 99, 232)",
          borderWidth: 1,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "稅前淨利",
          backgroundColor: "rgb(100, 99, 132)",
          data: graphData?.preTaxIncome.map((item) => item.value / 1000),
          borderColor: "rgb(100, 99, 132)",
          borderWidth: 1,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "稅後淨利",
          backgroundColor: "rgb(10, 99, 132)",
          data: graphData?.incomeAfterTaxes.map((item) => item.value / 1000),
          borderColor: "rgb(10, 99, 132)",
          borderWidth: 1,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "母公司主業利益",
          backgroundColor: "rgb(200, 99, 132)",
          data: graphData?.equityAttributableToOwnersOfParent.map((item) => item.value / 1000),
          borderColor: "rgb(200, 99, 132)",
          borderWidth: 1,
          yAxisID: "y",
          fill: false,
        },
      ],
    };
  }, [graphData]);

  return (
    <>
      <PeriodController onChangePeriod={setPeriod} showReportType={false} />
      <Box height={510} bgcolor="#fff" pb={3}>
        <Chart type="bar" data={graphDataSet as any} options={OPTIONS as any} />
      </Box>
    </>
  );
}
