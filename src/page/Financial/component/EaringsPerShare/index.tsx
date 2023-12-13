import { Stack, Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TagCard from "../../../../component/tabCard";

import { AgGridReact } from "ag-grid-react";
import { PERIOD } from "types/common";
import { Chart } from "react-chartjs-2";
import { OPTIONS } from "./GraphConfig";

import { getDataLimit } from "until";
import { fetchKeyMetrics } from "api/common";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import PeriodController from "component/PeriodController";
import { useAvgPriceByMonth } from "Hooks/common";
import { IEaringPerShare } from "types/financial";
import { maxBy, minBy } from "lodash";
import moment from "moment";
import { useTable } from "Hooks/useTable";

function getAnnualData(rst: IEaringPerShare[], allPeriod: number) {
  const newRst = rst.map((item, index, arr) => {
    const nextItems = arr.slice(index + 1, index + 4);
    const newNetIncomePerShare = nextItems.reduce(
      (sum, currentItem) => sum + currentItem.netIncomePerShare,
      item.netIncomePerShare,
    );
    return { ...item, netIncomePerShare: newNetIncomePerShare };
  });
  return newRst.reverse().slice(0, allPeriod);
}

interface ISma {
  date: string;
  sma: number;
}

export default function EarningsPerShare() {
  const stock = useRecoilValue(currentStock);
  const [tabIndex, setTabIndex] = useState(0);

  const title = useMemo(() => {
    if (tabIndex === 0) {
      return "單季度EPS";
    } else {
      return "近4季累積EPS";
    }
  }, [tabIndex]);

  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);
  const [graphData, setGraphData] = useState<IEaringPerShare[]>([]);
  const [smaData, setSmaData] = useState<ISma[]>([]);
  const [gridReady, setGridReady] = useState(false);

  const avgPrice = useAvgPriceByMonth(period);

  const allPeriod = useMemo(() => {
    return getDataLimit(reportType, period);
  }, [reportType, period]);

  const fetchGraphData = useCallback(async () => {
    const limit = getDataLimit(reportType, period, tabIndex === 0 ? 0 : 3);
    const rst = await fetchKeyMetrics(stock.Symbol, reportType, limit);
    const data = rst?.map((item) => ({
      ...item,
      date: moment(item.date, "YYYY-MM-DD").startOf("quarter").format("YYYY-MM-DD"),
    }));
    data && setGraphData(data.reverse() as any);
  }, [period, reportType, stock, tabIndex]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData, tabIndex]);

  const columnHeaders = useMemo(() => {
    const columns: any[] = [
      {
        field: "title",
        headerName: reportType === PERIOD.QUARTER ? "年度/季度" : "年度",
        pinned: "left",
      },
    ];
    graphData?.forEach((item) => {
      columns.push({
        field:
          reportType === PERIOD.QUARTER ? `${item.calendarYear}-${item.period}` : item.calendarYear,
      });
    });
    return columns;
  }, [graphData, reportType]);

  const gridRef = useRef<AgGridReact>(null);

  useTable(gridRef, columnHeaders, gridReady);

  const tableRowData = useMemo(() => {
    const dataSources: { [key: string]: any } = {
      title: reportType === PERIOD.QUARTER ? "單季EPS" : "EPS",
    };
    graphData?.forEach((item) => {
      if (reportType === PERIOD.ANNUAL) {
        dataSources[item.calendarYear] = item.netIncomePerShare.toFixed(2);
      } else {
        dataSources[`${item.calendarYear}-${item.period}`] = item.netIncomePerShare.toFixed(2);
      }
    });
    return [dataSources];
  }, [graphData, reportType]);

  const netIncomePerShareDataSets = useMemo(() => {
    if (tabIndex === 1 && reportType === PERIOD.QUARTER) {
      return getAnnualData(graphData, allPeriod);
    } else {
      return graphData;
    }
  }, [graphData, tabIndex, allPeriod]);

  const graphDataSets = useMemo(() => {
    const minDateInData = minBy(netIncomePerShareDataSets, "date")?.date || "";
    const maxDateInData = moment(maxBy(netIncomePerShareDataSets, "date")?.date, "YYYY-MM-DD")
      .add(1, "day")
      .format("YYYY-MM-DD");

    const avgPrice = smaData.filter(
      (item) => item.date > minDateInData && item.date <= maxDateInData,
    );

    return {
      datasets: [
        {
          type: "line" as const,
          label: "月均價",
          borderColor: "#EB5757",
          backgroundColor: "#EB5757",
          borderWidth: 2,
          fill: false,
          data: avgPrice.map((item) => ({ x: item.date, y: item.sma })),
          yAxisID: "y1",
        },
        {
          type: "bar" as const,
          label: title,
          backgroundColor: "#f6e1b1",
          borderColor: "#e8af00",
          data: netIncomePerShareDataSets.map((item) => ({
            x: item.date,
            y: +item.netIncomePerShare.toFixed(2),
          })),
          borderWidth: 1,
          yAxisID: "y",
          fill: false,
        },
      ],
    };
  }, [graphData, title, netIncomePerShareDataSets, smaData]);

  useEffect(() => {
    if (avgPrice.length > 0) {
      setSmaData(avgPrice);
    }
  }, [avgPrice]);

  return (
    <Stack rowGap={1}>
      <TagCard tabs={["單季EPS", "近4季累積EPS"]} onChange={setTabIndex}>
        <PeriodController
          onChangePeriod={setPeriod}
          onChangeReportType={setReportType}
          showReportType={false}
        />
        <Box height={510} bgcolor="#fff" pb={3}>
          {tabIndex === 0 && <Chart type="bar" data={graphDataSets} options={OPTIONS as any} />}
          {tabIndex === 1 && <Chart type="bar" data={graphDataSets} options={OPTIONS as any} />}
        </Box>
      </TagCard>
      <TagCard tabs={["詳細數據"]}>
        <Box
          className="ag-theme-alpine"
          style={{
            paddingBottom: "24px",
          }}
        >
          <AgGridReact
            ref={gridRef}
            onGridReady={() => setGridReady(true)}
            rowData={tableRowData as any}
            columnDefs={columnHeaders as any}
            defaultColDef={{
              resizable: true,
              minWidth: 200,
              flex: 1,
              wrapHeaderText: true,
              autoHeaderHeight: true,
            }}
            domLayout="autoHeight"
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
