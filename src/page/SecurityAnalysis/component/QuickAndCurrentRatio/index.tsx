import { Stack, Box, Button, ButtonGroup } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { Chart as ReactChart } from "react-chartjs-2";
import { Chart } from "chart.js";

import TagCard from "../../../../component/tabCard";
import { RATIO_DATASET, RATIO_GRAPH_CONFIG } from "./GrapConfig";
import { PERIOD, PERIOD_YEAR } from "types/common";

import { currentStock } from "recoil/selector";
import { useRecoilValue } from "recoil";

import { fetchSecurityRatio } from "api/security";
import PeriodController from "component/PeriodController";
import { getDataLimit } from "until";
import { ISecurityRatio } from "types/security";
import numeral from "numeral";
import moment from "moment";
import WrappedAgGrid from "component/WrappedAgGrid";
import { fetchDanYiGongSiAnLi } from "api/financial";
import UnAvailable from "component/UnAvailable";

const GRAPH_FIELDS = [
  {
    field: "currentRatio",
    headerName: "流動比",
  },
  {
    field: "quickRatio",
    headerName: "速動比",
  },
];

export default function QuickAndCurrentRatio() {
  const stock = useRecoilValue(currentStock);

  const chartRef = useRef<Chart>();

  const [tabIndex, setTabIndex] = useState(0);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);
  const [period, setPeriod] = useState(3);
  const [data, setData] = useState<Array<ISecurityRatio>>([]);
  const [isUnAvailable, setIsUnAvailable] = useState<boolean>(false);

  const updateGraph = (data: ISecurityRatio[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => +item[field as keyof ISecurityRatio]
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
    data?.forEach((item) => {
      columns.push({
        field:
          reportType === PERIOD.QUARTER
            ? `${item.calendarYear}-${item.period}`
            : item.calendarYear,
      });
    });
    return columns;
  }, [data, reportType]);

  const tableRowData = useMemo(() => {
    const rowData: any[] = [];

    GRAPH_FIELDS.forEach(({ field, headerName }) => {
      const dataSources: { [key: string]: any } = {
        title: headerName,
      };

      data?.forEach((item) => {
        if (reportType === PERIOD.ANNUAL) {
          dataSources[item.calendarYear] = numeral(
            item[field as keyof ISecurityRatio]
          ).format("0,0.00");
        } else {
          dataSources[`${item.calendarYear}-${item.period}`] = numeral(
            item[field as keyof ISecurityRatio]
          ).format("0,0.00");
        }
      });
      rowData.push(dataSources);
    });
    return rowData;
  }, [data, reportType]);

  useEffect(() => {
    fetchDanYiGongSiAnLi({
      securityCode: stock.No,
      size: 1,
    }).then((res) => {
      if (res?.list && res.list[0]) {
        const balanceTable = res.list[0].tables.find(
          ({ name }) => name === "資產負債表"
        );
        //  流動資產合計
        const currentAssets = parseInt(
          balanceTable?.data
            .find(
              ({ code, name }) => code === "11XX" || name === "流動資產合計"
            )
            ?.value.replaceAll(",", "") || ""
        );

        if (!currentAssets) {
          setIsUnAvailable(true);
        }
      }
    });
  }, []);

  useEffect(() => {
    const limit = getDataLimit(reportType, period);
    fetchSecurityRatio<Array<ISecurityRatio>>(
      stock.Symbol,
      reportType,
      limit
    ).then((rst) => {
      if (rst) {
        const data = rst.map((item) => ({
          ...item,
          currentRatio: item.currentRatio * 100,
          quickRatio: item.quickRatio * 100,
          date: moment(item.date, "YYYY-MM-DD")
            .startOf("quarter")
            .format("YYYY-MM-DD"),
        }));
        setData(data || []);
        updateGraph(data || []);
      }
    });
  }, [stock.Symbol, reportType, period]);

  if (isUnAvailable) {
    return <UnAvailable />;
  }

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
