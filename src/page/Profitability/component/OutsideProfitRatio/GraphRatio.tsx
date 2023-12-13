import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { IFinMindDataItem, PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { labelDataSets, graphConfig } from "./GrapConfig";
import type { Chart } from "chart.js";
import { findMindDataToFmpData, getBeforeYears } from "until";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { IOutsideProfitRatio, IPreTaxIncome } from "types/profitability";
import PeriodController from "component/PeriodController";
import { fetchFindMindAPI } from "api/common";
import moment from "moment";

export const GRAPH_FIELDS = [
  {
    field: "TotalNonoperatingIncomeAndExpense",
    headerName: "業外收支佔稅前淨利比",
  },
];

export default function GraphSingleRatio({
  getGraphData,
}: {
  getGraphData: (data: any[][]) => void;
}) {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  const updateGraph = (data: IOutsideProfitRatio[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof IOutsideProfitRatio] * 100
          );
        }
      });
      chartRef.current.update();
    }
  };

  const genGraphTableData = (data: IOutsideProfitRatio[]) => {
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
            ? moment(item.date).format("YYYY-[Q]Q")
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
            +item[field as keyof IOutsideProfitRatio] * 100
          ).toFixed(2);
        } else {
          dataSources[moment(item.date).format("YYYY-[Q]Q")] = (
            +item[field as keyof IOutsideProfitRatio] * 100
          ).toFixed(2);
        }
      });
      rowData.push(dataSources);
    });
    return [columnHeaders, rowData];
  };

  const fetchGraphData = useCallback(async () => {
    const rst = await fetchFindMindAPI<IFinMindDataItem[]>({
      data_id: stock.No,
      dataset: "TaiwanStockFinancialStatements",
      start_date: getBeforeYears(period),
    });
    if (rst) {
      let allValues = rst.filter(
        (item) => item.type === "TotalNonoperatingIncomeAndExpense"
      );
      let preTaxIncome = rst.filter((item) => item.type === "PreTaxIncome");
      const newAllValues = allValues.map(
        findMindDataToFmpData
      ) as unknown as IOutsideProfitRatio[];
      const newPreTaxIncome = preTaxIncome.map(
        findMindDataToFmpData
      ) as unknown as IPreTaxIncome[];
      newAllValues.forEach((item, index) => {
        item.date = moment(item.date, "YYYY-MM-DD")
          .startOf("quarter")
          .format("YYYY-MM-DD");
        item.TotalNonoperatingIncomeAndExpense =
          +item.TotalNonoperatingIncomeAndExpense /
          +newPreTaxIncome[index].PreTaxIncome;
      });
      updateGraph(newAllValues);
      getGraphData(genGraphTableData(newAllValues));
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
        showReportType={false}
      />
      <Box height={510} bgcolor="#fff" pb={3}>
        <ReactChart
          type="line"
          data={labelDataSets}
          options={graphConfig as any}
          ref={chartRef}
        />
      </Box>
    </>
  );
}
