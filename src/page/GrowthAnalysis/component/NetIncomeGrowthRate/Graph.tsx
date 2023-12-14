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
import { findMindDataToFmpData, getBeforeYears, getDataLimit } from "until";
import { minBy, maxBy } from "lodash";
import numeral from "numeral";
import UnAvailable from "component/UnAvailable";

interface ISma {
  date: string;
  sma: number;
}

const changeINfo = [
  { label: "單季稅後淨利年增率", value: 1 },
  { label: "單季稅後淨利季增率", value: 2 },
];

const change4INfo = [
  { label: "近4季稅後淨利年增率", value: 1 },
  { label: "近4季稅後淨利季增率", value: 2 },
];

interface IMonthlyRevenueGrowth {
  date: string;
  IncomeAfterTaxes: number;
  calendarYear: string;
  quarter: number;
  period: string;
  revenue_year_difference?: number;
  revenue_month_difference?: number;
  revenue_four_month_difference?: number;
  revenue_four_year_difference?: number;
  revenue_year_pre?: number;
}

const genStartDate = (years: number) => {
  return moment().subtract(years, "years").startOf("year").format("YYYY-MM-DD");
};

function getAllFourData(
  data: IMonthlyRevenueGrowth[],
  preYearData: IMonthlyRevenueGrowth[],
  index: number,
  quarter: number
) {
  const allData = preYearData.concat(data);
  const allIndex = index + preYearData.length;
  return (
    (allData[allIndex]?.IncomeAfterTaxes || 0) +
    (allData[allIndex - 1]?.IncomeAfterTaxes || 0) +
    (allData[allIndex - 2]?.IncomeAfterTaxes || 0) +
    (allData[allIndex - 3]?.IncomeAfterTaxes || 0)
  );
}

