import { Stack, Box } from "@mui/material";
import TagCard from "../../../../component/tabCard";
import IncomeGraph from "./IncomeGraph";
import { useMemo, useState } from "react";
import WrappedAgGrid from "component/WrappedAgGrid";
import numeral from "numeral";

export default function IncomeStatement() {
  const [graphData, setGraphData] = useState<any>({});

  const defaultColDef = useMemo(() => {
    return {
      resizable: false,
      initialWidth: 160,
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
    const dataSources8: { [key: string]: any } = {};
    const dataSources9: { [key: string]: any } = {};
    const dataSources10: { [key: string]: any } = {};

    graphData.revenue?.forEach((item: any, index: number) => {
      dataSources1["title"] = "營收";
      dataSources1[graphData.date[index]] = numeral(item).format("0,0");
    });

    graphData.grossProfit?.forEach((item: any, index: number) => {
      dataSources2["title"] = "毛利";
      dataSources2[graphData.date[index]] = numeral(item).format("0,0");
    });
    graphData.sellingAndMarketingExpenses?.forEach(
      (item: any, index: number) => {
        dataSources4["title"] = "銷售費用";
        dataSources4[graphData.date[index]] = numeral(item).format("0,0");
      }
    );
    graphData.generalAndAdministrativeExpenses?.forEach(
      (item: any, index: number) => {
        dataSources9["title"] = "管理費用";
        dataSources9[graphData.date[index]] = numeral(item).format("0,0");
      }
    );
    graphData.researchAndDevelopmentExpenses?.forEach(
      (item: any, index: number) => {
        dataSources10["title"] = "研發費用";
        dataSources10[graphData.date[index]] = numeral(item).format("0,0");
      }
    );

    graphData.operatingExpenses?.forEach((item: any, index: number) => {
      dataSources3["title"] = "營業費用";
      dataSources3[graphData.date[index]] = numeral(item).format("0,0");
    });

    graphData.operatingIncome?.forEach((item: any, index: number) => {
      dataSources5["title"] = "營業利益";
      dataSources5[graphData.date[index]] = numeral(item).format("0,0");
    });

    graphData.preTaxIncome?.forEach((item: any, index: number) => {
      dataSources6["title"] = "稅前淨利";
      dataSources6[graphData.date[index]] = numeral(item).format("0,0");
    });

    graphData.afterTaxIncome?.forEach((item: any, index: number) => {
      dataSources7["title"] = "稅後淨利";
      dataSources7[graphData.date[index]] = numeral(item).format("0,0");
    });

    graphData.equityAttributableToOwnersOfParent?.forEach(
      (item: any, index: number) => {
        dataSources8["title"] = "母公司主業利益";
        dataSources8[graphData.date[index]] = numeral(item).format("0,0");
      }
    );

    const res = [
      dataSources1,
      dataSources3,
      dataSources4,
      dataSources9,
      dataSources10,
      dataSources5,
      dataSources6,
      dataSources7,
      dataSources8,
    ];

    if (dataSources2.title) {
      res.splice(1, 0, dataSources2);
    }

    return res;
  }, [graphData]);

  const columnHeaders = useMemo(() => {
    const columns = graphData.date?.map((item: any, index: number) => ({
      field: item,
    }));
    columns?.unshift({
      field: "title",
      headerName: "年度/季度",
      pinned: "left",
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
          <WrappedAgGrid
            rowData={tableRowData as any}
            columnDefs={columnHeaders as any}
            defaultColDef={defaultColDef}
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
