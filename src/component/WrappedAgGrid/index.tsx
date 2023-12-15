import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef } from "react";

export default function WrappedAgGrid({
  rowData,
  columnDefs,
  defaultColDef = {
    resizable: false,
    initialWidth: 200,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  },
}: {
  rowData: any[][];
  columnDefs: any[];
  defaultColDef?: any;
}) {
  const gridRef = useRef<AgGridReact>(null);

  const sortedColDef = useMemo(
    () => columnDefs?.sort((a, b) => (a.field > b.field ? 1 : -1)) || [],
    [columnDefs]
  );

  useEffect(() => {
    try {
      if (gridRef.current && gridRef.current.api && sortedColDef?.length) {
        const last = sortedColDef[sortedColDef.length - 2];
        gridRef.current.api.ensureColumnVisible(last.field, "end");
      }
    } catch (error) {
      console.log(`Scroll error`);
    }
  }, [sortedColDef]);

  return (
    <AgGridReact
      ref={gridRef}
      rowData={rowData}
      columnDefs={sortedColDef}
      defaultColDef={{ ...defaultColDef, lockPosition: true }}
      domLayout="autoHeight"
    />
  );
}
