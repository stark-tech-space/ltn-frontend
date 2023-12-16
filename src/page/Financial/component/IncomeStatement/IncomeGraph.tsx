import { useCallback, useEffect, useMemo, useState } from "react";
import { Chart } from "react-chartjs-2";
import { Box } from "@mui/material";
import { OPTIONS } from "./GraphConfig";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import {
  fetchDanYiGongSiAnLi,
  fetchIncomeStatement,
  fetchRevenue,
} from "api/financial";
import moment, { unitOfTime } from "moment";
import { IIncome } from "types/financial";
import PeriodController from "component/PeriodController";
import {
  caseDateToYYYYMMDD,
  formatNumberFromCompanyCase,
  genFullDateObject,
} from "until";

interface IGraphData {
  date: string;
  value: number;
}

const DEFAULT_PREV_DATA = {
  sellingAndMarketingExpenses: 0,
  generalAndAdministrativeExpenses: 0,
  researchAndDevelopmentExpenses: 0,
};

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

const getPeriod: (date: string) => string | undefined = (date: string) => {
  if (date.includes("Q1")) return "Q1";
  if (date.includes("Q2")) return "Q2";
  if (date.includes("Q3")) return "Q3";
  if (date.includes("Q4")) return "Q4";
};

const INCOME_STATEMENT_NAME = "綜合損益表";

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
      // console.log(data);
      if (data) {
        date.forEach((item, index) => {
          data.forEach((item2, index2) => {
            // console.log(item2.date, genFullDateObject(item).period);
            if (item2.date === genFullDateObject(item).period) {
              sellingAndMarketingExpenses.push(
                item2.sellingAndMarketingExpenses.value
              );
              generalAndAdministrativeExpenses.push(
                item2.generalAndAdministrativeExpenses.value
              );
              researchAndDevelopmentExpenses.push(
                item2.researchAndDevelopmentExpenses.value
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
    const startDataMoment = moment().subtract(period, "year");

    const res = await fetchDanYiGongSiAnLi({
      securityCode: stock.No,
      yearRange: `${startDataMoment.year()},${moment().year()}`,
      size: Math.abs(startDataMoment.diff(moment(), "quarter")) - 1,
    });

    if (res) {
      let prevData: { [key: string]: typeof DEFAULT_PREV_DATA } = {
        Q1: { ...DEFAULT_PREV_DATA },
        Q2: { ...DEFAULT_PREV_DATA },
        Q3: { ...DEFAULT_PREV_DATA },
      };

      const expenseData = [...(res || [])?.list].reverse().map((item) => {
        const incomeStatementTable = item.tables.find(
          (item) => item.name === INCOME_STATEMENT_NAME
        );
        const date = item.id.slice(5);
        const currentQuarter = item.quarter;

        if (incomeStatementTable) {
          let currentData: any = {};

          const defaultData = incomeStatementTable.data
            .map(({ date, ...data }) => ({
              ...data,
              start: caseDateToYYYYMMDD(date).start,
              value: formatNumberFromCompanyCase(data.value) * 1000,
              date,
            }))
            .sort((a, b) => (a.start > b.start ? -1 : 1));

          defaultData.forEach((item) => {
            if (
              item.code === "6100" && // 銷售費用
              !currentData.sellingAndMarketingExpenses
            ) {
              currentData.sellingAndMarketingExpenses = item;
              if (currentQuarter !== "Q4") {
                prevData[currentQuarter].sellingAndMarketingExpenses =
                  item.value;
              }
            }
            if (
              item.code === "6200" && // 管理費用
              !currentData.generalAndAdministrativeExpenses
            ) {
              currentData.generalAndAdministrativeExpenses = item;
              if (currentQuarter !== "Q4") {
                prevData[currentQuarter].generalAndAdministrativeExpenses =
                  item.value;
              }
            }
            if (
              item.code === "6300" && // 研發費用
              !currentData.researchAndDevelopmentExpenses
            ) {
              currentData.researchAndDevelopmentExpenses = item;
              if (currentQuarter !== "Q4") {
                prevData[currentQuarter].researchAndDevelopmentExpenses =
                  item.value;
              }
            }
          });

          if (date === "2022-Q4") {
            console.log(date, prevData);
          }
          if (currentQuarter === "Q4") {
            const getPrevDataTotal = (
              prevData: { [key in string]: typeof DEFAULT_PREV_DATA },
              key: keyof typeof DEFAULT_PREV_DATA
            ) => {
              const Q1Data = prevData?.["Q1"]?.[key] || 0;
              const Q2Data = prevData?.["Q2"]?.[key] || 0;
              const Q3Data = prevData?.["Q3"]?.[key] || 0;
              // console.log(date, key, Q1Data, Q2Data, Q3Data);
              return Q1Data + Q2Data + Q3Data;
            };

            const q4Value = {
              sellingAndMarketingExpenses: {
                ...currentData["sellingAndMarketingExpenses"],
                value:
                  currentData?.["sellingAndMarketingExpenses"]?.value -
                  getPrevDataTotal(prevData, "sellingAndMarketingExpenses"),
              },
              generalAndAdministrativeExpenses: {
                ...currentData["generalAndAdministrativeExpenses"],
                value:
                  currentData?.["generalAndAdministrativeExpenses"]?.value -
                  getPrevDataTotal(
                    prevData,
                    "generalAndAdministrativeExpenses"
                  ),
              },
              researchAndDevelopmentExpenses: {
                ...currentData["researchAndDevelopmentExpenses"],
                value:
                  currentData?.["researchAndDevelopmentExpenses"]?.value -
                  getPrevDataTotal(prevData, "researchAndDevelopmentExpenses"),
              },
            };

            currentData = {
              ...currentData,
              ...q4Value,
            };

            prevData = {
              Q1: { ...DEFAULT_PREV_DATA },
              Q2: { ...DEFAULT_PREV_DATA },
              Q3: { ...DEFAULT_PREV_DATA },
            };
          }
          return { ...currentData, date };
        }
        return null;
      });

      return [...expenseData].reverse().filter((item) => item?.date);
    }
    // const rst = await fetchIncomeStatement(stock.Symbol, PERIOD.QUARTER, limit);
    // return rst;
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
