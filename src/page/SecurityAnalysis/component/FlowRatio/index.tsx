import { Stack, Box, Button, ButtonGroup } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TagCard from "../../../../component/tabCard";
import { Chart as ReactChart } from "react-chartjs-2";
import { AgGridReact } from "ag-grid-react";
import type { Chart } from "chart.js";
import { PERIOD } from "types/common";
import PeriodController from "component/PeriodController";
import { graphConfig, labelDataSets } from "./ GraphConfig";
import { genFullDateObject, getBeforeYears, getDataLimit } from "until";
import { fetchCashFlowStatement } from "api/cashflow";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { fetchFindMindAPI } from "api/common";

interface IGraphData {
  date: string;
  cashFlowtoDebtRate: number;
  cashFlowToLongDebtRate: number;
}
const GRAPH_FIELDS = [
  {
    field: "cashFlowToLongDebtRate",
    headerName: "營業現金流對負債比",
  },
  {
    field: "cashFlowtoDebtRate",
    headerName: "營業現金流對流動負債比",
  },
];

export default function FlowRate() {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);

  const [graphData, setGraphData] = useState<any>([]);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  const updateGraph = (data: IGraphData[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof IGraphData] * 100
          );
        }
      });
      chartRef.current.update();
    }
  };

  const genGraphTableData = (data: IGraphData[]) => {
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
      const dateFullObject = genFullDateObject(item.date);
      columnHeaders.push({
        field:
          reportType === PERIOD.QUARTER
            ? dateFullObject.period
            : dateFullObject.calendarYear,
      });
    });

    GRAPH_FIELDS.forEach(({ field, headerName }) => {
      const dataSources: { [key: string]: any } = {
        title: headerName,
        pinned: "left",
      };

      data?.forEach((item) => {
        const dateFullObject = genFullDateObject(item.date);
        if (reportType === PERIOD.ANNUAL) {
          dataSources[dateFullObject.calendarYear] = (
            +item[field as keyof IGraphData] * 100
          ).toFixed(2);
        } else {
          dataSources[dateFullObject.period] = (
            +item[field as keyof IGraphData] * 100
          ).toFixed(2);
        }
      });
      rowData.push(dataSources);
    });
    return [columnHeaders, rowData];
  };

  const fetchGraphData = useCallback(async () => {
    // 營業現金流 CashFlowsFromOperatingActivities
    // 流動負債 CurrentLiabilities
    // 負債 Liabilities

    /**
     *
     * 營業現金流對流動負債比 =  CashFlowsFromOperatingActivities /  CurrentLiabilities
     *
     * 營業現金流對負債比 = CashFlowsFromOperatingActivities / Liabilities
     */

    const rst = await Promise.all([
      fetchFindMindAPI<{ type: string; date: string; value: number }[]>({
        data_id: stock.No,
        dataset: "TaiwanStockCashFlowsStatement",
        start_date: getBeforeYears(period - 1),
      }),
      fetchFindMindAPI<{ type: string; date: string; value: number }[]>({
        data_id: stock.No,
        dataset: "TaiwanStockBalanceSheet",
        start_date: getBeforeYears(period - 1),
      }),
    ]);

    if (rst && rst.length === 2) {
      const cashFlow = rst[0]
        ?.filter((item) => item.type === "CashFlowsFromOperatingActivities")
        .map((item) => ({
          date: item.date,
          CashFlowsFromOperatingActivities: item.value,
        }));

      const flowDebt = rst[1]
        ?.filter((item) => item.type === "CurrentLiabilities")
        .map((item) => ({
          date: item.date,
          CurrentLiabilities: item.value,
        }));

      if (cashFlow && flowDebt) {
        const graphData = cashFlow?.map((item, index) => ({
          date: item.date,
          cashFlowToLongDebtRate: 0,
          cashFlowtoDebtRate:
            item.CashFlowsFromOperatingActivities /
            flowDebt?.[index]?.CurrentLiabilities,
        }));
        console.log("graphData:", graphData);
        updateGraph(graphData);
        setGraphData(graphData);
      }
    }

    // console.log("rst:", rst);
  }, [stock, period, reportType]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  const [columnHeaders, rowData] = useMemo(
    () => genGraphTableData(graphData),
    [graphData]
  );
  return (
    <Stack rowGap={1}>
      <Box bgcolor="#fff" p={3} borderRadius="8px">
        <PeriodController
          onChangePeriod={setPeriod}
          //   onChangeReportType={setReportType}
          showReportType={false}
        />
        <Box height={510}>
          <ReactChart
            type="line"
            data={labelDataSets}
            options={graphConfig as any}
            ref={chartRef}
          />
        </Box>
      </Box>
      <TagCard tabs={["詳細數據"]}>
        <Box
          className="ag-theme-alpine"
          style={{
            paddingBottom: "24px",
          }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={columnHeaders}
            defaultColDef={{
              resizable: true,
              initialWidth: 200,
              wrapHeaderText: true,
              autoHeaderHeight: true,
            }}
            domLayout="autoHeight"
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
