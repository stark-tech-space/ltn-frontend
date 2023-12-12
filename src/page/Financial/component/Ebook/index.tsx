import { Box, Link, Stack } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { fetchEbooks } from "api/financial";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";

interface IEbooks {
  securityCode: string;
  year: string;
  quarter: string;
  heBingCaiWuBaoGao: {
    quarter: string;
    fileUrl: string;
  }[];
  guDongHuiNianBao: {
    fileUrl: string;
  };
}

const CellQuarterReport = ({
  value,
}: {
  value: { fileUrl: string; quarter: string }[];
}) => {
  return (
    <Stack>
      {value.map((item) => (
        <Link
          href={item.fileUrl}
          target="_blank"
          rel="noopener"
          sx={{
            color: "#405DF9",
            fontSize: "14px",
            height: 25,
            lineHeight: "25px",
          }}
        >{`第${item.quarter}季度財務報告`}</Link>
      ))}
    </Stack>
  );
};

const CellAnnualReport = ({ fileUrl }: { fileUrl: string }) => {
  return (
    <Link
      href={fileUrl}
      target="_blank"
      rel="noopener"
      sx={{ color: "#405DF9", fontSize: "14px", height: 25 }}
    >{`年度財務報告`}</Link>
  );
};

export default function EBooks() {
  const stock = useRecoilValue(currentStock);
  const [eBooks, setEbooks] = useState<IEbooks[]>([]);

  useEffect(() => {
    fetchEbooks<{ list: IEbooks[] }>({
      //   securityCode: stock.No,
      //   size: 100,
      //   page: 1,
    }).then((rst) => {
      if (rst?.list) {
        setEbooks(rst.list);
      }
    });
  }, [stock]);

  const getRowHeight = useCallback((params: any) => {
    return params.data.quarter.length * 25 + 10;
  }, []);

  const columnHeaders = useMemo(
    () => [
      {
        field: "title",
        headerName: "年度",
        width: 100,
        minWidth: 100,
        maxWidth: 100,
        pinned: "left",
      },
      {
        field: "quarter",
        headerName: "季度報告",
        minWidth: 200,
        flex: 1,
        cellRenderer: CellQuarterReport,
      },
      {
        field: "annual",
        headerName: "年度報告",
        minWidth: 200,
        flex: 1,
        cellRenderer: CellAnnualReport,
      },
    ],
    []
  );

  const rowData = useMemo(() => {
    return eBooks.map((item) => ({
      title: item.year,
      quarter: item.heBingCaiWuBaoGao,
      annual: item.guDongHuiNianBao.fileUrl,
    }));
  }, [eBooks]);

  return (
    <Stack
      borderRadius={{ xs: 0, md: "8px", ld: "8px" }}
      bgcolor="#fff"
      p={{ xs: 2, md: 3, lg: 3 }}
    >
      <Box className="ag-theme-alpine" sx={{ minHeight: 150 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnHeaders as any}
          domLayout="autoHeight"
          loadingOverlayComponent={() => "Loading..."}
          getRowHeight={getRowHeight as any}
          defaultColDef={{
            resizable: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
          }}
        />
      </Box>
    </Stack>
  );
}
