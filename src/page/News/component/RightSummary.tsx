import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, styled, Chip, Divider } from "@mui/material";
import ArticleList from "./ArticleList";
import { ICompanyState, IQuote } from "types/news";
import { fetchQuote, fetchSymbolInfo } from "api/news";
import { STOCK_SYMBOL } from "constant";
import { addPlaceHolder, formNumberToUnit } from "until";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { fetchCompanyRatios } from "api/common";
import { IFinancialStatementRatio, PERIOD } from "types/common";

const StyledLabel = styled(Typography)(({ theme, color }) => ({
  fontSize: "16px",
  color: "#000",
  fontWeight: 400,
  lineHeight: "24px",
}));

const StyledValue = styled(Typography)(
  ({ color = "#D92D20" }: { color?: string }) => ({
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px",
    color,
  })
);

const StockInformation = () => {
  const [quote, setQuote] = useState<IQuote>({} as IQuote);
  const [others, setOthers] = useState<IFinancialStatementRatio>();
  const stock = useRecoilValue(currentStock);

  useEffect(() => {
    fetchQuote(stock.Symbol).then((rst) => {
      if (rst && rst[0]) {
        setQuote(rst[0]);
      }
    });

    fetchCompanyRatios(stock.Symbol, PERIOD.QUARTER, 1).then((rst) => {
      if (rst && rst[0]) {
        setOthers(rst[0]);
      }
    });
  }, [stock?.Symbol]);

  return (
    <Stack borderRadius="8px" bgcolor="#fff" p={3} rowGap="12px">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>開盤價</StyledLabel>
        <StyledValue>{addPlaceHolder(quote?.open)}</StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>最高價</StyledLabel>
        <StyledValue>{addPlaceHolder(quote?.dayHigh)}</StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>最低價</StyledLabel>
        <StyledValue>{addPlaceHolder(quote?.dayLow)}</StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>收盤價</StyledLabel>
        <StyledValue>{addPlaceHolder(quote?.price)}</StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>漲跌</StyledLabel>
        <Chip
          icon={
            quote.change < 0 ? (
              <ArrowDropDownIcon fontSize="small" />
            ) : (
              <ArrowDropUpIcon fontSize="small" />
            )
          }
          label={addPlaceHolder(quote?.changesPercentage?.toFixed(2), "%")}
          sx={{
            bgcolor: "#EB57571A",
            color: "#EB5757",
            "&>.MuiSvgIcon-root": { color: "#D92D20", py: "4px" },
          }}
        />
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>成交量</StyledLabel>
        <StyledValue color="#000000">
          {formNumberToUnit(quote.volume, "K", 3)}
        </StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>前日收盤價</StyledLabel>
        <StyledValue color="#000000">
          {addPlaceHolder(quote.previousClose)}
        </StyledValue>
      </Box>
      <Divider sx={{ bgcolor: "#D0D5DD" }} />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>EPS (FWD)</StyledLabel>
        <StyledValue color="#000000">{addPlaceHolder(quote?.eps)}</StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>PE (FWD)</StyledLabel>
        <StyledValue color="#000000">{addPlaceHolder(quote?.pe)}</StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>股息率 (FWD)</StyledLabel>
        <StyledValue color="#000000">--</StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>盈餘殖利率 (FWD)</StyledLabel>
        <StyledValue color="#000000">
          {addPlaceHolder(others?.earningsYield?.toFixed(2))}
        </StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>放空率</StyledLabel>
        <StyledValue color="#000000">--</StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>市值</StyledLabel>
        <StyledValue color="#000000">
          {formNumberToUnit(quote.marketCap, "T", 12)}
        </StyledValue>
      </Box>
    </Stack>
  );
};

const CompanyInformation = () => {
  const [companyState, setCompanyState] = useState<ICompanyState>();

  useEffect(() => {
    fetchSymbolInfo(STOCK_SYMBOL).then((rst) => {
      if (rst && rst[0]) {
        setCompanyState(rst[0]);
      }
    });
  }, []);

  return (
    <Stack borderRadius="8px" bgcolor="#fff" p={3} rowGap="12px">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>交易所</StyledLabel>
        <StyledValue color="#000000">
          {addPlaceHolder(companyState?.exchangeShortName)}
        </StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>產業類別</StyledLabel>
        <StyledValue color="#000000">
          {addPlaceHolder(companyState?.industry)}
        </StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>市值 (百萬)</StyledLabel>
        <StyledValue color="#000000">
          {formNumberToUnit(companyState?.mktCap, "T", 12)}
        </StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>總債務 (百萬)</StyledLabel>
        <StyledValue color="#000000">--</StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>現金和投資 (百萬)</StyledLabel>
        <StyledValue color="#000000">--</StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>企業價值 (百萬)</StyledLabel>
        <StyledValue color="#000000">--</StyledValue>
      </Box>
    </Stack>
  );
};

export default function RightSummary() {
  return (
    <>
      <StockInformation />
      <Box height={{ xs: "8px", lg: "40px" }} />
      <CompanyInformation />
      <Box height="8px" />
      <ArticleList />
    </>
  );
}
