import { useEffect, useMemo, useRef, useState } from "react";
import { Box, IconButton, Stack } from "@mui/material";
import WrappedAgGrid from "component/WrappedAgGrid";
import ltnApi from "api/http/ltnApi";
import PeriodController from "component/PeriodController";
import TagCard from "component/tabCard";
import numeral from "numeral";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import PieChartIcon from "@mui/icons-material/PieChart";
import SsidChartIcon from "@mui/icons-material/SsidChart";
import { Chart as ReactChart } from "react-chartjs-2";
import { Chart } from "chart.js";
import {
  lineGraphConfig,
  labelDataSets,
  pieChartLabelDataSets,
  pieChartConfig,
} from "./graphConfig";
import { quarterToMonth } from "until";
import moment from "moment";

/**
 * graph fields
 * 1、折线图和面积图参数
 *  流动资产
 *  长期投资
 *  固定资产
 *  总资产
 * 2、圆饼图参数和table数据
 *  现金及约当现金
 *  短期投资
 *  应收账款及票据
 *  存货
 *  其余流动资产
 *  长期投资
 *  固定资产
 *  总资产
 */
interface ITableItem {
  date: string;
  code: string;
  name: string;
  value: string;
}
interface IList {
  securityCode: string;
  quarter: string;
  id: string;
  year: string;
  tables: { name: string; data: ITableItem[] }[];
}

interface IFields {
  year: string;
  quarter: string;
  data_id: string;
  longTermInvestments: number;
  fixedAssets: number;
  totalAssets: number;
  cashAndCashEquivalents: number;
  shortTermInvestments: number;
  shouldReceivables: number;
  inventories: number;
  otherFlowingAssets: number;
  otherAssets: number;
  totalLiabilities: number;
}

const UNIT = 1;
const TARGET_TABLE_NAME = "資產負債表";

