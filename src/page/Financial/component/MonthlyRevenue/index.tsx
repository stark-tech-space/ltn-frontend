import { Stack, Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import TagCard from "../../../../component/tabCard";
import MonthlyIncomeChart from "./MonthlyGraph";
import PerStockIncomeChart from "./PerIncomeGraph";
import { AgGridReact } from "ag-grid-react";
import numeral from "numeral";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { fetchPerQuarterStocks } from "api/common";
import { getBeforeYears } from "until";
// import { useFetchIndicators } from "Hooks/common";

export default function EarningsPerShare() {
  const stock = useRecoilValue(currentStock);
  const [tabIndex, setTabIndex] = useState(0);
  const [graphData1, setGraphData1] = useState<any[][]>([]);
  const [graphData2, setGraphData2] = useState<any[][]>([]);

  const [columnHeaders, rowData] = useMemo(() => {
    return tabIndex === 0 ? graphData1 : graphData2;
  }, [tabIndex, graphData1, graphData2]);

  return (
    <Stack rowGap={1}>
      <TagCard tabs={["每月營收", "月每股營收"]} onChange={setTabIndex}>
        <Box bgcolor="#fff">
          <div style={{ display: tabIndex === 0 ? "block" : "none" }}>
            <MonthlyIncomeChart getGraphData={setGraphData1} />
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
            rowData={rowData || []}
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
