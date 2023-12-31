import { Stack, Box, Button, ButtonGroup } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import TagCard from "../../../../component/tabCard";

import { AgGridReact } from "ag-grid-react";
import GraphDebt from "./GraphDebt";
import GraphDebtAssets from "./GraphDebtAssets";

export default function StructureRatio() {
  const [tabIndex, setTabIndex] = useState(0);
  const [graphDebtTable, setGraphDebtTable] = useState<any[][]>([]);
  const [graphDebtAssetsRatioTable, setGraphDebtAssetsRatioTable] = useState<
    any[][]
  >([]);

  const [columnHeaders, rowData] = useMemo(() => {
    return tabIndex === 0 ? graphDebtTable : graphDebtAssetsRatioTable;
  }, [tabIndex, graphDebtTable, graphDebtAssetsRatioTable]);

  return (
    <Stack rowGap={1}>
      <TagCard
        tabs={["負債比率", "長期資金佔固定資產比率"]}
        onChange={setTabIndex}
      >
        <Box bgcolor="#fff">
          <div style={{ display: tabIndex === 0 ? "block" : "none" }}>
            <GraphDebt getGraphData={setGraphDebtTable} />
          </div>
          <div style={{ display: tabIndex === 1 ? "block" : "none" }}>
            <GraphDebtAssets getGraphData={setGraphDebtAssetsRatioTable} />
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
              // flex: 1,
            }}
            domLayout="autoHeight"
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
