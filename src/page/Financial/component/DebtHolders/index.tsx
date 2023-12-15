import { Stack, Box } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import TagCard from "../../../../component/tabCard";
import WrappedAgGrid from "component/WrappedAgGrid";
import GraphDebtHolder from "./GraphDebtHolder";
// import GraphMultiRatio from "./GraphMultiRatio";
// import GraphSingleRatio from "./GraphSingleRatio";

export default function DebtHolders() {
  const [tabIndex, setTabIndex] = useState(0);
  const [graphTable, setGraphTable] = useState<any[][]>([[], []]);

  const [columnHeaders, rowData] = useMemo(() => {
    return graphTable;
  }, [graphTable]);

  return (
    <Stack rowGap={1}>
      <TagCard
        tabs={["負債和股東權益", "負債", "股東權益"]}
        onChange={setTabIndex}
      >
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
          <WrappedAgGrid
            rowData={rowData}
            columnDefs={columnHeaders as any}
            defaultColDef={{
              resizable: false,
              minWidth: 160,
              flex: 1,
              wrapHeaderText: true,
              autoHeaderHeight: true,
            }}
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
