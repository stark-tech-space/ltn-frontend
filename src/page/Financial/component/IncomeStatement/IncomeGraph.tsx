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
import { fetchGrowthRates } from "api/common";

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

export const GRAPH_FIELDS = [
  {
    field: "Revenue",
    headerName: "營收",
  },
  {
    field: "grossProfit",
    headerName: "毛利",
  },
  {
    field: "operatingIncome",
    headerName: "營業利益",
  },
  {
    field: "preTaxIncome",
    headerName: "稅前淨利",
  },
  {
    field: "preTaxIncome",
    headerName: "稅前淨利",
  },
];

export default function IncomeGraph({
  getGraphData,
}: {
  getGraphData: (data: any) => void;
}) {
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
      console.log("rst.data", rst.data);
      const revenueData = rst.data.filter((item) => item.type === "Revenue");
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
        (item) =>
          item.type === "OperatingIncome" || item.type === "PreTaxIncome"
      );
      const preTaxIncome = rst.data.filter(
        (item) => item.type === "PreTaxIncome"
      );
      const equityAttributableToOwnersOfParent = rst.data.filter(
        (item) => item.type === "EquityAttributableToOwnersOfParent"
      );
      const incomeAfterTaxes = rst.data.filter(
        (item) => item.type === "IncomeFromContinuingOperations"
      );
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
              sellingAndMarketingExpenses.push(
                item2.sellingAndMarketingExpenses
              );
              generalAndAdministrativeExpenses.push(
                item2.generalAndAdministrativeExpenses
              );
              researchAndDevelopmentExpenses.push(
                item2.researchAndDevelopmentExpenses
              );
            }
          });
        });
      }

      getGraphData({
        date: date.map((item) => moment(item).format("YYYY-[Q]Q")),
        revenue: revenueData.map((item) => item.value),
        grossProfit: grossProfitData.map((item) => item.value),
        operatingExpenses: operatingExpenses.map((item) => item.value),
        costOfGoodsSold: costOfGoodsSold.map((item) => item.value),
        operatingIncome: operatingIncome.map((item) => item.value),
        preTaxIncome: preTaxIncome.map((item) => item.value),
        afterTaxIncome: incomeAfterTaxes.map((item) => item.value),
        equityAttributableToOwnersOfParent:
          equityAttributableToOwnersOfParent.map((item) => item.value),
        sellingAndMarketingExpenses,
        generalAndAdministrativeExpenses,
        researchAndDevelopmentExpenses,
      });
    }
  }, [stock.No, period, getGraphData]);

  const fetchExpenseData = async () => {
    const limit = getDataLimit(PERIOD.QUARTER, period);
    const rst = await fetchIncomeStatement(stock.Symbol, PERIOD.QUARTER, limit);
    console.log("rst", rst);

    return rst;
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const graphDataSet = useMemo(() => {
    return {
      labels: graphData?.revenue.map((item) =>
        moment(item.date, "YYYY-MM-DD").startOf("quarter").format("YYYY-MM-DD")
      ),
      datasets: [
        {
          type: "line" as const,
          label: "營收",
          backgroundColor: "#e8af00",
          borderColor: "#e8af00",
          data: graphData?.revenue.map((item) => item.value / 1000),
          borderWidth: 2,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "毛利",
          backgroundColor: "#0586f4",
          borderColor: "#0586f4",
          data: graphData?.grossProfit.map((item) => item.value / 1000),
          borderWidth: 2,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "營業利益",
          backgroundColor: "#dc3911",
          borderColor: "#dc3911",
          data: graphData?.operatingIncome.map((item) => item.value / 1000),
          borderWidth: 2,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "稅前淨利",
          backgroundColor: "#0f9617",
          data: graphData?.preTaxIncome.map((item) => item.value / 1000),
          borderColor: "#0f9617",
          borderWidth: 2,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "稅後淨利",
          backgroundColor: "#b98c01",
          data: graphData?.incomeAfterTaxes.map((item) => item.value / 1000),
          borderColor: "#b98c01",
          borderWidth: 2,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "母公司業主綜合損益",
          backgroundColor: "#026bc3",
          data: graphData?.equityAttributableToOwnersOfParent.map(
            (item) => item.value / 1000
          ),
          borderColor: "#026bc3",
          borderWidth: 2,
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
