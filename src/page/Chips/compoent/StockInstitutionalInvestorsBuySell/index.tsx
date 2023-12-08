import React from "react";
import { Box, Button } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Chart as ReactChart } from "react-chartjs-2";

import type { Chart } from "chart.js";

import PeriodController from "component/PeriodController";
import { graphConfig, labelDataSets } from "./GraphConfig";
import { genFullDateObject, getBeforeYears } from "until";

import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { fetchFindMindAPI } from "api/common";
import { PERIOD_TYPE } from "types/common";
import moment from "moment";

const PERIOD_YEAR = [
  { label: "近1月", value: 1, type: PERIOD_TYPE.MONTH },
  { label: "近1年", value: 1, type: PERIOD_TYPE.YEAR },
  { label: "近3年", value: 3, type: PERIOD_TYPE.YEAR },
  { label: "近5年", value: 5, type: PERIOD_TYPE.YEAR },
];

export default function StockInstitutionalInvestorsBuySell() {
  const chartRef = useRef<Chart>();
  const stock = useRecoilValue(currentStock);

  const [graphData, setGraphData] = useState<any>([]);
  const [period, setPeriod] = useState({
    label: "近1月",
    value: 1,
    type: PERIOD_TYPE.MONTH,
  });

  const fetchGraphData = useCallback(async () => {
    let start_date = "";

    if (period.type === PERIOD_TYPE.MONTH) {
      start_date = moment()
        .subtract(21, "day")
        .startOf("day")
        .format("YYYY-MM-DD");
    } else {
      start_date = getBeforeYears(period.value - 1);
    }

    const rst = await fetchFindMindAPI({
      data_id: stock.No,
      dataset: "TaiwanStockInstitutionalInvestorsBuySell",
      start_date,
    });
    console.log("rst:", rst);
    /**
     * 外陸資=外陸資買賣超股數(不含外資自營商) + 外資自營商買賣超股數
     * Foreign_Investor +Foreign_Dealer_Self
     *
     * 投信=投信買賣超股數
     * Investment_Trust
     *
     * 自營商=自營商買賣超股數(自行買賣)+自營商買賣超股數(避險)
     * Dealer_self +Dealer_Hedging
     * */

    // const fields = [{
    //     'Foreign_Investor':[],
    //     'Foreign_Dealer_Self':[],
    //     'Investment_Trust':[],
    //     'Foreign_Investor':[],
    //     'Foreign_Investor':[],

    // }]
  }, [period, stock]);

  useEffect(() => {
    // fetchGraphData();
  }, [fetchGraphData]);

  return (
    <Box bgcolor="#fff" p={3} borderRadius="8px">
      <Box>
        {PERIOD_YEAR.map((item) => (
          <Button
            key={item.value}
            sx={{
              color:
                item.value === period.value && item.type === period.type
                  ? "#405DF9"
                  : "#333",
            }}
            onClick={() => {
              setPeriod(item);
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>

      <Box height={510}>
        <ReactChart
          type="bar"
          data={labelDataSets}
          options={graphConfig as any}
          ref={chartRef}
        />
      </Box>
    </Box>
  );
}
