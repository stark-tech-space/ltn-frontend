import { Stack, Box } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { Chart as ReactChart } from "react-chartjs-2";
import { Chart } from "chart.js";

import TagCard from "../../../../component/tabCard";
import WrappedAgGrid from "component/WrappedAgGrid";
import PeriodController from "component/PeriodController";
import { RATIO_DATASET, RATIO_GRAPH_CONFIG } from "./GrapConfig";
import { PERIOD } from "types/common";

import { currentStock } from "recoil/selector";
import { useRecoilValue } from "recoil";

import { getBeforeYears } from "until";
import numeral from "numeral";
import moment from "moment";
import { fetchFindMindAPI } from "api/common";
import { groupBy } from "lodash";

const GRAPH_FIELDS = [
  {
    field: "TIE",
    headerName: "利息保障倍數",
  },
];

interface ITIE {
  calendarYear: string;
  month: string;
  period: string;
  date: string;
  tie: string;
}

export default function TimesInterestEarned() {
  const stock = useRecoilValue(currentStock);

  const chartRef = useRef<Chart>();

  const [tabIndex, setTabIndex] = useState(0);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);
  const [period, setPeriod] = useState(3);
  const [ties, setTIE] = useState<Array<ITIE>>([]);
  const [finMindData, setFinMindData] = useState<Array<Record<string, number>>>(
    []
  );

  const updateGraph = (data: ITIE[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map((item) =>
            parseFloat(item.tie)
          );
        }
      });
      chartRef.current.update();
    }
  };

  const columnHeaders = useMemo(() => {
    const columns: any[] = [
      {
        field: "title",
        headerName: reportType === PERIOD.QUARTER ? "年度/季度" : "年度",
        pinned: "left",
      },
    ];
    ties?.forEach((item) => {
      columns.push({
        field:
          reportType === PERIOD.QUARTER
            ? `${item.calendarYear}-${item.period}`
            : item.calendarYear,
      });
    });
    return columns;
  }, [ties, reportType]);

  const tableRowData = useMemo(() => {
    const rowData: any[] = [];

    GRAPH_FIELDS.forEach(({ field, headerName }) => {
      const dataSources: { [key: string]: any } = {
        title: headerName,
      };

      ties?.forEach((item) => {
        if (reportType === PERIOD.ANNUAL) {
          //TODO
        } else {
          dataSources[`${item.calendarYear}-${item.period}`] = item.tie;
        }
      });
      rowData.push(dataSources);
    });
    return rowData;
  }, [ties, reportType]);

  useEffect(() => {
    fetchFindMindAPI<{ type: string; date: string; value: number }[]>({
      data_id: stock.No,
      dataset: "TaiwanStockCashFlowsStatement",
      start_date: getBeforeYears(period - 1),
    }).then((res) => {
      const dataArrayByDate = groupBy(res, "date");
      console.log("dataArrayByDate", dataArrayByDate);
      const data = Object.entries(dataArrayByDate)
        .map(([date, values]) => {
          const dateMoment = moment(date).startOf("quarter");
          return Object.assign(
            Object.fromEntries(values.map((item) => [item.type, item.value])),
            {
              date: dateMoment.format("YYYY-MM-DD"),
              calendarYear: dateMoment.format("YYYY"),
              month: dateMoment.format("MM"),
              period: dateMoment.format("Q"),
            }
          );
        })
        .sort((a, b) => (a.date > b.date ? 1 : -1));
      if (reportType === PERIOD.QUARTER) {
        const ties = data.map((item) => ({
          calendarYear: item.calendarYear,
          month: item.month,
          period: item.period,
          date: item.date,
          tie: numeral(
            (item.NetIncomeBeforeTax + item.InterestExpense) /
              item.InterestExpense
          ).format("0,0.00"),
        }));
        setTIE(ties);
        updateGraph(ties);
      }
      if (reportType === PERIOD.ANNUAL) {
        // TODO
      }
      setFinMindData(data);
    });
  }, [stock.No, reportType, period]);

  return (
    <Stack rowGap={1}>
      <Box bgcolor="#fff" p={3} borderRadius="8px">
        <PeriodController
          onChangePeriod={setPeriod}
          onChangeReportType={setReportType}
        />
        <Box height={510}>
          <ReactChart
            type="line"
            data={RATIO_DATASET}
            options={RATIO_GRAPH_CONFIG as any}
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
          <WrappedAgGrid
            rowData={tableRowData}
            columnDefs={columnHeaders as any}
            defaultColDef={{
              resizable: false,
              initialWidth: 200,
              wrapHeaderText: true,
              autoHeaderHeight: true,
            }}
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
