import React from "react";
import { Box, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import TagCard from "component/tabCard";
import { AgGridReact } from "ag-grid-react";
import Graph1 from "./graph1";

export default function StockInstitutionalInvestorsBuySell() {
  const [tabIndex, setTabIndex] = useState(0);
  const [graphData1, setGraphData1] = useState<any>([]);
  const [graphData2, setGraphData2] = useState<any>([]);

  const [columnHeader, rowData] = useMemo(
    () => [graphData1, graphData2][tabIndex],
    [graphData1, graphData2, tabIndex]
  );

  return (
    <Stack rowGap={1}>
      <TagCard tabs={["三大買賣超", "外資及陸資買賣超"]} onChange={setTabIndex}>
        {tabIndex === 0 ? (
          <Graph1 getGraphData={setGraphData1} />
        ) : (
          <Graph1 getGraphData={setGraphData2} />
        )}
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
