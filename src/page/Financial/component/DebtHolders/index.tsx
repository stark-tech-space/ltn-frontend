import { Stack, Box } from "@mui/material";
import { useMemo, useState } from "react";
import TagCard from "../../../../component/tabCard";
import { AgGridReact } from "ag-grid-react";
import GraphDebtHolder from "./GraphDebtHolder";
// import GraphMultiRatio from "./GraphMultiRatio";
// import GraphSingleRatio from "./GraphSingleRatio";

export default function DebtHolders() {
  const [tabIndex, setTabIndex] = useState(0);
  const [graphTable1, setGraphTable1] = useState<any[][]>([[], []]);
  const [graphTable2, setGraphTable2] = useState<any[][]>([[], []]);
  const [graphTable3, setGraphTable3] = useState<any[][]>([[], []]);

  const [columnHeaders, rowData] = useMemo(
    () => [graphTable1, graphTable2, graphTable3][tabIndex],
    [tabIndex, graphTable1, graphTable2, graphTable3]
  );

  return (
    <Stack rowGap={1}>
      <TagCard
        tabs={["負債和股東權益", "負債", "股東權益"]}
        onChange={setTabIndex}
      >
        <Box bgcolor="#fff">
          <div style={{ display: tabIndex === 0 ? "block" : "none" }}>
            <GraphDebtHolder getGraphData={setGraphTable1} />
          </div>
          <div style={{ display: tabIndex === 1 ? "block" : "none" }}>
            <GraphDebtHolder getGraphData={setGraphTable1} />
          </div>
          <div style={{ display: tabIndex === 2 ? "block" : "none" }}>
            <GraphDebtHolder getGraphData={setGraphTable1} />
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
            rowData={rowData}
            columnDefs={columnHeaders as any}
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
