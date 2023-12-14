import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { Chart as ReactChart } from "react-chartjs-2";
import type { Chart } from "chart.js";
import { labelDataSets_01, graphConfig } from "./GraphConfig";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { PERIOD_TYPE } from "types/common";
import { fetchFindMindAPI } from "api/common";
import moment from "moment";
import { genFullDateObject, getBeforeYears, sortCallback } from "until";
import numeral from "numeral";

interface IGraphData {
  date: string;
  Foreign_Investor_Foreign_Dealer_Self: number;
  Investment_Trust: number;
  Dealer_self_Dealer_Hedging: number;
}

interface IBuySellItem {
  date: string;
  sell: number;
  buy: number;
  name: string;
}

const GRAPH_FIELDS = [
  {
    field: "Foreign_Investor_Foreign_Dealer_Self",
    headerName: "外資及陸資",
  },
  {
    field: "Investment_Trust",
    headerName: "投信",
  },
  {
    field: "Dealer_self_Dealer_Hedging",
    headerName: "自營商",
  },
];

const PERIOD_YEAR = [
  { label: "近1月", value: 1, type: PERIOD_TYPE.MONTH },
  { label: "近1年", value: 1, type: PERIOD_TYPE.YEAR },
  { label: "近3年", value: 3, type: PERIOD_TYPE.YEAR },
  { label: "近5年", value: 5, type: PERIOD_TYPE.YEAR },
];

export default function GraphForeignInvestorsSelf({
  getGraphData,
}: {
  getGraphData: (data: any) => void;
}) {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState({
    label: "近1月",
    value: 1,
    type: PERIOD_TYPE.MONTH,
  });

  const updateGraph = (data: IGraphData[], isMonthScale: boolean) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof IGraphData]
          );
        }
      });
      chartRef.current.options.scales = {
        x: {
          stacked: true,
          alignToPixels: true,
          offset: false,
          type: isMonthScale ? "category" : "time",
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: "张",
            align: "end",
            font: {
              size: 12,
              weight: "bold",
            },
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          title: {
            display: true,
            text: "股价",
            align: "end",
            font: {
              size: 12,
              weight: "bold",
            },
          },
        },
      };

      if (!isMonthScale) {
        // @ts-ignore
        chartRef.current.options.scales.x!.time = {
          unit: "year",
          tooltipFormat: "YYYY-MM",
        };
      }

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
        headerName: "年度/月份",
        pinned: "left",
      },
    ];

    data?.forEach((item) => {
      columnHeaders.push({
        field: item.date,
      });
    });

    GRAPH_FIELDS.forEach(({ field, headerName }) => {
      const dataSources: { [key: string]: any } = {
        title: headerName,
        pinned: "left",
      };

      data?.forEach((item) => {
        dataSources[item.date] = numeral(
          item[field as keyof IGraphData]
        ).format("0,0.00");
      });
      rowData.push(dataSources);
    });
    return [columnHeaders, rowData];
  };

  const calc = (item: IGraphData[], key: string) => {
    let total = 0;
    item.forEach((item) => {
      total += item[key as keyof IGraphData] as number;
    });
    return total;
  };
  const genYearGraphData = (graphData: any[]) => {
    const data = [...graphData];
    let keyId = data[0].calendarYear;
    const groupByMonths: any = {};
    const groupByYears: { [year: string]: { month: string; sma: number }[] } = {
      [keyId]: [],
    };

    data.forEach((item) => {
      if (item.calendarYear !== keyId) {
        keyId = item.calendarYear;
      }
      if (groupByYears[keyId]) {
        groupByYears[keyId].push(item);
      } else {
        groupByYears[keyId] = [item];
      }
    });

    for (let key in groupByYears) {
      const yearData = groupByYears[key].slice();
      let monthId = yearData[0].month;
      const groupMonths: { [month: string]: any[] } = {};

      yearData.forEach((item) => {
        if (item.month !== monthId) {
          monthId = item.month;
        }
        if (groupMonths[monthId]) {
          groupMonths[monthId].push(item);
        } else {
          groupMonths[monthId] = [item];
        }
      });
      groupByMonths[key] = groupMonths;
    }

    const list: any[] = [];
    Object.entries(groupByMonths).forEach(([year, monthData]) => {
      Object.entries(monthData as IGraphData).forEach(([month, item]) => {
        const monthByTotal = {
          date: `${year}-${month}`,
          Foreign_Investor_Foreign_Dealer_Self: calc(
            item,
            "Foreign_Investor_Foreign_Dealer_Self"
          ),
          Investment_Trust: calc(item, "Investment_Trust"),
          Dealer_self_Dealer_Hedging: calc(item, "Dealer_self_Dealer_Hedging"),
        };
        list.push(monthByTotal);
      });
    });
    return list.sort(sortCallback);
  };

  const fetchGraphData = useCallback(async () => {
    let start_date = "";

    if (period.type === PERIOD_TYPE.MONTH) {
      start_date = moment()
        .subtract(21, "day")
        .startOf("day")
        .format("YYYY-MM-DD");
    } else {
      start_date = getBeforeYears(period.value - 1);
    }

    const rst = await fetchFindMindAPI<IBuySellItem[]>({
      data_id: stock.No,
      dataset: "TaiwanStockInstitutionalInvestorsBuySell",
      start_date,
    });

    /**
     * 外陸資=外陸資買賣超股數(不含外資自營商) + 外資自營商買賣超股數
     * Foreign_Investor + Foreign_Dealer_Self
     *
     * 投信=投信買賣超股數
     * Investment_Trust
     *
     * 自營商=自營商買賣超股數(自行買賣)+自營商買賣超股數(避險)
     * Dealer_self + Dealer_Hedging
     * */

    const fieldsList: { [key: string]: IBuySellItem[] } = {
      Foreign_Investor: [],
      Foreign_Dealer_Self: [],
      Investment_Trust: [],
      Dealer_self: [],
      Dealer_Hedging: [],
    };

    if (rst) {
      Object.keys(fieldsList).forEach((field) => {
        fieldsList[field] = rst.filter((item) => item.name === field);
      });
    }
    // console.log(rst);

    const graphData: any = fieldsList.Foreign_Investor.map((item, index) => {
      const fullDate = genFullDateObject(item.date);
      return {
        date: item.date,
        calendarYear: fullDate.calendarYear,
        month: fullDate.month,
        Foreign_Investor_Foreign_Dealer_Self:
          item.sell + fieldsList["Foreign_Dealer_Self"][index].sell,
        Investment_Trust: fieldsList["Investment_Trust"][index].sell,
        Dealer_self_Dealer_Hedging:
          fieldsList["Dealer_self"][index].sell +
          fieldsList["Dealer_Hedging"][index].sell,
      };
    });
    if (period.type === PERIOD_TYPE.MONTH) {
      updateGraph(graphData, true);
      getGraphData(genGraphTableData(graphData));
    } else {
      const list = genYearGraphData(graphData);
      updateGraph(list, false);
      getGraphData(genGraphTableData(list));
    }
  }, [period, stock.No]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  return (
    <>
      <Box pb={1}>
        {PERIOD_YEAR.map((item) => (
          <Button
            key={item.value}
            sx={{
              color:
                item.value === period.value && item.type === period.type
                  ? "#405DF9"
                  : "#333",
            }}
            onClick={() => {
              setPeriod(item);
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
      <Box height={510} pb={3}>
        <ReactChart
          type="bar"
          data={labelDataSets_01}
          options={graphConfig as any}
          ref={chartRef}
        />
      </Box>
    </>
  );
}
