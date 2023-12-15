import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig_01 } from "./GrapConfig";

import { getDataLimit } from "until";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { IProfitRatio } from "types/profitability";
import PeriodController from "component/PeriodController";
import moment from "moment";
import { fetchIncomeStatement, fetchRevenue } from "api/financial";
import { IIncome } from "types/financial";
import UnAvailable from "component/UnAvailable";

interface IGraphData {
  date: string;
  value: number;
}

interface IRatioGraph {
  date: string[];
  operatingExpensesRatio: IGraphData[];
  sellingAndMarketingExpensesRatio: IGraphData[];
  generalAndAdministrativeExpensesRatio: IGraphData[];
  researchAndDevelopmentExpensesRatio: IGraphData[];
}

const genStartDate = (years: number) => {
  return moment().subtract(years, "years").format("YYYY-MM-DD");
};

export const GRAPH_FIELDS = [
  {
    field: "operatingExpensesRatio",
    headerName: "營業費用率",
  },
  {
    field: "sellingAndMarketingExpensesRatio",
    headerName: "銷售費用率",
  },
  {
    field: "generalAndAdministrativeExpensesRatio",
    headerName: "管理費用率",
  },
  {
    field: "researchAndDevelopmentExpensesRatio",
    headerName: "研發費用率",
  },
];

