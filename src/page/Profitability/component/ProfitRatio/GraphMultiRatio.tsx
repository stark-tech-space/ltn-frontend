import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig_01, multiLabelDataSets } from "./GrapConfig";
import type { Chart } from "chart.js";
import { getDataLimit } from "until";
import { fetchProfitRatio } from "api/profitrato";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { IProfitRatio } from "types/profitability";
import PeriodController from "component/PeriodController";
import moment from "moment";
import { fetchRevenue } from "api/financial";
import { IIncome, IncomeType } from "types/financial";

type OperatingProfitMarginCalcVar = {
  revenue: number;
  badDebts: number;
  operatingIncome: number;
  netChangeInProvisionsForInsuranceLiabilities: number;
  operatingExpenses: number;
};

const genStartDate = (years: number) => {
  return moment().subtract(years, "years").format("YYYY-MM-DD");
};

const DEFAULT_DATA = {
  revenue: 0,
  badDebts: 0,
  operatingIncome: 0,
  netChangeInProvisionsForInsuranceLiabilities: 0,
  operatingExpenses: 0,
};

const handleGetOperatingProfitMarginData = (
  res: IIncome,
  dateLabels: string[]
) => {
  const revenueData = res.data.filter((item) => item.type === "Revenue");
  const operatingIncome = res.data.filter(
    (item) => item.type === "OperatingIncome"
  );

  const dataMap: Map<string, OperatingProfitMarginCalcVar> = new Map();

  const handleUpdateMap = (
    item: {
      date: string;
      type: IncomeType;
      value: number;
    },
    key:
      | "badDebts"
      | "netChangeInProvisionsForInsuranceLiabilities"
      | "operatingExpenses"
      | "revenue"
      | "operatingIncome"
  ) => {
    const date = moment(item.date).format("YYYY-[Q]Q");
    if (dataMap.has(date)) {
      const prevData = dataMap.get(date) || DEFAULT_DATA;
      dataMap.set(date, { ...prevData, [key]: item.value });
    }
  };

  dateLabels.forEach((label) => {
    dataMap.set(label, DEFAULT_DATA);
  });
  revenueData.forEach((item) => handleUpdateMap(item, "revenue"));

  // 沒有operatingIncome值時使用其他數據計算營業利益率
  if (operatingIncome.length === 0) {
    const badDebts = res.data.filter((item) => item.type === "BadDebts");
    const netChangeInProvisionsForInsuranceLiabilities = res.data.filter(
      (item) => item.type === "NetChangeInProvisionsForInsuranceLiabilities"
    );
    const operatingExpenses = res.data.filter(
      (item) => item.type === "OperatingExpenses"
    );

    badDebts.forEach((item) => handleUpdateMap(item, "badDebts"));

    netChangeInProvisionsForInsuranceLiabilities.forEach((item) => {
      handleUpdateMap(item, "netChangeInProvisionsForInsuranceLiabilities");
    });

    operatingExpenses.forEach((item) => {
      handleUpdateMap(item, "operatingExpenses");
    });

    return Array.from(dataMap.values()).map((item) => {
      const {
        revenue,
        badDebts,
        netChangeInProvisionsForInsuranceLiabilities,
        operatingExpenses,
      } = item;
      return (
        (revenue -
          badDebts -
          netChangeInProvisionsForInsuranceLiabilities -
          operatingExpenses) /
          revenue || 0
      );
    });
  }

  operatingIncome.forEach((item) => {
    handleUpdateMap(item, "operatingIncome");
  });

  return Array.from(dataMap.values()).map(
    (item) => (item?.operatingIncome || 0) / (item?.revenue || 0) || 0 // 可能有接口資料數量不對齊導致最後一筆為空的可能性，故先以 0 處理，以預防出現 NAN
  );
};

export const GRAPH_FIELDS = [
  {
    field: "grossProfitMargin",
    headerName: "毛利率",
  },
  {
    field: "operatingProfitMargin",
    headerName: "營業利益率",
  },
  {
    field: "pretaxProfitMargin",
    headerName: "稅前淨利率",
  },
  {
    field: "netProfitMargin",
    headerName: "稅後淨利率",
  },
];

