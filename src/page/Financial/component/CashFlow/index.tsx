import { Box, Button, Stack } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import http from "api/http";
import TagCard from "component/tabCard";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { PERIOD, PERIOD_YEAR } from "types/common";

export default function CashFlow() {
  const stock = useRecoilValue(currentStock);
  const [period, setPeriod] = useState(3);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);

  const fetchGraphData = useCallback(async () => {
    const rst = await http.get(`/data`, {
      params: {
        data_id: stock.No,
        start_date: "2023-01-01",
        dataset: "TaiwanStockCashFlowsStatement",
      },
    });
  }, [stock]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  return (
    <Stack rowGap={1}>
      <TagCard tabs={["現金流表", "每股現金流表"]}>
        <Stack
          direction="row"
          alignItems="center"
          // justifyContent="space"
          sx={{
            mb: 3,
            "&>button": {
              mx: 1,
              bgcolor: "transparent",
              border: 0,
              cursor: "pointer",
            },
          }}
        >
          {PERIOD_YEAR.map((item) => (
            <Button
              key={item.value}
              sx={{
                color: item.value === period ? "primary" : "#333",
              }}
              onClick={() => setPeriod(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
        <Box height={510} bgcolor="#fff" pb={3}>
          {/* <Chart type="bar" data={data} options={OPTIONS as any} /> */}
        </Box>
      </TagCard>
      <TagCard tabs={["詳細數據"]}>
        <Box
          className="ag-theme-alpine"
          style={{
            paddingBottom: "24px",
          }}
        >
          {/* <AgGridReact
            rowData={rowData}
            columnDefs={columnHeaders as any}
            defaultColDef={defaultColDef}
            domLayout="autoHeight"
          /> */}
        </Box>
      </TagCard>
    </Stack>
  );
}
