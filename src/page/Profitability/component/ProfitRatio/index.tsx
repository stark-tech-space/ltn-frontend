import { Stack, Box } from "@mui/material";
import { useMemo, useState } from "react";
import TagCard from "../../../../component/tabCard";
import GraphMultiRatio from "./GraphMultiRatio";
import GraphSingleRatio from "./GraphSingleRatio";
import WrappedAgGrid from "component/WrappedAgGrid";

export default function EarningsPerShare() {
  const [tabIndex, setTabIndex] = useState(0);
  const [graphMultiTableData, setGraphMultiTableData] = useState<any[][]>([]);
  const [graphSingleTableData, setGraphSingleTableData] = useState<any[][]>([]);

  const [columnHeaders, rowData] = useMemo(() => {
    return tabIndex === 0 ? graphMultiTableData : graphSingleTableData;
  }, [tabIndex, graphMultiTableData, graphSingleTableData]);

  return (
    <Stack rowGap={1}>
      <TagCard tabs={["利潤比率", "所得稅佔稅前淨利比"]} onChange={setTabIndex}>
        <Box bgcolor="#fff">
          <div style={{ display: tabIndex === 0 ? "block" : "none" }}>
            <GraphMultiRatio getGraphData={setGraphMultiTableData} />
          </div>
          <div style={{ display: tabIndex === 1 ? "block" : "none" }}>
            <GraphSingleRatio getGraphData={setGraphSingleTableData} />
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
              resizable: false,
              initialWidth: 200,
              wrapHeaderText: true,
              autoHeaderHeight: true,
            }}
            // domLayout="autoHeight"
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
