import { Stack, Box } from "@mui/material";
import { useState } from "react";
import TagCard from "../../../../component/tabCard";
import GraphOperatNetIncomeRate from "./GraphOperatNetIncomeRate";
import WrappedAgGrid from "component/WrappedAgGrid";

export default function OperatingNetIncomeRate() {
  const [graphDebtTable, setGraphDebtTable] = useState<any[][]>([]);

  const [columnHeaders, rowData] = graphDebtTable;

  return (
    <Stack rowGap={1}>
      <Box bgcolor="#fff" p={3} borderRadius="8px">
        <GraphOperatNetIncomeRate getGraphData={setGraphDebtTable} />
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
              resizable: true,
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
