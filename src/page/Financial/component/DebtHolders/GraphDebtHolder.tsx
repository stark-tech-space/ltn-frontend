import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig, labelDataSets_01 } from "./GraphConfig";
import type { Chart } from "chart.js";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { IProfitRatio } from "types/profitability";
import PeriodController from "component/PeriodController";
import { fetchLiabilitiesAndEquity } from "api/financial";
import { getDataLimit, ltnApiDataToFmpData } from "until";

// 淨值：AccountsReceivableNet
// 負載總：Liabilities
export const GRAPH_FIELDS = [
  {
    field: "CurrentLiabilities",
    headerName: "流動負債",
  },
  {
    field: "LongtermBorrowings",
    headerName: "長期負債",
  },
  {
    field: "AccountsReceivableNet",
    headerName: "淨值",
  },
  {
    field: "totalDebtAndNetValue",
    headerName: "總負債 + 淨值",
  },
];

export const GRAPH_TABLE_FIELDS = [
  {
    field: "ShorttermBorrowings",
    headerName: "短期借款",
  },
  {
    field: "ShortTermBillsPayable",
    headerName: "應付短期票券",
  },
  {
    field: "AccountsPayableandNotes",
    headerName: "應付帳款及票據",
  },
  {
    field: "AdvancePayment",
    headerName: "預收款項",
  },
  {
    field: "LongtermLiabilitiesDueWithinOneYear",
    headerName: "一年內到期長期負債",
  },
  {
    field: "OtherCurrentLiabilities",
    headerName: "其餘流動負債",
  },
  {
    field: "CurrentLiabilities",
    headerName: "流動負債",
  },
  {
    field: "LongtermBorrowings",
    headerName: "長期負債",
  },
  {
    field: "RemainingLiabilities",
    headerName: "其餘負債",
  },
  {
    field: "Liabilities",
    headerName: "總負債",
  },
  {
    field: "AccountsReceivableNet",
    headerName: "淨值",
  },
];

