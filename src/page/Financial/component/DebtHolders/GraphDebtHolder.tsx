import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig, labelDataSets_01, labelDataSets_02, labelDataSets_03 } from "./GraphConfig";
import type { Chart } from "chart.js";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { IProfitRatio } from "types/profitability";
import PeriodController from "component/PeriodController";
import { fetchLiabilitiesAndEquity } from "api/financial";
import { getDataLimit, ltnApiDataToFmpData } from "until";
import numeral from "numeral";

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

export const GRAPH_FIELDS2 = [
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
    field: "LongtermBorrowings",
    headerName: "長期負債",
  },
  {
    field: "Liabilities",
    headerName: "總負債",
  },
];

export const GRAPH_FIELDS3 = [
  {
    field: "OrdinaryShareCapital",
    headerName: "普通股股本",
  },
  {
    field: "RetainedEarnings",
    headerName: "保留盈餘",
  },
  {
    field: "AccountsReceivableNet",
    headerName: "淨值",
  },
];

export const GRAPH_TABLE_FIELDS = [
  {
    field: "ShorttermBorrowings",
    headerName: "短期借款(千元)",
  },
  {
    field: "ShortTermBillsPayable",
    headerName: "應付短期票券(千元)",
  },
  {
    field: "AccountsPayableandNotes",
    headerName: "應付帳款及票據(千元)",
  },
  {
    field: "AdvancePayment",
    headerName: "預收款項(千元)",
  },
  {
    field: "LongtermLiabilitiesDueWithinOneYear",
    headerName: "一年內到期長期負債(千元)",
  },
  {
    field: "OtherCurrentLiabilities",
    headerName: "其餘流動負債(千元)",
  },
  {
    field: "CurrentLiabilities",
    headerName: "流動負債(千元)",
  },
  {
    field: "LongtermBorrowings",
    headerName: "長期負債(千元)",
  },
  {
    field: "RemainingLiabilities",
    headerName: "其餘負債(千元)",
  },
  {
    field: "Liabilities",
    headerName: "總負債(千元)",
  },
  {
    field: "AccountsReceivableNet",
    headerName: "淨值(千元)",
  },
];

export const GRAPH_TABLE_FIELDS2 = [
  {
    field: "OrdinaryShareCapital",
    headerName: "普通股股本(千元)",
  },
  {
    field: "RetainedEarnings",
    headerName: "保留盈餘(千元)",
  },
  {
    field: "AccountsReceivableNet",
    headerName: "淨值(千元)",
  },
];

