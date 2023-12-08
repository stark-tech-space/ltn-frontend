import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PERIOD } from "types/common";
import { Chart as ReactChart } from "react-chartjs-2";
import { graphConfig } from "./GrapConfig";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import PeriodController from "component/PeriodController";
import { fetchFindMindAPI } from "api/common";
import { useAvgPriceByMonth } from "Hooks/common";
import moment from "moment";
import TagCard from "component/tabCard";
import { getDataLimit } from "until";

interface ISma {
  date: string;
  sma: number;
}

const changeINfo = [
  { label: "單季營收年增率", value: 1 },
  { label: "單季營收季增率", value: 2 },
];

const change4INfo = [
  { label: "近4季營收年增率", value: 1 },
  { label: "近4季營收季增率", value: 2 },
];

interface IMonthlyRevenueGrowth {
  date: string;
  revenue: number;
  revenue_year: number;
  revenue_month: number;
  calendarYear: string;
  period: string;
  quarter: number;
  revenue_year_difference?: number;
  revenue_month_difference?: number;
  revenue_four_month_difference?: number;
  revenue_four_year_difference?: number;
}

const genStartDate = (years: number) => {
  return moment().subtract(years, "years").startOf("year").format("YYYY-MM-DD");
};

function getAllFourData(
  data: IMonthlyRevenueGrowth[],
  preYearData: IMonthlyRevenueGrowth[],
  index: number,
  quarter: number,
) {
  const allData = preYearData.concat(data);
  const allIndex = index + preYearData.length;
  return (
    (allData[allIndex]?.revenue || 0) +
    (allData[allIndex - 1]?.revenue || 0) +
    (allData[allIndex - 2]?.revenue || 0) +
    (allData[allIndex - 3]?.revenue || 0)
  );
}

function generateGraphData(data: IMonthlyRevenueGrowth[], limit: number) {
  const quarterlyData = data.reduce((acc: Array<IMonthlyRevenueGrowth>, cur) => {
    const quarter = Math.floor((cur.revenue_month - 1) / 3) + 1;
    const key = `${cur.revenue_year}-${quarter}`;
    const item = acc.find((item) => item.date === key);
    if (!item) {
      acc.push({
        date: key,
        quarter,
        revenue: cur.revenue,
        calendarYear: cur.calendarYear,
        period: cur.period,
        revenue_month: cur.revenue_month,
        revenue_year: cur.revenue_year,
      });
    } else {
      item.revenue += cur.revenue;
      item.revenue_month = cur.revenue_month;
      item.revenue_year = cur.revenue_year;
      item.calendarYear = cur.calendarYear;
      item.period = cur.period;
    }
    return acc;
  }, []);

  const dataByYear = quarterlyData.reduce(
    (acc: { [key: number]: IMonthlyRevenueGrowth[] }, cur) => {
      const year = cur.revenue_year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(cur);
      return acc;
    },
    {},
  );

  const result = [];

  for (const year in dataByYear) {
    const sortedData = dataByYear[year];
    for (let i = 0; i < sortedData.length; i++) {
      // @ts-ignore
      const prevYearData = dataByYear[year - 1]?.find(
        (item) => item.quarter === sortedData[i].quarter,
      );
      const preMonthData =
        // @ts-ignore
        sortedData[i - 1] || dataByYear[year - 1]?.find((item) => item.quarter === 4);

      const fourAllData = getAllFourData(
        sortedData,
        // @ts-ignore
        dataByYear[year - 1] || [],
        i,
        sortedData[i].quarter,
      );

      const preFourYearAllData = getAllFourData(
        // @ts-ignore
        dataByYear[year - 1] || [],
        // @ts-ignore
        dataByYear[year - 2] || [],
        i,
        sortedData[i].quarter,
      );

      const preFourQuarterAllData = getAllFourData(
        sortedData,
        // @ts-ignore
        dataByYear[year - 1] || [],
        i - 1,
        sortedData[i - 1]?.quarter || 4,
      );

      const allYearData = sortedData.reduce((acc: number, cur) => {
        acc += cur.revenue;
        return acc;
      }, 0);

      // @ts-ignore
      const allYearPreData = (dataByYear[year - 1] || []).reduce((acc: number, cur) => {
        acc += cur.revenue;
        return acc;
      }, 0);

      if (prevYearData) {
        result.push({
          ...sortedData[i],
          revenue_year_difference:
            (sortedData[i].revenue - prevYearData.revenue) / prevYearData.revenue,
          revenue_month_difference:
            (sortedData[i].revenue - preMonthData.revenue) / preMonthData.revenue,
          revenue_four_year_difference: (fourAllData - preFourYearAllData) / preFourYearAllData,
          revenue_four_month_difference:
            (fourAllData - preFourQuarterAllData) / preFourQuarterAllData,
          revenue_year_pre: (allYearData - allYearPreData) / allYearPreData,
        });
      }
    }
  }

  const revResult = result.reverse();
  const res = revResult.slice(0, limit).reverse();
  return res;
}

