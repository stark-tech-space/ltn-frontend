import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import {
  graphConfig,
  labelDataSets_01,
  labelDataSets_02,
  labelDataSets_03,
  labelDataSets_f,
  labelDataSets_f_2,
} from "./GraphConfig";
import type { Chart } from "chart.js";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { IProfitRatio } from "types/profitability";
import PeriodController from "component/PeriodController";
import { fetchLiabilitiesAndEquity } from "api/financial";
import { getDataLimit, ltnApiDataToFmpData } from "until";
import numeral from "numeral";
import moment from "moment";

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

export const GRAPH_FIELDS_F = [
  {
    field: "f1",
    headerName: "央行及金融同業存款",
  },
  {
    field: "f2",
    headerName: "央行及同業融資",
  },
  {
    field: "f9",
    headerName: "存款及匯款",
  },
  {
    field: "f10",
    headerName: "應付債券",
  },
  {
    field: "f11",
    headerName: "營業及負債準備",
  },
  {
    field: "f12",
    headerName: "其餘負債",
  },
  {
    field: "f15",
    headerName: "淨值",
  },
  {
    field: "f17",
    headerName: "總負債 + 淨值",
  },
];

export const GRAPH_FIELDS_F_2 = [
  {
    field: "f1",
    headerName: "央行及金融同業存款",
  },
  {
    field: "f2",
    headerName: "央行及同業融資",
  },
  {
    field: "f9",
    headerName: "存款及匯款",
  },
  {
    field: "f10",
    headerName: "應付債券",
  },
  {
    field: "f11",
    headerName: "營業及負債準備",
  },
  {
    field: "f16",
    headerName: "總負債",
  },
];