export default function GraphDebtHolder({
  getGraphData,
  tabIndex,
}: {
  getGraphData: (data: any[][]) => void;
  tabIndex: number;
}) {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);

  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  const updateGraph = (data: any[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      graphField?.forEach(async ({ field }, index) => {
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
          reportType === PERIOD.QUARTER
            ? `${item.calendarYear}-${item.period}`
            : `${item.calendarYear}`,
      });
    });

    tableField?.forEach(({ field, headerName }) => {
      const dataSources: { [key: string]: any } = {
        title: headerName,
      };
      data?.forEach((item) => {
        if (reportType === PERIOD.ANNUAL) {
          dataSources[item.calendarYear] = numeral(+item[field as keyof IProfitRatio]).format(
            "0,0",
          );
        } else {
          dataSources[`${item.calendarYear}-${item.period}`] = numeral(
            +item[field as keyof IProfitRatio],
          ).format("0,0");
        }
      });
      rowData.push(dataSources);
    });
    return [columnHeaders, rowData];
  };

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(PERIOD.QUARTER, period);
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

      // 年报 把当年的所有数据加起来
      if (reportType === PERIOD.ANNUAL) {
        const allData: { [key: string]: any[] } = {};
        realDate.forEach((item: any) => {
          if (!allData[item.year]) {
            allData[item.year] = [];
          }
          allData[item.year].push(item);
        });

        Object.entries(allData).forEach(([key, value]) => {
          const CurrentLiabilities = value.reduce(
            (pre: number, cur: any) => pre + cur.CurrentLiabilities,
            0,
          );
          const LongtermBorrowings = value.reduce(
            (pre: number, cur: any) => pre + cur.LongtermBorrowings,
            0,
          );
          const AccountsReceivableNet = value.reduce(
            (pre: number, cur: any) => pre + cur.AccountsReceivableNet,
            0,
          );
          const totalDebtAndNetValue = value.reduce(
            (pre: number, cur: any) => pre + cur.totalDebtAndNetValue,
            0,
          );
          const ShorttermBorrowings = value.reduce(
            (pre: number, cur: any) => pre + cur.ShorttermBorrowings,
            0,
          );
          const ShortTermBillsPayable = value.reduce(
            (pre: number, cur: any) => pre + cur.ShortTermBillsPayable,
            0,
          );
          const AccountsPayableandNotes = value.reduce(
            (pre: number, cur: any) => pre + cur.AccountsPayableandNotes,
            0,
          );
          const AdvancePayment = value.reduce(
            (pre: number, cur: any) => pre + cur.AdvancePayment,
            0,
          );
          const LongtermLiabilitiesDueWithinOneYear = value.reduce(
            (pre: number, cur: any) => pre + cur.LongtermLiabilitiesDueWithinOneYear,
            0,
          );
          const OtherCurrentLiabilities = value.reduce(
            (pre: number, cur: any) => pre + cur.OtherCurrentLiabilities,
            0,
          );
          const RemainingLiabilities = value.reduce(
            (pre: number, cur: any) => pre + cur.RemainingLiabilities,
            0,
          );
          const Liabilities = value.reduce((pre: number, cur: any) => pre + cur.Liabilities, 0);
          const OrdinaryShareCapital = value.reduce(
            (pre: number, cur: any) => pre + cur.OrdinaryShareCapital,
            0,
          );
          const RetainedEarnings = value.reduce(
            (pre: number, cur: any) => pre + cur.RetainedEarnings,
            0,
          );

          allData[key] = {
            ...value[0],
            date: value[0].year,
            CurrentLiabilities,
            LongtermBorrowings,
            AccountsReceivableNet,
            totalDebtAndNetValue,
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
        const newRealData: any[] = Object.values(allData);
        const updateData = newRealData.reverse().slice(0, period).reverse();
        updateGraph(updateData);
        getGraphData(genGraphTableData(updateData));
        return;
      }

      updateGraph(realDate);
      getGraphData(genGraphTableData(realDate));
    }
  }, [stock, period, reportType, getGraphData, tabIndex]);

  const graphField = useMemo(() => {
    if (tabIndex === 0) {
      return GRAPH_FIELDS;
    }
    if (tabIndex === 1) {
      return GRAPH_FIELDS2;
    }
    if (tabIndex === 2) {
      return GRAPH_FIELDS3;
    }
  }, [tabIndex]);

  const tableField = useMemo(() => {
    if (tabIndex === 2) {
      return GRAPH_TABLE_FIELDS2;
    }
    return GRAPH_TABLE_FIELDS;
  }, [tabIndex]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  return (
    <>
      <PeriodController onChangePeriod={setPeriod} onChangeReportType={setReportType} />
      <Box height={510} bgcolor="#fff" pb={3}>
        {tabIndex === 0 && (
          <ReactChart
            type="line"
            data={labelDataSets_01}
            options={graphConfig as any}
            ref={chartRef}
          />
        )}
        {tabIndex === 1 && (
          <ReactChart
            type="line"
            data={labelDataSets_02}
            options={graphConfig as any}
            ref={chartRef}
          />
        )}
        {tabIndex === 2 && (
          <ReactChart
            type="line"
            data={labelDataSets_03}
            options={graphConfig as any}
            ref={chartRef}
          />
        )}
      </Box>
    </>
  );
}