export default function GraphDebtHolder({
  getGraphData,
}: {
  getGraphData: (data: any[][]) => void;
}) {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);

  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  const updateGraph = (data: any[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map((item) => +item[field]);
        }
      });
      chartRef.current.update();
    }
  };

  const genGraphTableData = (data: IProfitRatio[]) => {
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
          reportType === PERIOD.QUARTER ? `${item.calendarYear}-${item.period}` : item.calendarYear,
      });
    });

    GRAPH_TABLE_FIELDS.forEach(({ field, headerName }) => {
      const dataSources: { [key: string]: any } = {
        title: headerName,
      };
      data?.forEach((item) => {
        if (reportType === PERIOD.ANNUAL) {
          dataSources[item.calendarYear] = +item[field as keyof IProfitRatio];
        } else {
          dataSources[`${item.calendarYear}-${item.period}`] = +item[field as keyof IProfitRatio];
        }
      });
      rowData.push(dataSources);
    });
    return [columnHeaders, rowData];
  };

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(reportType, period);
    const rst = await fetchLiabilitiesAndEquity<any>({
      securityCode: stock.No,
      size: limit,
    });
    if (rst.list) {
      const data = rst.list.map((item: any) => {
        const year = item.year;
        const tableData: any[] = item.tables.filter((table: any) => table.name === "資產負債表")[0]
          .data;
        /**
         * 21XX 流動負債
         * 2100 短期借款
         * 2110 應付短期票券
         * 2150 + 2160+ 2170 + 2180 應付帳款及票據
         * 2310 預收款項
         * 2320 一年內到期長期負債
         * 2130 + 2200 + 2230  + 2280 + 2399 其餘流動負債
         * 2527 + 2570 + 2580 + 2600  其餘負債
         * 2530 + 2540 長期負債
         * 2XXX 總負債
         * 1XXX 總資產
         * 1XXX - 2XXX 淨值
         * 3110   普通股股本
         * 3300 保留盈餘
         */
        const allFilterData = tableData
          .filter((item) => (item.date as string).startsWith(year))
          .filter((item) => {
            return (
              item.code === "21XX" ||
              item.code === "2100" ||
              item.code === "2110" ||
              item.code === "2150" ||
              item.code === "2160" ||
              item.code === "2170" ||
              item.code === "2180" ||
              item.code === "2320" ||
              item.code === "2130" ||
              item.code === "2200" ||
              item.code === "2230" ||
              item.code === "2280" ||
              item.code === "2399" ||
              item.code === "2527" ||
              item.code === "2570" ||
              item.code === "2580" ||
              item.code === "2600" ||
              item.code === "2310" ||
              item.code === "2530" ||
              item.code === "2540" ||
              item.code === "2XXX" ||
              item.code === "1XXX"
            );
          });

        const allTables = allFilterData.map(ltnApiDataToFmpData);
        const CurrentLiabilities = allTables.filter((item) => item.code === "21XX")[0]?.value || 0;
        const OrdinaryShareCapital =
          allTables.filter((item) => item.code === "3110")[0]?.value || 0;
        const RetainedEarnings = allTables.filter((item) => item.code === "3300")[0]?.value || 0;
        const LongtermBorrowings =
          (allTables.filter((item) => item.code === "2530")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "2540")[0]?.value || 0);

        const AccountsReceivableNet =
          (allTables.filter((item) => item.code === "1XXX")[0]?.value || 0) -
            allTables.filter((item) => item.code === "2XXX")[0]?.value || 0;

        const totalDebtAndNetValue =
          allTables.filter((item) => item.code === "1XXX")[0]?.value || 0;
        const ShorttermBorrowings = allTables.filter((item) => item.code === "2100")[0]?.value || 0;
        const ShortTermBillsPayable =
          allTables.filter((item) => item.code === "2110")[0]?.value || 0;
        const AccountsPayableandNotes =
          (allTables.filter((item) => item.code === "2150")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "2160")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "2170")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "2180")[0]?.value || 0);

        const AdvancePayment = allTables.filter((item) => item.code === "2310")[0]?.value || 0;
        const LongtermLiabilitiesDueWithinOneYear =
          allTables.filter((item) => item.code === "2320")[0]?.value || 0;
        const OtherCurrentLiabilities =
          (allTables.filter((item) => item.code === "2130")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "2200")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "2230")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "2280")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "2399")[0]?.value || 0);
        // 2527 + 2570 + 2580 + 2600
        const RemainingLiabilities =
          (allTables.filter((item) => item.code === "2527")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "2570")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "2580")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "2600")[0]?.value || 0);

        const Liabilities = allTables.filter((item) => item.code === "2XXX")[0]?.value || 0;
        return {
          ...item,
          tables: allTables,
          CurrentLiabilities,
          LongtermBorrowings,
          AccountsReceivableNet,
          totalDebtAndNetValue,
          date: allTables[0]?.date,
          calendarYear: allTables[0]?.calendarYear,
          period: allTables[0]?.period,
          ShorttermBorrowings,
          ShortTermBillsPayable,
          AccountsPayableandNotes,
          AdvancePayment,
          LongtermLiabilitiesDueWithinOneYear,
          OtherCurrentLiabilities,
          RemainingLiabilities,
          Liabilities,
          OrdinaryShareCapital,
          RetainedEarnings,
        };
      });
      const realDate = data.filter((item: any) => item.tables.length > 0);
      updateGraph(realDate);
      getGraphData(genGraphTableData(realDate));
    }
  }, [stock, period, reportType, getGraphData]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  return (
    <>
      <PeriodController onChangePeriod={setPeriod} onChangeReportType={setReportType} />
      <Box height={510} bgcolor="#fff" pb={3}>
        <ReactChart
          type="line"
          data={labelDataSets_01}
          options={graphConfig as any}
          ref={chartRef}
        />
      </Box>
    </>
  );
}
