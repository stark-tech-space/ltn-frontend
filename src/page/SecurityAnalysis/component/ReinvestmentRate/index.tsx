import { Stack, Box } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Chart as ReactChart } from "react-chartjs-2";
import { Chart } from "chart.js";

import TagCard from "../../../../component/tabCard";
import { REINVESTMENT_RATE_DATASET, REINVESTMENT_RATE_GRAPH_CONFIG } from "./GrapConfig";
import { PERIOD } from "types/common";

import { currentStock } from "recoil/selector";
import { useRecoilValue } from "recoil";

import PeriodController from "component/PeriodController";
import { getDataLimit } from "until";
import numeral from "numeral";
import { fetchIncomeStatement } from "api/financial";
import { IIncomeStatements } from "types/financial";
import { fetchSecurityBalanceSheetStatement } from "api/security";
import { IBalanceSheetStatement } from "types/news";

const GRAPH_FIELDS = [
  {
    field: "RIR",
    headerName: "盈再率",
  },
];

export default function ReinvestmentRate() {
  const stock = useRecoilValue(currentStock);

  const chartRef = useRef<Chart>();

  const [period, setPeriod] = useState(3);
  const [incomeData, setIncomeData] = useState<Array<IIncomeStatements>>([]);
  const [data, setData] = useState<Array<IBalanceSheetStatement>>([]);

  const netIncomeSummaryOf16Period = useMemo(() => {
    return Object.fromEntries(
      incomeData.map((item, index) => {
        const total = Array.from({ length: 16 })
          .map((_, pastIndex) => incomeData[index + 16 - pastIndex] || {})
          .reduce((prev, cur) => prev + cur?.netIncome, 0);
        return [`${item.calendarYear}-${item.period}`, total];
      })
    );
  }, [incomeData]);

  const dataByYear = useMemo(() => {
    return Object.fromEntries(data.map((line) => [`${line.calendarYear}-${line.period}`, line]));
  }, [data]);

  const RIR = useMemo(() => {
    const totalData = data
      .map((item) => {
        const period = `${item.calendarYear}-${item.period}`;
        const fourYearBeforeData = dataByYear[`${Number(item.calendarYear) - 4}-${item.period}`];
        if (!fourYearBeforeData || netIncomeSummaryOf16Period[period] <= 0) {
          return { period, date: item.date, value: NaN };
        }

        return {
          period,
          date: item.date,
          value:
            ((item.propertyPlantEquipmentNet +
              item.longTermInvestments -
              fourYearBeforeData?.propertyPlantEquipmentNet -
              fourYearBeforeData?.longTermInvestments) /
              netIncomeSummaryOf16Period[period]) *
            100,
        };
      })
      .sort((a, b) => (a.period > b.period ? -1 : 1));

    return totalData.slice(0, period * 4);
  }, [data, dataByYear, netIncomeSummaryOf16Period, period]);

  const updateGraph = (data: { period: string; date: string; value: number }[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map((v) => v.value);
        }
      });
      chartRef.current.update();
    }
  };

  const columnHeaders = useMemo(() => {
    const columns: any[] = [
      {
        field: "title",
        headerName: "年度/季度",
        pinned: "left",
      },
    ];
    data?.forEach((item) => {
      columns.push({
        field: `${item.calendarYear}-${item.period}`,
      });
    });
    return columns;
  }, [data]);

  const tableRowData = useMemo(() => {
    const rowData: any[] = [];

    GRAPH_FIELDS.forEach(({ field, headerName }) => {
      const dataSources: { [key: string]: any } = {
        title: headerName,
      };

      RIR?.forEach((item) => {
        dataSources[item.period] = Number.isNaN(item.value)
          ? "虧損"
          : numeral(item.value).format("0,0.000");
      });
      rowData.push(dataSources);
    });
    return rowData;
  }, [RIR]);

  useEffect(() => {
    // 需要再往前拿4年
    const limit = getDataLimit(PERIOD.QUARTER, period + 4);
    fetchSecurityBalanceSheetStatement<Array<IBalanceSheetStatement>>(
      stock.Symbol,
      PERIOD.QUARTER,
      limit
    ).then((rst) => {
      if (rst) {
        setData(rst || []);
      }
    });

    // 需要再往前拿16季（4年）
    const incomeLimit = getDataLimit(PERIOD.QUARTER, period + 4);
    fetchIncomeStatement(stock.Symbol, PERIOD.QUARTER, incomeLimit).then((rst) => {
      if (rst) {
        setIncomeData(rst || []);
      }
    });
  }, [stock.Symbol, period]);

  useEffect(() => {
    updateGraph(RIR);
  }, [RIR]);

  return (
    <Stack rowGap={1}>
      <Box bgcolor="#fff" p={3} borderRadius="8px">
        <PeriodController onChangePeriod={setPeriod} showReportType={false} />
        <Box height={510}>
          <ReactChart
            type="line"
            data={REINVESTMENT_RATE_DATASET}
            options={REINVESTMENT_RATE_GRAPH_CONFIG as any}
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
            rowData={tableRowData}
            columnDefs={columnHeaders as any}
            defaultColDef={{
              resizable: false,
              initialWidth: 200,
              wrapHeaderText: true,
              autoHeaderHeight: true,
              // flex: 1,
            }}
            domLayout="autoHeight"
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
