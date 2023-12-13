import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig } from "./GrapConfig";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import PeriodController from "component/PeriodController";
import { fetchFindMindAPI } from "api/common";
import { useAvgPriceByMonth, useGetStockCountByMonth } from "Hooks/common";
import moment from "moment";
import TagCard from "component/tabCard";
import { minBy, maxBy } from "lodash";
import numeral from "numeral";

interface ISma {
  date: string;
  sma: number;
}

const changeINfo = [
  { label: "單月營收年增率", value: 1 },
  { label: "單月每股營收年增率", value: 2 },
  { label: "單月營收月增率", value: 3 },
];

interface IMonthlyRevenueGrowth {
  date: string;
  revenue: number;
  revenue_year: number;
  revenue_month: number;
  calendarYear: number;
  period: number;
  revenue_year_difference: number;
  revenue_year_per_difference: number;
  revenue_month_difference: number;
}

const genStartDate = (years: number) => {
  return moment().subtract(years, "years").startOf("year").format("YYYY-MM-DD");
};

function generateGraphData(
  data: IMonthlyRevenueGrowth[],
  getStockCountByDate: any
) {
  const dataByYear = data.reduce(
    (acc: { [key: number]: IMonthlyRevenueGrowth[] }, cur) => {
      const year = cur.revenue_year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(cur);
      return acc;
    },
    {}
  );

  const result = [];

  for (const year in dataByYear) {
    const sortedData = dataByYear[year].sort(
      (a, b) => a.revenue_month - b.revenue_month
    );
    for (let i = 0; i < sortedData.length; i++) {
      // @ts-ignore
      const prevYearData = dataByYear[year - 1]?.find(
        (item) => item.revenue_month === sortedData[i].revenue_month
      );
      const preMonthData =
        // @ts-ignore
        sortedData[i - 1] ||
        dataByYear[Number(year) - 1]?.find((item) => item.revenue_month === 12);

      if (prevYearData) {
        const avgStockCount: any = getStockCountByDate(sortedData[i].date);
        const perAvgStockCount: any = getStockCountByDate(prevYearData.date);
        result.push({
          ...sortedData[i],
          revenue_year_difference:
            (sortedData[i].revenue - prevYearData.revenue) /
            prevYearData.revenue,
          revenue_year_per_difference:
            (sortedData[i].revenue /
              (avgStockCount ? avgStockCount.StockCount : 1) -
              prevYearData.revenue /
                (perAvgStockCount ? perAvgStockCount.StockCount : 1)) /
            prevYearData.revenue /
            (perAvgStockCount ? perAvgStockCount.StockCount : 1),
          revenue_month_difference:
            (sortedData[i].revenue - preMonthData.revenue) /
            preMonthData.revenue,
        });
      }
    }
  }
  return result;
}

export default function Graph({
  getGraphData,
}: {
  getGraphData: (data: any[][]) => void;
}) {
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);
  const [smaData, setSmaData] = useState<ISma[]>([]);
  const [graphData, setGraphData] = useState<IMonthlyRevenueGrowth[]>([]);
  const avgPrice = useAvgPriceByMonth(period);
  const getStockCountByDate = useGetStockCountByMonth();
  const [title, setTitle] = useState("單月營收年增率");
  const [type, setType] = useState(1);

  const changeType = (title: string, value: number) => {
    setTitle(title);
    setType(value);
  };

  const genGraphTableData = (data: IMonthlyRevenueGrowth[]) => {
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

    const dataSources: { [key: string]: any } = {
      title: title,
    };
    data?.forEach((item) => {
      dataSources[`${item.calendarYear}-${item.period}`] = numeral(
        +(type !== 3
          ? item.revenue_year_difference
          : item.revenue_month_difference) * 100
      ).format("0,0.00");
    });
    rowData.push(dataSources);
    return [columnHeaders, rowData];
  };

  const fetchGraphData = useCallback(async () => {
    const rst = await fetchFindMindAPI<any>({
      data_id: stock.No,
      start_date: genStartDate(period),
      dataset: "TaiwanStockMonthRevenue",
    });

    const data = rst.map((item: any) => {
      const dateMoment = moment(item.date).subtract(1, "month");
      return {
        ...item,
        date: dateMoment.format("YYYY-MM-DD"),
        calendarYear: dateMoment.format("YYYY"),
        period: dateMoment.format("MM"),
      };
    });
    if (data) {
      const newData = generateGraphData(data, getStockCountByDate);
      setGraphData(newData);
    }
  }, [stock, period, reportType, getGraphData]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  useEffect(() => {
    if (avgPrice.length > 0) {
      setSmaData(avgPrice);
    }
  }, [avgPrice]);

  const graphDataSets = useMemo(() => {
    const minDateInData =
      moment(minBy(graphData, "date")?.date, "YYYY-MM-DD")
        .subtract(1, "month")
        .format("YYYY-MM-DD") || "";
    const maxDateInData = moment(maxBy(graphData, "date")?.date, "YYYY-MM-DD")
      .add(1, "day")
      .format("YYYY-MM-DD");

    const avgPrice = smaData.filter(
      (item) => item.date > minDateInData && item.date <= maxDateInData
    );
    return {
      datasets: [
        {
          type: "line" as const,
          label: "月均價",
          borderColor: "rgb(196,66,66)",
          backgroundColor: "rgb(196,66,66)",
          borderWidth: 2,
          fill: false,
          data: avgPrice.map((item) => ({
            x: item.date,
            y: numeral(item.sma).format("0,0.00"),
          })),
          yAxisID: "y",
          tension: 0.4,
        },
        {
          type: "line" as const,
          label: title,
          backgroundColor: "rgb(229, 166, 0)",
          data: graphData.map((item) => ({
            x: item.date + "",
            y: numeral(
              (type !== 3
                ? item.revenue_year_difference
                : item.revenue_month_difference) * 100
            ).format("0,0.00"),
          })),
          borderColor: "rgb(229, 166, 0)",
          borderWidth: 2,
          yAxisID: "y1",
          fill: false,
          tension: 0,
        },
      ],
    };
  }, [graphData, smaData, title, type]);

  useEffect(() => {
    getGraphData(genGraphTableData(graphData));
  }, [graphData, type]);

  return (
    <>
      <TagCard
        tabs={["單月營收年增率", "單月每股營收年增率", "單月營收月增率"]}
        onChange={(cur) => {
          changeType(changeINfo[cur].label, changeINfo[cur].value);
        }}
      >
        <Box bgcolor="#fff">
          <PeriodController
            onChangePeriod={setPeriod}
            onChangeReportType={setReportType}
            showReportType={false}
          />
          <Box height={510} bgcolor="#fff" pb={3}>
            <ReactChart
              type="line"
              data={graphDataSets}
              options={graphConfig as any}
            />
          </Box>
        </Box>
      </TagCard>
    </>
  );
}