const TARGET_FIELDS = [
  // 流動資產合計可能拿不到先不做
  //   {
  //     // 流動資產合計
  //     name: "流動資產",
  //     field: "flowingAssets",
  //     code: ["11XX"],
  //     calc: () => {},
  //   },

  {
    name: "長期投資",
    field: "longTermInvestments",
    code: ["1510 + 1550"],
    drawerLineChart: true,
    calc: (data: ITableItem[]) => {
      const targets = data.filter(
        (item) => item.code === "1510" || item.code === "1550"
      );
      return (
        targets.reduce(
          (acc, item) => acc + (numeral(item.value).value() || 0),
          0
        ) * UNIT
      );
    },
  },
  {
    name: "固定資產",
    field: "fixedAssets",
    code: ["1600"],
    drawerLineChart: true,
    calc: (data: ITableItem[]) => {
      const targets = data.filter((item) => item.code === "1600");
      return targets[0]?.value
        ? (numeral(targets[0].value).value() || 0) * UNIT
        : 0;
    },
  },
  {
    name: "總資產",
    field: "totalAssets",
    code: ["1XXX", "19999"],
    drawerLineChart: true,
    calc: (data: ITableItem[]) => {
      // item.code === "19999" 可能是總資產
      const targets = data.filter((item) => item.code === "1XXX");
      return targets[0]?.value
        ? (numeral(targets[0].value).value() || 0) * UNIT
        : 0;
    },
  },
  {
    name: "現金及約當現金",
    field: "cashAndCashEquivalents",
    code: ["1100", "11000"],
    drawerLineChart: false,
    calc: (data: ITableItem[]) => {
      const target1100 = data.filter((item) => item.code === "1100");
      const target11000 = data.filter((item) => item.code === "11000");
      const value = target1100[0]?.value || target11000[1]?.value;
      return (numeral(value).value() || 0) * UNIT;
    },
  },
  {
    name: "短期投資",
    field: "shortTermInvestments",
    code: ["1110"],
    drawerLineChart: false,
    calc: (data: ITableItem[]) => {
      const targets = data.filter((item) => item.code === "1110");
      return targets[0]?.value
        ? (numeral(targets[0].value).value() || 0) * UNIT
        : 0;
    },
  },
  {
    name: "應收帳款及票據",
    field: "shouldReceivables",
    code: ["1150+ 1160+1170 +1180"],
    drawerLineChart: false,
    calc: (data: ITableItem[]) => {
      const targets = data.filter(
        (item) =>
          item.code === "1150" ||
          item.code === "1160" ||
          item.code === "1170" ||
          item.code === "1180"
      );
      return (
        targets.reduce(
          (acc, item) => acc + (numeral(item.value).value() || 0),
          0
        ) * UNIT
      );
    },
  },
  {
    name: "存貨",
    field: "inventories",
    code: ["130X"],
    drawerLineChart: false,
    calc: (data: ITableItem[]) => {
      const targets = data.filter((item) => item.code === "130X");
      return (numeral(targets[0]?.value || 0).value() || 0) * UNIT;
    },
  },
  {
    // 其餘流動資產 = 流動資產合計 - 現金及約當現金 - 短期投資 - 應收帳款及票據 - 存貨
    name: "其餘流動資產",
    field: "otherFlowingAssets",
    code: ["11XX - 1100 -1110 +1180"],
    drawerLineChart: false,
    calc: (data: ITableItem[]) => {
      const targets = data.filter(
        (item) =>
          item.code === "11XX" ||
          item.code === "1100" ||
          item.code === "1110" ||
          item.code === "1180"
      );
      const Code_11XX =
        targets.find((item) => item.code === "11XX")?.value || 0;
      const Code_1100 =
        targets.find((item) => item.code === "1100")?.value || 0;
      const Code_1110 =
        targets.find((item) => item.code === "1110")?.value || 0;
      const Code_1180 =
        targets.find((item) => item.code === "1180")?.value || 0;

      return (
        ((numeral(Code_11XX).value() || 0) -
          (numeral(Code_1100).value() || 0) -
          (numeral(Code_1110).value() || 0) -
          (numeral(Code_1180).value() || 0)) *
        UNIT
      );
    },
  },
  {
    name: "其餘資產",
    field: "otherAssets",
    code: ["1150+ 1160+1170 +1180"],
    drawerLineChart: false,
    calc: (data: ITableItem[]) => {
      const targets = data.filter(
        (item) =>
          item.code === "1150" ||
          item.code === "1160" ||
          item.code === "1170" ||
          item.code === "1180"
      );
      return (
        targets.reduce(
          (acc, item) => acc + (numeral(item.value).value() || 0),
          0
        ) * UNIT
      );
    },
  },
];

