import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function WrappedAgGrid({
  rowData,
  columnDefs,
  defaultColDef = {
    resizable: false,
    initialWidth: 160,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  },
}: {
  rowData: any[][];
  columnDefs: any[];
  defaultColDef?: any;
}) {
  const gridRef = useRef<AgGridReact>(null);
  const [isGridReady, setIsGridReady] = useState<boolean>(false);

  const sortedColDef = useMemo(
    () => columnDefs?.sort((a, b) => (a.field > b.field ? 1 : -1)) || [],
    [columnDefs]
  );

  useEffect(() => {
    if (gridRef.current && isGridReady) {
      gridRef.current.columnApi.autoSizeAllColumns();
    }
  }, [isGridReady]);

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
      onGridReady={(e) => setIsGridReady(true)}
    />
  );
}
