import { Stack, Box } from "@mui/material";
import { useMemo, useState } from "react";
import TagCard from "../../../../component/tabCard";

import GraphDebt from "./GraphDebt";
import GraphDebtAssets from "./GraphDebtAssets";
import WrappedAgGrid from "component/WrappedAgGrid";

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
          <WrappedAgGrid
            rowData={rowData}
            columnDefs={columnHeaders as any}
            defaultColDef={{
              resizable: true,
              initialWidth: 160,
              wrapHeaderText: true,
              autoHeaderHeight: true,
            }}
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
