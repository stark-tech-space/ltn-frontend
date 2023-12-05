import { Stack, Box } from "@mui/material";
import TagCard from "../../../../component/tabCard";
import IncomeGraph from "./IncomeGraph";
import { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import numeral from "numeral";

export default function IncomeStatement() {
  const [graphData, setGraphData] = useState<any>({});

  const defaultColDef = useMemo(() => {
    return {
      resizable: false,
      initialWidth: 200,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    };
  }, []);

  const tableRowData = useMemo(() => {
    const dataSources1: { [key: string]: any } = {};
    const dataSources2: { [key: string]: any } = {};
    const dataSources3: { [key: string]: any } = {};
    const dataSources4: { [key: string]: any } = {};
    const dataSources5: { [key: string]: any } = {};
    const dataSources6: { [key: string]: any } = {};
    const dataSources7: { [key: string]: any } = {};
    graphData.revenue?.forEach((item: any, index: number) => {
      if (index === 0) {
        dataSources1["title"] = "营收";
      } else {
        dataSources1[graphData.date[index]] = numeral(item).format("0,0");
      }
    });

    graphData.grossProfit?.forEach((item: any, index: number) => {
      if (index === 0) {
        dataSources2["title"] = "毛利";
      } else {
        dataSources2[graphData.date[index]] = numeral(item).format("0,0");
      }
    });

    graphData.operatingExpenses?.forEach((item: any, index: number) => {
      if (index === 0) {
        dataSources3["title"] = "營業費用";
      } else {
        dataSources3[graphData.date[index]] = numeral(item).format("0,0");
      }
    });

    graphData.costOfGoodsSold?.forEach((item: any, index: number) => {
      if (index === 0) {
        dataSources4["title"] = "營業成本";
      } else {
        dataSources4[graphData.date[index]] = numeral(item).format("0,0");
      }
    });

    graphData.operatingIncome?.forEach((item: any, index: number) => {
      if (index === 0) {
        dataSources5["title"] = "營業利益";
      } else {
        dataSources5[graphData.date[index]] = numeral(item).format("0,0");
      }
    });

    graphData.preTaxIncome?.forEach((item: any, index: number) => {
      if (index === 0) {
        dataSources6["title"] = "稅前淨利";
      } else {
        dataSources6[graphData.date[index]] = numeral(item).format("0,0");
      }
    });

    graphData.equityAttributableToOwnersOfParent?.forEach(
      (item: any, index: number) => {
        if (index === 0) {
          dataSources7["title"] = "母公司主業利益";
        } else {
          dataSources7[graphData.date[index]] = numeral(item).format("0,0");
        }
      }
    );

    return [
      dataSources1,
      dataSources2,
      dataSources3,
      dataSources4,
      dataSources5,
      dataSources6,
      dataSources7,
    ];
  }, [graphData]);

  const columnHeaders = useMemo(() => {
    const columns = graphData.date?.map((item: any, index: number) => {
      if (index === 0) {
        return {
          field: "title",
          headerName: "年度/季度",
          pinned: "left",
        };
      }
      return {
        field: item,
      };
    });
    return columns;
  }, [graphData]);

  return (
    <Stack rowGap={1}>
      <Box bgcolor="#fff" borderRadius="8px" p={{ xs: 2, md: 3 }}>
        <IncomeGraph getGraphData={setGraphData} />
      </Box>
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
