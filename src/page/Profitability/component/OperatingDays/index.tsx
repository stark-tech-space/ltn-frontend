import { useState } from "react";
import { Stack, Box } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import Graph from "./Graph";
import TagCard from "../../../../component/tabCard";

export default function OperatingDays() {
  const [graphData, setGraphData] = useState<any[][]>([[], []]);
  const [columnHeaders, rowData] = graphData;

  return (
    <Stack rowGap={1}>
      <Box bgcolor="#fff" p={3} borderRadius="8px">
        <Graph getGraphData={setGraphData} />
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