export default function GraphRatio({
  getGraphData,
}: {
  getGraphData: (data: any[][]) => void;
}) {
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);
  const [isUnAvailable, setIsUnAvailable] = useState<boolean>(false);

  const genGraphTableData = (data: any[]) => {
    if (data.length === 0) {
      return [[], []];
    }
    const rowData: any[] = [];
    const columnHeaders: any[] = [
      {
        field: "title",
        headerName: reportType === PERIOD.QUARTER ? "年度/季度" : "年度",
        pinned: "left",
      },
    ];

    data?.forEach((item) => {
      columnHeaders.push({
        field:
          reportType === PERIOD.QUARTER
            ? `${item.calendarYear}-${item.period}`
            : item.calendarYear,
      });
    });

    GRAPH_FIELDS.forEach(({ field, headerName }) => {
      const dataSources: { [key: string]: any } = {
        title: headerName,
      };
      data?.forEach((item) => {
        if (reportType === PERIOD.ANNUAL) {
          dataSources[item.calendarYear] = (
            +item[field as keyof IProfitRatio] * 100
          ).toFixed(2);
        } else {
          dataSources[`${item.calendarYear}-${item.period}`] = (
            +item[field as keyof IProfitRatio] * 100
          ).toFixed(2);
        }
      });
      rowData.push(dataSources);
    });
    return [columnHeaders, rowData];
  };

  const [graphData, setGraphData] = useState<IRatioGraph>();

  const fetchExpenseData = async () => {
    const limit = getDataLimit(reportType, period);
    const rst = await fetchIncomeStatement(stock.Symbol, reportType, limit);
    return rst;
  };

  const fetchData = useCallback(async () => {
    const rst = await fetchRevenue<IIncome>({
      data_id: stock.No,
      start_date: genStartDate(period),
      dataset: "TaiwanStockFinancialStatements",
    });

    if (rst?.status === 200) {
      const revenueData = rst.data.filter((item) => item.type === "Revenue");
      const date = revenueData.map((item) => item.date);
      const operatingExpenses = rst.data.filter(
        (item) => item.type === "OperatingExpenses"
      );
      let sellingAndMarketingExpenses: any[] = [];
      let generalAndAdministrativeExpenses: any[] = [];
      let researchAndDevelopmentExpenses: any[] = [];
      let calendarYears: any[] = [];
      let periods: any[] = [];

      const data = await fetchExpenseData();

      const isFinancialStock = (data || []).every(
        (item) => item?.grossProfitRatio === 1
      );
      setIsUnAvailable(isFinancialStock);

      if (data) {
        date.forEach((item) => {
          data.forEach((item2) => {
            if (item2.date === item) {
              calendarYears.push(item2.calendarYear);
              periods.push(item2.period);

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

      const ratioData = (date || []).map((item, index) => ({
        date: item,
        operatingExpensesRatio:
          operatingExpenses[index].value / revenueData[index].value,
        sellingAndMarketingExpensesRatio:
          sellingAndMarketingExpenses[index] / revenueData[index].value,
        generalAndAdministrativeExpensesRatio:
          generalAndAdministrativeExpenses[index] / revenueData[index].value,
        researchAndDevelopmentExpensesRatio:
          researchAndDevelopmentExpenses[index] / revenueData[index].value,
      }));

      const graphData = ratioData?.reduce(
        (prev, curr, index) => {
          if (!calendarYears[index]) return prev; // 接口數據有季度缺失時，先把這個季度忽略
          const date = curr.date;
          prev.date = prev.date.concat(date);
          prev.operatingExpensesRatio = prev.operatingExpensesRatio.concat({
            date,
            value: curr.operatingExpensesRatio,
          });
          prev.sellingAndMarketingExpensesRatio =
            prev.sellingAndMarketingExpensesRatio.concat({
              date,
              value: curr.sellingAndMarketingExpensesRatio,
            });
          prev.generalAndAdministrativeExpensesRatio =
            prev.generalAndAdministrativeExpensesRatio.concat({
              date,
              value: curr.generalAndAdministrativeExpensesRatio,
            });
          prev.researchAndDevelopmentExpensesRatio =
            prev.researchAndDevelopmentExpensesRatio.concat({
              date,
              value: curr.researchAndDevelopmentExpensesRatio,
            });

          return prev;
        },
        {
          date: [],
          operatingExpensesRatio: [],
          sellingAndMarketingExpensesRatio: [],
          generalAndAdministrativeExpensesRatio: [],
          researchAndDevelopmentExpensesRatio: [],
        } as IRatioGraph
      );
      setGraphData(graphData);

      const defaultGraphTableData = ratioData.map(
        (
          {
            operatingExpensesRatio,
            sellingAndMarketingExpensesRatio,
            generalAndAdministrativeExpensesRatio,
            researchAndDevelopmentExpensesRatio,
          },
          index
        ) => ({
          operatingExpensesRatio,
          sellingAndMarketingExpensesRatio,
          generalAndAdministrativeExpensesRatio,
          researchAndDevelopmentExpensesRatio,
          calendarYear: calendarYears[index],
          period: periods[index],
        })
      );
      getGraphData(
        genGraphTableData(
          defaultGraphTableData.filter((item) => item.calendarYear)
        )
      );
    }
  }, [stock.No, period, getGraphData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const graphDataSet = useMemo(() => {
    return {
      labels: graphData?.date.map((item) =>
        moment(item, "YYYY-MM-DD").startOf("quarter").format("YYYY-MM-DD")
      ),
      datasets: [
        {
          type: "line" as const,
          label: "營業費用率",
          backgroundColor: "#e8af00",
          borderColor: "#e8af00",
          data: graphData?.operatingExpensesRatio.map((item) =>
            Number((item.value * 100).toFixed(2))
          ),
          borderWidth: 2,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "銷售費用率",
          backgroundColor: "#0586f4",
          borderColor: "#0586f4",
          data: graphData?.sellingAndMarketingExpensesRatio.map((item) =>
            Number((item.value * 100).toFixed(2))
          ),
          borderWidth: 2,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "管理費用率",
          backgroundColor: "#dc3911",
          borderColor: "#dc3911",
          data: graphData?.generalAndAdministrativeExpensesRatio.map((item) =>
            Number((item.value * 100).toFixed(2))
          ),
          borderWidth: 2,
          yAxisID: "y",
          fill: false,
        },
        {
          type: "line" as const,
          label: "研發費用率",
          backgroundColor: "#0f9617",
          data: graphData?.researchAndDevelopmentExpensesRatio.map((item) =>
            Number((item.value * 100).toFixed(2))
          ),
          borderColor: "#0f9617",
          borderWidth: 2,
          yAxisID: "y",
          fill: false,
        },
      ],
    };
  }, [graphData]);

  if (isUnAvailable) {
    return <UnAvailable />;
  }

  return (
    <>
      <PeriodController
        onChangePeriod={setPeriod}
        onChangeReportType={setReportType}
      />
      <Box height={510} bgcolor="#fff" pb={3}>
        <ReactChart
          type="line"
          data={graphDataSet}
          options={graphConfig_01 as any}
        />
      </Box>
    </>
  );
}
