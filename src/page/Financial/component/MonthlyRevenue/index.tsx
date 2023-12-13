import { Stack, Box } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import TagCard from "../../../../component/tabCard";
import MonthlyIncomeChart from "./MonthlyGraph";
import PerStockIncomeChart from "./PerIncomeGraph";
import { AgGridReact } from "ag-grid-react";

export default function EarningsPerShare() {
  const [tabIndex, setTabIndex] = useState(0);
  const [graphData1, setGraphData1] = useState<any[][]>([]);
  const [graphData2, setGraphData2] = useState<any[][]>([]);

  const gridref = useRef<AgGridReact>(null);

  const [columnHeaders, rowData] = useMemo(() => {
    return tabIndex === 0 ? graphData1 : graphData2;
  }, [tabIndex, graphData1, graphData2]);

  useEffect(() => {
    if (gridref.current && columnHeaders?.length) {
      const lastRowIndex = columnHeaders[columnHeaders.length - 1];
      gridref.current.api.ensureColumnVisible(lastRowIndex.field, "end");
    }
  }, [columnHeaders]);

  return (
    <Stack rowGap={1}>
      <TagCard tabs={["每月營收", "月每股營收"]} onChange={setTabIndex}>
        <Box bgcolor="#fff">
          {tabIndex === 0 ? (
            <div>
              <MonthlyIncomeChart getGraphData={setGraphData1} />
            </div>
          ) : (
            <div style={{ display: tabIndex === 1 ? "block" : "none" }}>
              <PerStockIncomeChart getGraphData={setGraphData2} />
            </div>
          )}
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
            rowData={rowData || []}
            ref={gridref}
            columnDefs={(columnHeaders as any) || []}
            defaultColDef={{
              resizable: false,
              initialWidth: 200,
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
