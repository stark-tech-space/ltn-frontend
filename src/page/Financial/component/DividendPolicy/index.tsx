import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";

import { fetchFindMindAPI } from "api/common";
import { IDividendPolicyItem } from "types/financial";
import moment from "moment";

export default function DividendPolicy() {
  const stock = useRecoilValue(currentStock);
  const [graphData, setGraphData] = useState<IDividendPolicyItem[]>([]);

  const fetchGraphData = useCallback(async () => {
    const rst = await fetchFindMindAPI<IDividendPolicyItem[]>({
      data_id: stock.No,
      dataset: "TaiwanStockDividend",
      start_date: "2015-01-01",
    });

    if (rst) {
      setGraphData(
        rst.sort((a, b) => (moment(a.date).isBefore(b.date) ? 1 : -1))
      );
    }
  }, [stock.No]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  const columnHeaders = useMemo(() => {
    return [
      {
        field: "AnnouncementDate",
        headerName: "公告日",
        pinned: "left",
        width: 100,
      },
      {
        field: "CashEarningsDistribution",
        headerName: "現金股利",
      },
      {
        field: "CashExDividendTradingDate",
        headerName: "除息日",
      },
      {
        field: "CashDividendPaymentDate",
        headerName: "現金股利發放日	",
      },
      {
        field: "SpecifiesDay",
        headerName: "填息花費日數",
      },
      {
        field: "StockEarningsDistribution",
        headerName: "股票股利",
      },
      {
        field: "ExceptDay",
        headerName: "除權日",
      },
    ];
  }, []);

  const tableRowData = useMemo(() => {
    // console.log(graphData);
    return graphData.map((item, index) => {
      return {
        AnnouncementDate: item.AnnouncementDate,
        CashEarningsDistribution:
          item.CashEarningsDistribution?.toFixed(2) || "無",
        CashExDividendTradingDate: item.CashExDividendTradingDate || "無",
        CashDividendPaymentDate: item.CashDividendPaymentDate || "無",
        StockEarningsDistribution:
          item.StockEarningsDistribution?.toFixed(2) || "無",
        SpecifiesDay: "無",
        ExceptDay: "無",
      };
    });
  }, [graphData]);

  return (
    <Stack borderRadius="8px" bgcolor="#fff" p={3}>
      <Box className="ag-theme-alpine" sx={{ minHeight: 150 }}>
        <AgGridReact
          rowData={tableRowData}
          columnDefs={columnHeaders as any}
          domLayout="autoHeight"
          defaultColDef={{
            resizable: true,
            flex: 1,
            minWidth: 200,
            wrapHeaderText: true,
            autoHeaderHeight: true,
          }}
        />
      </Box>
    </Stack>
  );
}
