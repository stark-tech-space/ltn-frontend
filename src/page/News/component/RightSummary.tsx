import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  styled,
  Chip,
  Divider,
  Tooltip,
} from "@mui/material";
import ArticleList from "./ArticleList";
import {
  ICompanyState,
  IQuote,
  IBalanceSheetStatement,
  IKeyMetrics,
} from "types/news";
import {
  fetchQuote,
  fetchSymbolInfo,
  fetchBalanceSheetStatement,
  fetchKeyMetrics,
} from "api/news";
import { addPlaceHolder, formNumberToUnit } from "until";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useRecoilValue } from "recoil";
import { currentStock } from "recoil/selector";
import { fetchCompanyRatios } from "api/common";
import { IFinancialStatementRatio, PERIOD } from "types/common";
import { useTaiPeiStockOverview } from "Hooks/common";

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

export const StockInformation = () => {
  const [quote, setQuote] = useState<IQuote>({} as IQuote);
  const [others, setOthers] = useState<IFinancialStatementRatio>();
  const stock = useRecoilValue(currentStock);

  useEffect(() => {
    /*fetchQuote(stock.Symbol).then((rst) => {
      if (rst && rst[0]) {
        setQuote(rst[0]);
      }
    });
    fetchCompanyRatios(stock.Symbol, PERIOD.QUARTER, 1).then((rst) => {
      if (rst && rst[0]) {
        setOthers(rst[0]);
      }
    });*/
  }, [stock?.Symbol]);

  function getColor(value: number, nextValue: number) {
    if (value > nextValue) {
      return "#D92D20";
    } else {
      return "#27AE60";
    }
  }

  return (
    <Stack
      bgcolor="#fff"
      rowGap="12px"
      p={{ xs: 2, md: 3, lg: 3 }}
      borderRadius={{ xs: 0, md: "8px", lg: "8px" }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>開盤價</StyledLabel>
        <StyledValue color={getColor(quote.open, quote.previousClose)}>
          {addPlaceHolder(quote?.open)}
        </StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>最高價</StyledLabel>
        <StyledValue color={getColor(quote.dayHigh, quote.previousClose)}>
          {addPlaceHolder(quote?.dayHigh)}
        </StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>最低價</StyledLabel>
        <StyledValue color={getColor(quote.dayLow, quote.previousClose)}>
          {addPlaceHolder(quote?.dayLow)}
        </StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>收盤價</StyledLabel>
        <StyledValue color={getColor(quote.price, quote.previousClose)}>
          {addPlaceHolder(quote?.price)}
        </StyledValue>
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
            color: quote.change < 0 ? "#27AE60" : "#EB5757",
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
      <CompanyInformation />
      {/*<Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>EPS</StyledLabel>
        <StyledValue color="#000000">{addPlaceHolder(quote?.eps)}</StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>PE</StyledLabel>
        <StyledValue color="#000000">{addPlaceHolder(quote?.pe)}</StyledValue>
      </Box>
    <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>股息率</StyledLabel>
        <StyledValue color="#000000">--</StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>盈餘殖利率</StyledLabel>
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
      </Box> */}
    </Stack>
  );
};

export const CompanyInformation = () => {
  const [companyState, setCompanyState] = useState<ICompanyState>();
  const [balanceSheetStatement, setBalanceSheetStatement] =
    useState<IBalanceSheetStatement>();
  const [keyMetrics, setKeyMetrics] = useState<IKeyMetrics>();
  const stock = useRecoilValue(currentStock);
  const [quote, setQuote] = useState<IQuote>({} as IQuote);

  const taipeiStockOverview = useTaiPeiStockOverview();

  const industry_category = useMemo(() => {
    if (taipeiStockOverview && companyState?.industry && stock.No) {
      const filterList = taipeiStockOverview
        .filter((item) => item.stock_id === stock.No)
        .map((item) => item.industry_category);
      return filterList.length > 0 ? filterList.join("、") : "-";
    }
    return "-";
  }, [stock.No, companyState?.industry, taipeiStockOverview]);

  useEffect(() => {
    /*fetchSymbolInfo(stock.Symbol).then((rst) => {
      if (rst && rst[0]) {
        setCompanyState(rst[0]);
      } else {
        setCompanyState(undefined);
      }
    });
    fetchBalanceSheetStatement(stock.Symbol).then((rst) => {
      if (rst && rst[0]) {
        setBalanceSheetStatement(rst[0]);
      } else {
        setBalanceSheetStatement(undefined);
      }
    });
    fetchKeyMetrics(stock.Symbol).then((rst) => {
      if (rst && rst[0]) {
        setKeyMetrics(rst[0]);
      } else {
        setKeyMetrics(undefined);
      }
    });
    fetchQuote(stock.Symbol).then((rst) => {
      if (rst && rst[0]) {
        setQuote(rst[0]);
      }
    });*/
  }, [stock.Symbol]);

  return (
    <>
      {/* <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>交易所</StyledLabel>
        <StyledValue color="#000000">
          {addPlaceHolder(companyState?.exchangeShortName)}
        </StyledValue>
      </Box> */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>產業類別</StyledLabel>
        {industry_category.length >= 12 ? (
          <Tooltip title={industry_category} placement="bottom-start">
            <StyledValue color="#000000">{`${industry_category.slice(
              0,
              13
            )}...`}</StyledValue>
          </Tooltip>
        ) : (
          <StyledValue color="#000000">{industry_category}</StyledValue>
        )}
      </Box>
      {/* <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>市值 (百萬)</StyledLabel>
        <StyledValue color="#000000">
          {formNumberToUnit(companyState?.mktCap, "M", 6)}
        </StyledValue>
      </Box> */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>市值</StyledLabel>
        <StyledValue color="#000000">
          {formNumberToUnit(quote.marketCap, "T", 12)}
        </StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>總債務 (百萬)</StyledLabel>
        <StyledValue color="#000000">
          {formNumberToUnit(balanceSheetStatement?.totalDebt, "", 6)}
        </StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>現金和投資 (百萬)</StyledLabel>
        <StyledValue color="#000000">
          {formNumberToUnit(
            balanceSheetStatement?.cashAndShortTermInvestments,
            "",
            6
          )}
        </StyledValue>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledLabel>企業價值 (百萬)</StyledLabel>
        <StyledValue color="#000000">
          {formNumberToUnit(keyMetrics?.enterpriseValue, "", 6)}
        </StyledValue>
      </Box>
    </>
  );
};

export default function RightSummary() {
  return (
    <>
      <StockInformation />
      <Box height={{ xs: "8px", lg: "40px" }} />
      {/* <CompanyInformation />
      <Box height="8px" /> */}
      <ArticleList />
    </>
  );
}
