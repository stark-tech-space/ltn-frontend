import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import TagCard from "component/tabCard";
import { Box } from "@mui/material";

const createTableHeader = (number: number) => {
  const data: any[] = [];
  for (let i = 0; i < number; i++) {
    if (i === 0) {
      data.push({ field: "qs", headerName: "年度/季度" });
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
  const [columnHeaders, setColumnHeaders] = useState(createTableHeader(20));
  const [rowData, setRowData] = useState(createTableData(20));
  
  const defaultColDef = useMemo(() => {
    return {
      resizable: false,
      initialWidth: 200,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    };
  }, []);

  return (
    <Box className="ag-theme-alpine" sx={{ height: 150 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnHeaders}
        defaultColDef={defaultColDef}
      />
    </Box>
  );
}
