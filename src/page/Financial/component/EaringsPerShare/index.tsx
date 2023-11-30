import { Stack, Box } from "@mui/material";
import React, { useMemo, useState } from "react";
import TagCard from "../../../../component/tabCard";
import EpsGraph from "./EpsGraph";
import numeral from "numeral";
import { AgGridReact } from "ag-grid-react";

export default function EarningsPerShare() {
  const [tabIndex, setTabIndex] = useState(0);
  const [graphData, setGraphData] = useState<any[]>([]);

  const columnHeaders = useMemo(() => {
    // return graphData?.map((item, index) => {
    //   if (index === 0) {
    //     return {
    //       field: "title",
    //       headerName: "年度/季度",
    //       pinned: "left",
    //     };
    //   }
    //   return {
    //     field: item.date.slice(0, -3),
    //   };
    // });
    return [{ field: "title", headerNames: "年度/季度", pinned: "left" }];
  }, [graphData]);

  const tableRowData = useMemo(() => {
    // const dataSources: { [key: string]: any } = {};
    // graphData?.forEach((item, index) => {
    //   if (index === 0) {
    //     dataSources["title"] = "每月營收";
    //   } else {
    //     dataSources[item.date.slice(0, -3)] = numeral(item.revenue).format(
    //       "0,0"
    //     );
    //   }
    // });
    return [
      {
        title: "單季EPS",
      },
    ];
  }, [graphData]);

  const defaultColDef = useMemo(() => {
    return {
      resizable: false,
      initialWidth: 200,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    };
  }, []);

  return (
    <Stack rowGap={1}>
      <TagCard tabs={["單季EPS", "近4季累積EPS"]} onChange={setTabIndex}>
        <EpsGraph getGraphData={setGraphData} />
      </TagCard>
      <TagCard tabs={["詳細數據"]}>
        <Box
          className="ag-theme-alpine"
          style={{
            paddingBottom: "24px",
          }}
        >
          <AgGridReact
            rowData={tableRowData}
            columnDefs={columnHeaders as any}
            defaultColDef={defaultColDef}
            domLayout="autoHeight"
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