export default function CompanyAssets() {
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [chartType, setChartType] = useState(0);
  const [graphData, setGraphData] = useState<IFields[]>([]);
  const chartRef = useRef<Chart>();
  const chartPieRef = useRef<any>();

  const genData = (data: IList[]) => {
    if (!data || data.length === 0) {
      return [];
    }
    const targetTableData = data.map((item) => ({
      data_id: item.securityCode,
      quarter: item.quarter,
      year: item.year,
      data:
        item.tables?.find(
          (subTableItem) => subTableItem.name === TARGET_TABLE_NAME
        )?.data || [],
    }));
    return targetTableData;
  };

  const updateGraphLineChart = (data: IFields[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => {
        return `${item.year}/${quarterToMonth(item.quarter)}`;
      });

      chartRef.current.data.labels = labels;
      TARGET_FIELDS.filter((item) => item.drawerLineChart).forEach(
        ({ field }, index) => {
          if (chartRef.current) {
            chartRef.current.data.datasets[index].data = data.map((item) => {
              return +item[field as keyof IFields] || 0;
            });
          }
        }
      );
      chartRef.current.update();
    }
  };

  const updateGraphPieChart = (data: IFields[]) => {
    if (chartPieRef.current) {
      const chartPieData: number[] = [];
      const labels: string[] = [];

      TARGET_FIELDS.forEach((item) => {
        labels.push(item.name);
        const assets = data.reduce((acc, values) => {
          return acc + Number(values[item.field as keyof IFields] || 0);
        }, 0);
        chartPieData.push(assets);
      });
      chartPieRef.current.data.labels = labels;
      chartPieRef.current.data.datasets[0].data = chartPieData;
      chartPieRef.current.update();
    }
  };

  useEffect(() => {
    if (!stock.No) {
      return;
    }

    ltnApi
      .get(`/financial/dan-yi-gong-si-an-li`, {
        params: {
          securityCode: stock.No,
          yearRange: moment()
            .subtract(period - 1, "year")
            .format("YYYY"),
        },
      })
      .then((rst: any) => {
        if (rst.data) {
          const list: IFields[] = [];
          const data = genData(rst.data.list as IList[]);

          data.forEach((item) => {
            const keyValues: any = {};
            TARGET_FIELDS.forEach((field) => {
              keyValues[field.field] = field.calc(item.data);
            });

            list.push({
              year: item.year,
              quarter: item.quarter,
              data_id: item.data_id,
              ...keyValues,
            });
          });
          setGraphData(list.reverse() || []);
        }
      });
  }, [stock, period]);

  useEffect(() => {
    if (chartType === 0) {
      updateGraphLineChart(graphData);
    } else {
      updateGraphPieChart(graphData);
    }
  }, [graphData, chartType]);

  const columnHeaders = useMemo(() => {
    const headerData: {
      field: string;
      headerName?: string;
      pinned?: string;
    }[] = [
      {
        field: "title",
        headerName: "年度/季度",
        pinned: "left",
      },
    ];
    if (graphData.length === 0) {
      return headerData;
    }
    graphData.forEach((item) => {
      headerData.push({
        field: `${item.year}-${item.quarter}`,
      });
    });
    return headerData;
  }, [graphData]);

  const rowData = useMemo(() => {
    if (graphData.length === 0) {
      return [];
    }
    const rows: any[] = [];
    TARGET_FIELDS.forEach(({ field, name }) => {
      const row: { [key: string]: string } = {
        title: `${name}(千元)`,
        pinned: "left",
      };
      graphData.forEach((item) => {
        const val = +(item[field as keyof IFields] || 0);
        row[`${item.year}-${item.quarter}`] = numeral(val / UNIT).format("0,0");
      });
      rows.push(row);
    });
    return rows;
  }, [graphData]);

  return (
    <Stack rowGap={1}>
      <Box
        bgcolor="#fff"
        borderRadius={{ xs: 0, md: 0, lg: "8px" }}
        p={{ xs: 2, md: 3, lg: 3 }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            "& .period-controller": {
              mb: 0,
            },
            mb: 3,
          }}
        >
          <PeriodController onChangePeriod={setPeriod} showReportType={false} />
          <Stack direction="row" alignItems="center" columnGap={2}>
            <IconButton
              sx={{
                color: chartType === 0 ? "#405DF9" : "#828282",
              }}
              onClick={() => setChartType(0)}
            >
              <SsidChartIcon />
            </IconButton>
            <IconButton
              sx={{
                color: chartType === 1 ? "#405DF9" : "#828282",
              }}
              onClick={() => setChartType(1)}
            >
              <PieChartIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Box bgcolor="#fff">
          <div
            style={{ display: chartType === 0 ? "block" : "none", height: 534 }}
          >
            <ReactChart
              type="line"
              data={labelDataSets}
              options={lineGraphConfig as any}
              ref={chartRef}
            />
          </div>
          <div
            style={{ display: chartType === 1 ? "block" : "none", height: 534 }}
          >
            <ReactChart
              type="pie"
              data={pieChartLabelDataSets}
              ref={chartPieRef}
              options={pieChartConfig as any}
            />
          </div>
        </Box>
      </Box>
      <TagCard tabs={["詳細數據"]}>
        <Box
          className="ag-theme-alpine"
          style={{
            paddingBottom: "24px",
          }}
        >
          <WrappedAgGrid
            columnDefs={columnHeaders as any}
            rowData={rowData}
            defaultColDef={{
              resizable: true,
              minWidth: 200,
              wrapHeaderText: true,
              autoHeaderHeight: true,
            }}
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