export default function Graph({ getGraphData }: { getGraphData: (data: any[][]) => void }) {
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);
  const [smaData, setSmaData] = useState<ISma[]>([]);
  const [graphData, setGraphData] = useState<IMonthlyRevenueGrowth[]>([]);
  const avgPrice = useAvgPriceByMonth(period);
  const [title, setTitle] = useState("單季營收年增率");
  const [subTitle, setSubTitle] = useState("近4季營收年增率");
  const [type, setType] = useState(1);

  const changeType = (value: number) => {
    setTitle(changeINfo[value].label);
    setType(changeINfo[value].value);
    setSubTitle(change4INfo[value].label);
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

    if (reportType === PERIOD.QUARTER) {
      data?.forEach((item) => {
        columnHeaders.push({
          field: `${item.calendarYear}-${item.quarter}`,
        });
      });
      const dataSources: { [key: string]: any } = {
        title: title,
      };
      data?.forEach((item) => {
        dataSources[`${item.calendarYear}-${item.quarter}`] =
          type === 1
            ? //@ts-ignore
              +(item.revenue_year_difference * 100).toFixed(2)
            : //@ts-ignore
              +(item.revenue_month_difference * 100).toFixed(2);
      });

      const dataSources2: { [key: string]: any } = {
        title: subTitle,
      };
      data?.forEach((item) => {
        dataSources2[`${item.calendarYear}-${item.quarter}`] =
          type === 1
            ? //@ts-ignore
              +(item.revenue_four_year_difference * 100).toFixed(2)
            : //@ts-ignore
              +(item.revenue_four_month_difference * 100).toFixed(2);
      });
      rowData.push(dataSources);
      rowData.push(dataSources2);
    } else {
      AllYearData?.forEach((item) => {
        columnHeaders.push({
          field: item.calendarYear,
        });
      });
      console.log("AllYearData", AllYearData);
      const dataSources: { [key: string]: any } = {
        title: "營收年增率",
      };
      AllYearData?.forEach((item) => {
        dataSources[`${item.calendarYear}`] = +(
          //@ts-ignore
          (item.revenue_year_pre * 100).toFixed(2)
        );
      });
      rowData.push(dataSources);
      console.log("rowData", rowData);
    }

    return [columnHeaders, rowData];
  };

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(PERIOD.QUARTER, period);
    const rst = await fetchFindMindAPI<any>({
      data_id: stock.No,
      start_date: genStartDate(period + 1),
      dataset: "TaiwanStockMonthRevenue",
    });

    const data = rst.map((item: any) => ({
      ...item,
      calendarYear: moment(item.date).format("YYYY"),
      period: moment(item.date).format("MM"),
    }));
    if (data) {
      const newData = generateGraphData(data, limit);
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
    return {
      datasets: [
        {
          type: "line" as const,
          label: "月均價",
          borderColor: "#EB5757",
          backgroundColor: "#EB5757",
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
          data: smaData.map((item) => ({ x: item.date, y: item.sma })),
          yAxisID: "y",
        },
        {
          type: "line" as const,
          label: title,
          backgroundColor: "#ffe75a",
          data: graphData.map((item) => ({
            x: item.revenue_year + "-" + item.revenue_month,
            y:
              type === 1
                ? //@ts-ignore
                  +(item.revenue_year_difference * 100).toFixed(2)
                : //@ts-ignore
                  +(item.revenue_month_difference * 100).toFixed(2),
          })),
          borderColor: "#ffe75a",
          borderWidth: 1,
          yAxisID: "y1",
          fill: false,
        },
        {
          type: "line" as const,
          label: subTitle,
          backgroundColor: "rgb(0, 99, 232)",
          data: graphData.map((item) => ({
            x: item.revenue_year + "-" + item.revenue_month,
            y:
              type === 1
                ? //@ts-ignore
                  +(item.revenue_four_year_difference * 100).toFixed(2)
                : //@ts-ignore
                  +(item.revenue_four_month_difference * 100).toFixed(2),
          })),
          borderColor: "rgb(0, 99, 232)",
          borderWidth: 1,
          yAxisID: "y1",
          fill: false,
        },
      ],
    };
  }, [graphData, smaData, title, type]);

  const AllYearData = useMemo(() => {
    const seenYears = new Set();
    const filteredData = graphData.filter((item) => {
      if (seenYears.has(item.revenue_year)) {
        return false;
      } else {
        seenYears.add(item.revenue_year);
        return true;
      }
    });
    return filteredData;
  }, [graphData]);

  const graphDataSets2 = useMemo(() => {
    return {
      datasets: [
        {
          type: "line" as const,
          label: "月均價",
          borderColor: "#EB5757",
          backgroundColor: "#EB5757",
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
          data: smaData.map((item) => ({ x: item.date, y: item.sma })),
          yAxisID: "y",
        },
        {
          type: "line" as const,
          label: "營收年增率",
          backgroundColor: "rgb(0, 99, 232)",
          data: AllYearData.map((item) => ({
            x: item.revenue_year + "",
            // @ts-ignore
            y: +(item.revenue_year_pre * 100).toFixed(2),
          })),
          borderColor: "rgb(0, 99, 232)",
          borderWidth: 1,
          yAxisID: "y1",
          fill: false,
        },
      ],
    };
  }, [graphData, smaData]);

  useEffect(() => {
    getGraphData(genGraphTableData(graphData));
  }, [graphData, type, reportType, AllYearData]);

  return (
    <>
      <TagCard
        tabs={["營收年增率", "營收季增率"]}
        onChange={(cur) => {
          changeType(cur);
        }}
      >
        <Box bgcolor="#fff">
          <PeriodController onChangePeriod={setPeriod} onChangeReportType={setReportType} />
          {reportType === PERIOD.QUARTER && (
            <Box height={510} bgcolor="#fff" pb={3}>
              <ReactChart type="line" data={graphDataSets} options={graphConfig as any} />)
            </Box>
          )}

          {reportType === PERIOD.ANNUAL && (
            <Box height={510} bgcolor="#fff" pb={3}>
              <ReactChart type="line" data={graphDataSets2} options={graphConfig as any} />
            </Box>
          )}
        </Box>
      </TagCard>
    </>
  );
}
