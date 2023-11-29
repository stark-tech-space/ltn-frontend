import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import { Box } from "@mui/material";

const createTableHeader = (number: number) => {
  const data: any[] = [];
  for (let i = 0; i < number; i++) {
    if (i === 0) {
      data.push({ field: "qs", headerName: "年度月份", pinned: "left" });
    } else {
      data.push({ field: `time_${i}`, headerName: "2023-01" });
    }
  }
  return data;
};

const createTableData = (number: number) => {
  const data: any = {};
  for (let i = 0; i < number; i++) {
    if (i === 0) {
      data.qs = "單季EPS";
    } else {
      data[`time_${i}`] = (Math.random() * 100).toFixed(2);
    }
  }
  return [data];
};

export default function EpsTable() {
  const [columnHeaders, setColumnHeaders] = useState(createTableHeader(15));
  const [rowData, setRowData] = useState(createTableData(15));

  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
      initialWidth: 200,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    };
  }, []);

  return (
    <div
      className="ag-theme-alpine"
      style={{
        paddingBottom: "24px",
      }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnHeaders}
        defaultColDef={defaultColDef}
        domLayout="autoHeight"
      />
    </div>
  );
}
