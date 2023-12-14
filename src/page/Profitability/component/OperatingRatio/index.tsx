import { Stack, Box } from "@mui/material";
import { useState } from "react";
import TagCard from "../../../../component/tabCard";

import GraphRatio from "./GraphRatio";
import WrappedAgGrid from "component/WrappedAgGrid";

export default function OperatingRatio() {
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
          <WrappedAgGrid
            rowData={rowData}
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
