import { AgGridReact } from "ag-grid-react";
import { useEffect } from "react";

export function useTable(
  gridRef: React.RefObject<AgGridReact<any>>,
  columnHeaders: any[],
  gridReady: boolean,
) {
  useEffect(() => {
    if (gridReady && gridRef.current && columnHeaders?.length) {
      const lastRowIndex = columnHeaders[columnHeaders.length - 1];
      gridRef.current.api.ensureColumnVisible(lastRowIndex.field, "end");
    }
  }, [columnHeaders, gridReady]);
}
