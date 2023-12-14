import { Stack, Box } from "@mui/material";
import { useState } from "react";
import TagCard from "../../../../component/tabCard";
import Graph from "./Graph";
import WrappedAgGrid from "component/WrappedAgGrid";

export default function OperatingIncomeGrowthRate() {
  const [graphData, setGraphData] = useState<any[][]>([]);
  const [columnHeaders, rowData] = graphData;
  return (
    <Stack rowGap={1}>
      <Graph getGraphData={setGraphData} />
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
              minWidth: 200,
              wrapHeaderText: true,
              autoHeaderHeight: true,
              flex: 1,
            }}
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
