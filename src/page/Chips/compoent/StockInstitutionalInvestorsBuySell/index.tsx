import React from "react";
import { Box, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import TagCard from "component/tabCard";
import { AgGridReact } from "ag-grid-react";
import GraphForeignInvestorsSelf from "./GraphForeignInvestorsSelf";
// import GraphForeignInvestors from "./GraphForeignInvestors";

export default function StockInstitutionalInvestorsBuySell() {
  // const [tabIndex, setTabIndex] = useState(0);
  const [graphData1, setGraphData1] = useState<any>([]);
  // const [graphData2, setGraphData2] = useState<any>([]);

  const [columnHeader, rowData] = useMemo(() => graphData1, [graphData1]);

  return (
    <Stack rowGap={1}>
      <TagCard tabs={["三大買賣超"]}>
        <GraphForeignInvestorsSelf getGraphData={setGraphData1} />
      </TagCard>

      <TagCard tabs={["詳細數據"]}>
        <Box className="ag-theme-alpine" pb={3}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnHeader}
            defaultColDef={{
              resizable: true,
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
