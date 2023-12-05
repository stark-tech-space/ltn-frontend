import { Stack, Box } from "@mui/material";
import { useMemo, useState } from "react";
import TagCard from "../../../../component/tabCard";
import MonthlyIncomeChart from "./MonthlyGraph";
import PerStockIncomeChart from "./PerIncomeGraph";
import { AgGridReact } from "ag-grid-react";
import numeral from "numeral";
import { useFetchIndicators } from "Hooks/common";

export default function EarningsPerShare() {
  const [tabIndex, setTabIndex] = useState(0);

  const [graphData, setGraphData] = useState<
    { date: string; revenue: number }[]
  >([]);

  const indicators = useFetchIndicators();

  const defaultColDef = useMemo(() => {
    return {
      resizable: false,
      initialWidth: 200,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    };
  }, []);

  const columnHeaders = useMemo(() => {
    return graphData?.map((item, index) => {
      if (index === 0) {
        return {
          field: "title",
          headerName: "年度/季度",
          pinned: "left",
        };
      }
      return {
        field: item.date.slice(0, -3),
      };
    });
  }, [graphData]);

  const tableRowData = useMemo(() => {
    const dataSources: { [key: string]: any } = {};
    graphData?.forEach((item, index) => {
      if (index === 0) {
        dataSources["title"] = "每月營收";
      } else {
        dataSources[item.date.slice(0, -3)] = numeral(item.revenue).format(
          "0,0"
        );
      }
    });
    return [dataSources];
  }, [graphData]);

  return (
    <Stack rowGap={1}>
      <TagCard tabs={["每月營收", "月每股營收"]} onChange={setTabIndex}>
        <Box bgcolor="#fff">
          <div style={{ display: tabIndex === 0 ? "block" : "none" }}>
            <MonthlyIncomeChart getGraphData={setGraphData} />
          </div>
          <div style={{ display: tabIndex === 1 ? "block" : "none" }}>
            <PerStockIncomeChart />
          </div>
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
            rowData={tableRowData}
            columnDefs={columnHeaders as any}
            defaultColDef={defaultColDef}
            domLayout="autoHeight"
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
