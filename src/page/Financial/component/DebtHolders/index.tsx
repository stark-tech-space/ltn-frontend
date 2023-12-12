import { Stack, Box } from "@mui/material";
import { useState } from "react";
import TagCard from "../../../../component/tabCard";
import { AgGridReact } from "ag-grid-react";
import GraphDebtHolder from "./GraphDebtHolder";
// import GraphMultiRatio from "./GraphMultiRatio";
// import GraphSingleRatio from "./GraphSingleRatio";

export default function DebtHolders() {
  const [tabIndex, setTabIndex] = useState(0);
  const [graphTable, setGraphTable] = useState<any[][]>([[], []]);

  return (
    <Stack rowGap={1}>
      <TagCard tabs={["負債和股東權益", "負債", "股東權益"]} onChange={setTabIndex}>
        <Box bgcolor="#fff">
          <GraphDebtHolder getGraphData={setGraphTable} tabIndex={tabIndex} />
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
            rowData={graphTable[1]}
            columnDefs={graphTable[0] as any}
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