export const TABLE_FIELDS_FINANCIAL = [
  {
    field: "f1",
    headerName: "央行及金融同業存款",
  },
  {
    field: "f2",
    headerName: "央行及同業融資",
  },
  {
    field: "f3",
    headerName: "透過損益按公允價值衡量之金融負債",
  },
  {
    field: "f4",
    headerName: "避險之衍生金融負債",
  },
  {
    field: "f5",
    headerName: "附買回票券及債券負債",
  },
  {
    field: "f6",
    headerName: "應付商業本票",
  },
  {
    field: "f7",
    headerName: "應付款項",
  },
  {
    field: "f8",
    headerName: "當期所得稅負債",
  },
  {
    field: "f9",
    headerName: "存款及匯款",
  },
  {
    field: "f10",
    headerName: "應付債券",
  },
  {
    field: "f18",
    headerName: "其他借款",
  },
  {
    field: "f11",
    headerName: "營業及負債準備",
  },
  {
    field: "f12",
    headerName: "其餘負債",
  },
  {
    field: "f16",
    headerName: "總負債",
  },
  {
    field: "f15",
    headerName: "淨值",
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

export const GRAPH_FIELDS3_f = [
  {
    field: "f13",
    headerName: "普通股股本",
  },
  {
    field: "f14",
    headerName: "保留盈餘",
  },
  {
    field: "f15",
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

export const GRAPH_TABLE_FIELDS_f = [
  {
    field: "f13",
    headerName: "普通股股本(千元)",
  },
  {
    field: "f14",
    headerName: "保留盈餘(千元)",
  },
  {
    field: "f15",
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
  const [graphData, setGraphData] = useState<IProfitRatio[]>();
  const [isFinancial, setIsFinancial] = useState(false);

  const updateGraph = (data: any[], isFinancial = false) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      graphField?.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field]
          );
        }
      });
      chartRef.current.update();
    }
  };

  const genGraphTableData = (data: IProfitRatio[], isFinancial = false) => {
    if (data.length === 0) {
      return [[], []];
    }
    data = data.reverse();
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
            ? `${moment(item.date).format("YYYY-[Q]Q")}`
            : `${item.calendarYear}`,
      });
    });

    tableField?.forEach(({ field, headerName }) => {
      const dataSources: { [key: string]: any } = {
        title: headerName,
      };
      data?.forEach((item) => {
        if (reportType === PERIOD.ANNUAL) {
          dataSources[item.calendarYear] = numeral(
            +item[field as keyof IProfitRatio]
          ).format("0,0");
        } else {
          dataSources[`${moment(item.date).format("YYYY-[Q]Q")}`] = numeral(
            +item[field as keyof IProfitRatio]
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
        const tableData: any[] = item.tables.filter(
          (table: any) => table.name === "資產負債表"
        )[0].data;
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
              item.code === "1XXX" ||
              item.code === "3110" ||
              item.code === "3300" ||
              item.code === "21000" ||
              item.code === "21500" ||
              item.code === "22000" ||
              item.code === "22300" ||
              item.code === "22500" ||
              item.code === "22600" ||
              item.code === "23000" ||
              item.code === "23200" ||
              item.code === "23500" ||
              item.code === "24000" ||
              item.code === "24600" ||
              item.code === "25500" ||
              item.code === "26000" ||
              item.code === "29300" ||
              item.code === "29500" ||
              item.code === "31101" ||
              item.code === "32000" ||
              item.code === "39999" ||
              item.code === "29999"
            );
          });

        const allTables = allFilterData.map(ltnApiDataToFmpData);
        const CurrentLiabilities =
          allTables.filter((item) => item.code === "21XX")[0]?.value || 0;
        const OrdinaryShareCapital =
          allTables.filter((item) => item.code === "3110")[0]?.value || 0;
        const RetainedEarnings =
          allTables.filter((item) => item.code === "3300")[0]?.value || 0;
        const LongtermBorrowings =
          (allTables.filter((item) => item.code === "2530")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "2540")[0]?.value || 0);

        const AccountsReceivableNet =
          (allTables.filter((item) => item.code === "1XXX")[0]?.value || 0) -
            allTables.filter((item) => item.code === "2XXX")[0]?.value || 0;

        const totalDebtAndNetValue =
          allTables.filter((item) => item.code === "1XXX")[0]?.value || 0;
        const ShorttermBorrowings =
          allTables.filter((item) => item.code === "2100")[0]?.value || 0;
        const ShortTermBillsPayable =
          allTables.filter((item) => item.code === "2110")[0]?.value || 0;
        const AccountsPayableandNotes =
          (allTables.filter((item) => item.code === "2150")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "2160")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "2170")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "2180")[0]?.value || 0);

        const AdvancePayment =
          allTables.filter((item) => item.code === "2310")[0]?.value || 0;
        const LongtermLiabilitiesDueWithinOneYear =
          allTables.filter((item) => item.code === "2320")[0]?.value || 0;
        const OtherCurrentLiabilities =
          CurrentLiabilities -
          (ShorttermBorrowings +
            ShortTermBillsPayable +
            AccountsPayableandNotes +
            AdvancePayment +
            LongtermLiabilitiesDueWithinOneYear);

        // (allTables.filter((item) => item.code === "2130")[0]?.value || 0) +
        // (allTables.filter((item) => item.code === "2200")[0]?.value || 0) +
        // (allTables.filter((item) => item.code === "2230")[0]?.value || 0) +
        // (allTables.filter((item) => item.code === "2280")[0]?.value || 0) +
        // (allTables.filter((item) => item.code === "2399")[0]?.value || 0);
        // 2527 + 2570 + 2580 + 2600
        const Liabilities =
          allTables.filter((item) => item.code === "2XXX")[0]?.value || 0;
        const RemainingLiabilities =
          Liabilities - (CurrentLiabilities + LongtermBorrowings);
        // (allTables.filter((item) => item.code === "2527")[0]?.value || 0) +
        // (allTables.filter((item) => item.code === "2570")[0]?.value || 0) +
        // (allTables.filter((item) => item.code === "2580")[0]?.value || 0) +
        // (allTables.filter((item) => item.code === "2600")[0]?.value || 0);

        // 金融企业的数据
        const f1 =
          allTables.filter((item) => item.code === "21000")[0]?.value || 0;

        const f2 =
          allTables.filter((item) => item.code === "21500")[0]?.value || 0;

        const f3 =
          allTables.filter((item) => item.code === "22000")[0]?.value || 0;

        const f4 =
          allTables.filter((item) => item.code === "22300")[0]?.value || 0;

        const f5 =
          allTables.filter((item) => item.code === "22500")[0]?.value || 0;

        const f6 =
          allTables.filter((item) => item.code === "22600")[0]?.value || 0;

        const f7 =
          allTables.filter((item) => item.code === "23000")[0]?.value || 0;

        const f8 =
          allTables.filter((item) => item.code === "23200")[0]?.value || 0;

        const f9 =
          allTables.filter((item) => item.code === "23500")[0]?.value || 0;

        const f10 =
          allTables.filter((item) => item.code === "24000")[0]?.value || 0;

        const f11 =
          allTables.filter((item) => item.code === "24600")[0]?.value || 0;

        const f12 =
          (allTables.filter((item) => item.code === "25500")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "26000")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "29300")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "29500")[0]?.value || 0);

        const f13 =
          allTables.filter((item) => item.code === "31101")[0]?.value || 0;
        const f14 =
          allTables.filter((item) => item.code === "32000")[0]?.value || 0;

        const f15 =
          allTables.filter((item) => item.code === "39999")[0]?.value || 0;

        const f16 =
          allTables.filter((item) => item.code === "29999")[0]?.value || 0;

        const f17 =
          (allTables.filter((item) => item.code === "39999")[0]?.value || 0) +
          (allTables.filter((item) => item.code === "29999")[0]?.value || 0);

        // 其他借款 暂时不知道 设置为0
        const f18 = 0;

        if (f1) {
          setIsFinancial(true);
          return {
            ...item,
            tables: allTables,
            f1,
            f2,
            f3,
            f4,
            date: moment(allTables[0]?.date, "YYYY-MM-DD")
              .startOf("quarter")
              .format("YYYY-MM-DD"),
            calendarYear: allTables[0]?.calendarYear,
            period: allTables[0]?.period,
            f5,
            f6,
            f7,
            f8,
            f9,
            f10,
            f11,
            f12,
            f13,
            f14,
            f15,
            f16,
            f17,
            f18,
          };
        }

        return {
          ...item,
          tables: allTables,
          CurrentLiabilities,
          LongtermBorrowings,
          AccountsReceivableNet,
          totalDebtAndNetValue,
          date: moment(allTables[0]?.date, "YYYY-MM-DD")
            .startOf("quarter")
            .format("YYYY-MM-DD"),
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
            0
          );
          const LongtermBorrowings = value.reduce(
            (pre: number, cur: any) => pre + cur.LongtermBorrowings,
            0
          );
          const AccountsReceivableNet = value.reduce(
            (pre: number, cur: any) => pre + cur.AccountsReceivableNet,
            0
          );
          const totalDebtAndNetValue = value.reduce(
            (pre: number, cur: any) => pre + cur.totalDebtAndNetValue,
            0
          );
          const ShorttermBorrowings = value.reduce(
            (pre: number, cur: any) => pre + cur.ShorttermBorrowings,
            0
          );
          const ShortTermBillsPayable = value.reduce(
            (pre: number, cur: any) => pre + cur.ShortTermBillsPayable,
            0
          );
          const AccountsPayableandNotes = value.reduce(
            (pre: number, cur: any) => pre + cur.AccountsPayableandNotes,
            0
          );
          const AdvancePayment = value.reduce(
            (pre: number, cur: any) => pre + cur.AdvancePayment,
            0
          );
          const LongtermLiabilitiesDueWithinOneYear = value.reduce(
            (pre: number, cur: any) =>
              pre + cur.LongtermLiabilitiesDueWithinOneYear,
            0
          );
          const OtherCurrentLiabilities = value.reduce(
            (pre: number, cur: any) => pre + cur.OtherCurrentLiabilities,
            0
          );
          const RemainingLiabilities = value.reduce(
            (pre: number, cur: any) => pre + cur.RemainingLiabilities,
            0
          );
          const Liabilities = value.reduce(
            (pre: number, cur: any) => pre + cur.Liabilities,
            0
          );
          const OrdinaryShareCapital = value.reduce(
            (pre: number, cur: any) => pre + cur.OrdinaryShareCapital,
            0
          );
          const RetainedEarnings = value.reduce(
            (pre: number, cur: any) => pre + cur.RetainedEarnings,
            0
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
        setGraphData(updateData);
        // updateGraph(updateData, isFinancial);
        // getGraphData(genGraphTableData(updateData, isFinancial));
        return;
      }

      setGraphData(realDate);

      // updateGraph(realDate, isFinancial);
      // getGraphData(genGraphTableData(realDate, isFinancial));
    }
  }, [stock, period, reportType, getGraphData, tabIndex]);

  useEffect(() => {
    updateGraph(graphData || [], isFinancial);
    getGraphData(genGraphTableData(graphData || [], isFinancial));
  }, [graphData, isFinancial]);

  const graphField = useMemo(() => {
    if (isFinancial) {
      if (tabIndex === 0) {
        return GRAPH_FIELDS_F;
      } else if (tabIndex === 1) {
        return GRAPH_FIELDS_F_2;
      } else if (tabIndex === 2) {
        return GRAPH_FIELDS3_f;
      }
    } else {
      if (tabIndex === 0) {
        return GRAPH_FIELDS;
      }
      if (tabIndex === 1) {
        return GRAPH_FIELDS2;
      }
      if (tabIndex === 2) {
        return GRAPH_FIELDS3;
      }
    }
  }, [tabIndex, isFinancial]);

  const tableField = useMemo(() => {
    if (isFinancial) {
      if (tabIndex === 2) {
        return GRAPH_TABLE_FIELDS_f;
      }
      return TABLE_FIELDS_FINANCIAL;
    } else {
      if (tabIndex === 2) {
        return GRAPH_TABLE_FIELDS2;
      }
      return GRAPH_TABLE_FIELDS;
    }
  }, [tabIndex, isFinancial]);

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
        {tabIndex === 0 && (
          <ReactChart
            type="line"
            data={isFinancial ? labelDataSets_f : labelDataSets_01}
            options={graphConfig as any}
            ref={chartRef}
          />
        )}
        {tabIndex === 1 && (
          <ReactChart
            type="line"
            data={isFinancial ? labelDataSets_f_2 : labelDataSets_02}
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