function generateGraphData(data: IMonthlyRevenueGrowth[], limit: number) {
  const dataByYear = data.reduce(
    (acc: { [key: string]: IMonthlyRevenueGrowth[] }, cur) => {
      const year = cur.calendarYear;
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
    const sortedData = dataByYear[year];
    for (let i = 0; i < sortedData.length; i++) {
      // @ts-ignore
      const prevYearData = dataByYear[year - 1]?.find(
        (item) => item.period === sortedData[i].period
      );
      const preMonthData =
        // @ts-ignore
        sortedData[i - 1] || maxBy(dataByYear[year - 1] || [], "period");

      const fourAllData = getAllFourData(
        sortedData,
        // @ts-ignore
        dataByYear[year - 1] || [],
        i,
        sortedData[i].quarter
      );

      const preFourYearAllData = getAllFourData(
        // @ts-ignore
        dataByYear[year - 1] || [],
        // @ts-ignore
        dataByYear[year - 2] || [],
        i,
        sortedData[i].quarter
      );

      const preFourQuarterAllData = getAllFourData(
        sortedData,
        // @ts-ignore
        dataByYear[year - 1] || [],
        i - 1,
        sortedData[i - 1]?.quarter || 4
      );

      const allYearData = sortedData.reduce((acc: number, cur) => {
        acc += cur.IncomeAfterTaxes;
        return acc;
      }, 0);

      // @ts-ignore
      const allYearPreData = (dataByYear[year - 1] || []).reduce(
        (acc: number, cur) => {
          acc += cur.IncomeAfterTaxes;
          return acc;
        },
        0
      );

      if (prevYearData) {
        result.push({
          ...sortedData[i],
          revenue_year_difference:
            (sortedData[i].IncomeAfterTaxes - prevYearData.IncomeAfterTaxes) /
            prevYearData.IncomeAfterTaxes,
          revenue_month_difference:
            (sortedData[i].IncomeAfterTaxes - preMonthData.IncomeAfterTaxes) /
            preMonthData.IncomeAfterTaxes,
          revenue_four_year_difference:
            (fourAllData - preFourYearAllData) / preFourYearAllData,
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
  const [title, setTitle] = useState("單季稅後淨利年增率");
  const [subTitle, setSubTitle] = useState("近4季稅後淨利年增率");
  const [type, setType] = useState(1);
  const [isUnlivable, setIsUnlivable] = useState(false);

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
        dataSources[`${item.calendarYear}-${item.quarter}`] = numeral(
          type === 1
            ? //@ts-ignore
              +(item.revenue_year_difference * 100)
            : //@ts-ignore
              +(item.revenue_month_difference * 100)
        ).format("0,0.00");
      });

      const dataSources2: { [key: string]: any } = {
        title: subTitle,
      };
      data?.forEach((item) => {
        dataSources2[`${item.calendarYear}-${item.quarter}`] = numeral(
          type === 1
            ? //@ts-ignore
              +(item.revenue_four_year_difference * 100)
            : //@ts-ignore
              +(item.revenue_four_month_difference * 100)
        ).format("0,0.00");
      });
      rowData.push(dataSources);
      rowData.push(dataSources2);
    } else {
      AllYearData?.forEach((item) => {
        columnHeaders.push({
          field: item.calendarYear,
        });
      });
      const dataSources: { [key: string]: any } = {
        title: "稅後淨利年增率",
      };
      AllYearData?.forEach((item) => {
        dataSources[`${item.calendarYear}`] = +(
          //@ts-ignore
          numeral(item.revenue_year_pre * 100).format("0,0.00")
        );
      });
      rowData.push(dataSources);
    }

    return [columnHeaders, rowData];
  };

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(PERIOD.QUARTER, period);
    const rst = await fetchFindMindAPI<any>({
      data_id: stock.No,
      dataset: "TaiwanStockFinancialStatements",
      start_date: getBeforeYears(period + 2),
    });

    const data = rst.map((item: any) => {
      const dateMoment = moment(item.date).startOf("quarter");
      item.date = dateMoment.format("YYYY-MM-DD");
      return {
        ...findMindDataToFmpData(item),
        quarter: +moment(item.date).format("Q"),
      };
    });
    if (data) {
      const realData = data.filter(
        (item: any) => item.IncomeAfterTaxes && item.IncomeAfterTaxes !== 0
      );
      if (realData && realData.length === 0) {
        setIsUnlivable(true);
      }
      const newData = generateGraphData(realData, limit);
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
        },
        {
          type: "line" as const,
          label: title,
          backgroundColor: "rgb(229, 166, 0)",
          data: graphData.map((item) => ({
            x: item.calendarYear + "-" + item.period,
            y: numeral(
              type === 1
                ? //@ts-ignore
                  +(item.revenue_year_difference * 100)
                : //@ts-ignore
                  +(item.revenue_month_difference * 100)
            ).format("0,0.00"),
          })),
          borderColor: "rgb(229, 166, 0)",
          borderWidth: 2,
          yAxisID: "y1",
          fill: false,
        },
        {
          type: "line" as const,
          label: subTitle,
          backgroundColor: "rgb(7, 123, 242)",
          data: graphData.map((item) => ({
            x: item.calendarYear + "-" + item.period,
            y: numeral(
              type === 1
                ? //@ts-ignore
                  +(item.revenue_four_year_difference * 100)
                : //@ts-ignore
                  +(item.revenue_four_month_difference * 100)
            ).format("0,0.00"),
          })),
          borderColor: "rgb(7, 123, 242)",
          borderWidth: 2,
          yAxisID: "y1",
          fill: false,
        },
      ],
    };
  }, [graphData, smaData, title, type]);

  const AllYearData = useMemo(() => {
    const seenYears = new Set();
    const filteredData = graphData.filter((item) => {
      if (seenYears.has(item.revenue_year_pre)) {
        return false;
      } else {
        seenYears.add(item.revenue_year_pre);
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
          data: smaData.map((item) => ({
            x: item.date,
            y: numeral(item.sma).format("0,0.00"),
          })),
          yAxisID: "y",
        },
        {
          type: "line" as const,
          label: "稅後淨利年增率",
          backgroundColor: "rgb(0, 99, 232)",
          data: AllYearData.map((item) => ({
            x: item.calendarYear + "",
            // @ts-ignore
            y: numeral(+(item.revenue_year_pre * 100)).format("0,0.00"),
          })),
          borderColor: "rgb(0, 99, 232)",
          borderWidth: 2,
          yAxisID: "y1",
          fill: false,
        },
      ],
    };
  }, [graphData, smaData]);

  useEffect(() => {
    getGraphData(genGraphTableData(graphData));
  }, [graphData, type, reportType, AllYearData]);

  if (isUnlivable) {
    return <UnAvailable />;
  }

  return (
    <>
      <TagCard
        tabs={["稅後淨利年增率", "稅後淨利季增率"]}
        onChange={(cur) => {
          changeType(cur);
        }}
      >
        <Box bgcolor="#fff">
          <PeriodController
            onChangePeriod={setPeriod}
            onChangeReportType={setReportType}
          />
          {reportType === PERIOD.QUARTER && (
            <Box height={510} bgcolor="#fff" pb={3}>
              <ReactChart
                type="line"
                data={graphDataSets}
                options={graphConfig as any}
              />
            </Box>
          )}

          {reportType === PERIOD.ANNUAL && (
            <Box height={510} bgcolor="#fff" pb={3}>
              <ReactChart
                type="line"
                data={graphDataSets2}
                options={graphConfig as any}
              />
            </Box>
          )}
        </Box>
      </TagCard>
    </>
  );
}