export default function GraphMultiRatio({
  getGraphData,
}: {
  getGraphData: (data: any[][]) => void;
}) {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);
  const [isFinancialStock, setIsFinancialStock] = useState(true);

  const currentMultiLabelDataSets = useMemo(() => {
    if (isFinancialStock) {
      return {
        ...multiLabelDataSets,
        datasets: multiLabelDataSets?.datasets?.slice(1),
      };
    }
    return multiLabelDataSets;
  }, [isFinancialStock, stock]);

  const updateGraph = (
    data: IProfitRatio[],
    isFinancialStock: boolean,
    operatingProfitMarginData: number[]
  ) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      const handleUpdateGraph = (
        newGraph: {
          field: string;
          headerName: string;
        }[]
      ) => {
        if (
          chartRef?.current &&
          chartRef?.current.data.datasets.length === newGraph.length
        ) {
          newGraph.forEach(async ({ field }, index) => {
            if (chartRef.current) {
              if (field === "operatingProfitMargin") {
                chartRef.current.data.datasets[index].data =
                  operatingProfitMarginData.map((item) =>
                    Number((+item * 100).toFixed(2))
                  );
              } else {
                chartRef.current.data.datasets[index].data = data.map((item) =>
                  Number((+item[field as keyof IProfitRatio] * 100).toFixed(2))
                );
              }
            }
          });
          chartRef?.current?.update();
        } else {
          setTimeout(() => {
            handleUpdateGraph(newGraph);
          }, 300);
        }
      };

      handleUpdateGraph([...GRAPH_FIELDS].slice(isFinancialStock ? 1 : 0));
    }
  };

  const genGraphTableData = (
    data: IProfitRatio[],
    isFinancialStock: boolean,
    operatingProfitMarginData: number[]
  ) => {
    if (data?.length === 0) {
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

    [...GRAPH_FIELDS]
      .slice(isFinancialStock ? 1 : 0)
      .forEach(({ field, headerName }) => {
        const dataSources: { [key: string]: any } = {
          title: headerName,
        };
        data?.forEach((item, index) => {
          if (reportType === PERIOD.ANNUAL) {
            dataSources[item.calendarYear] = (
              +item[field as keyof IProfitRatio] * 100
            ).toFixed(2);
          } else {
            if (field === "operatingProfitMargin") {
              dataSources[`${item.calendarYear}-${item.period}`] = (
                operatingProfitMarginData[index] * 100
              ).toFixed(2);
            } else {
              dataSources[`${item.calendarYear}-${item.period}`] = (
                +item[field as keyof IProfitRatio] * 100
              ).toFixed(2);
            }
          }
        });
        rowData.push(dataSources);
      });
    return [columnHeaders, rowData];
  };

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(reportType, period);
    const rst = await fetchProfitRatio<IProfitRatio[]>(
      stock.Symbol,
      reportType,
      limit
    );
    if (rst) {
      const data = rst.map((item) => ({
        ...item,
        date: moment(item.date, "YYYY-MM-DD")
          .startOf("quarter")
          .format("YYYY-MM-DD"),
      }));
      const isFinancialStock = rst.every(
        (item) => item.grossProfitMargin === 1
      );
      setIsFinancialStock(isFinancialStock);
      const res = await fetchRevenue<IIncome>({
        data_id: stock.No,
        start_date: genStartDate(period),
        dataset: "TaiwanStockFinancialStatements",
      });
      if (res?.status === 200) {
        const dateLabels = rst.map((item) =>
          moment(item.date).format("YYYY-[Q]Q")
        );

        const operatingProfitMarginData = handleGetOperatingProfitMarginData(
          res,
          dateLabels
        );

        updateGraph(data, isFinancialStock, operatingProfitMarginData);
        getGraphData(
          genGraphTableData(data, isFinancialStock, operatingProfitMarginData)
        );
      }
    }
  }, [stock, period, reportType, getGraphData]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  return (
    <>
      <PeriodController
        onChangePeriod={setPeriod}
        onChangeReportType={setReportType}
      />
      <Box height={510} bgcolor="#fff" pb={3}>
        <ReactChart
          type="line"
          data={currentMultiLabelDataSets || multiLabelDataSets}
          options={graphConfig_01 as any}
          ref={chartRef}
        />
      </Box>
    </>
  );
}
