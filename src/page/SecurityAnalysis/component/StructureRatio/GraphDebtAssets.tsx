import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { IDateField, PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig_02, labelDataSets_02 } from "./GrapConfig";
import type { Chart } from "chart.js";
import { getDataLimit, sortCallback } from "until";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { IAssetsSheetStatement, ISecurityRatio } from "types/security";
import PeriodController from "component/PeriodController";
import { fetchSecurityBalanceSheetStatement } from "api/security";

interface IGraphField extends IDateField {
  longDebtRatio: number;
  date: string;
}

export const GRAPH_FIELDS = [
  {
    field: "longDebtRatio",
    headerName: "長期資金佔固定資產比率",
  },
];

export default function GraphDebtAssets({
  getGraphData,
}: {
  getGraphData: (data: any[][]) => void;
}) {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  const updateGraph = (data: IGraphField[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof IGraphField]
          );
        }
      });
      chartRef.current.update();
    }
  };

  const genGraphTableData = (data: IGraphField[]) => {
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
          dataSources[item.calendarYear] = (+item[
            field as keyof IGraphField
          ]).toFixed(2);
        } else {
          dataSources[`${item.calendarYear}-${item.period}`] = (+item[
            field as keyof IGraphField
          ]).toFixed(2);
        }
      });
      rowData.push(dataSources);
    });
    return [columnHeaders, rowData];
  };

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(reportType, period);
    const rst = await fetchSecurityBalanceSheetStatement<
      IAssetsSheetStatement[]
    >(stock.Symbol, reportType, limit);

    const data = rst?.sort(sortCallback).map((item) => ({
      date: item.date,
      calendarYear: item.calendarYear,
      period: item.period,
      longDebtRatio:
        +(
          (item.longTermDebt + item.totalStockholdersEquity) /
          item.propertyPlantEquipmentNet
        ) * 100,
    }));

    if (data) {
      updateGraph(data);
      getGraphData(genGraphTableData(data));
    }
  }, [stock, period, reportType]);

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
          data={labelDataSets_02}
          options={graphConfig_02 as any}
          ref={chartRef}
        />
      </Box>
    </>
  );
}
