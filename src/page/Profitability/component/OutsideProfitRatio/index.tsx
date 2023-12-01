import { Stack, Box, Button, ButtonGroup } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import TagCard from "../../../../component/tabCard";

import { AgGridReact } from "ag-grid-react";
import GraphRatio from "./GraphRatio";

export default function OutSideProfitRatio() {
  const [tabIndex, setTabIndex] = useState(0);
  const [graphData, setGraphData] = useState<any[][]>([]);

  const [columnHeaders, rowData] = graphData;
  return (
    <Stack rowGap={1}>
      <Box bgcolor="#fff" p={3} borderRadius="8px">
        <div style={{ display: tabIndex === 0 ? "block" : "none" }}>
          <GraphRatio getGraphData={setGraphData} />
        </div>
      </Box>
      <TagCard tabs={["詳細數據"]}>
        <Box
          className="ag-theme-alpine"
          style={{
            paddingBottom: "24px",
          }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={columnHeaders as any}
            defaultColDef={{
              resizable: false,
              initialWidth: 200,
              wrapHeaderText: true,
              autoHeaderHeight: true,
              // flex: 1,
            }}
            domLayout="autoHeight"
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
