import Layout from "./component/Layout";
import Financial from "page/Financial";
import RealTimeNewsPage from "page/News";
import ProfitabilityPage from "page/Profitability";
import SecurityAnalysisPage from "page/SecurityAnalysis";
import GrowthAnalysisPage from "page/GrowthAnalysis";
import ValueAssessmentPage from "page/ValueAssessment";
import IndicatorsPage from "page/Indicators";
import ChipsPage from "page/Chips";
import { FINANCIAL_PAGE_CONVERTER } from "types/financial";
import { PROFIT_PAGE_CONVERTER } from "types/profitability";
import { SECURITY_PAGE_CONVERTER } from "types/security";
import { GROWTH_PAGE_CONVERTER } from "types/growth";
import { VALUE_ASSESSMENT_CONVERTER } from "types/valueAssessment";
import { INDICATORS_CONVERTER } from "types/indicators";
import { CHIPS_PAGE_CONVERTER } from "types/chips";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Widget from "page/Embed";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <RealTimeNewsPage />,
      },
      {
        path: "/financial",
        element: <Financial />,
      },
      {
        path: "/profitability",
        element: <ProfitabilityPage />,
      },
      {
        path: "/security",
        element: <SecurityAnalysisPage />,
      },
      {
        path: "/growth",
        element: <GrowthAnalysisPage />,
      },
      {
        path: "/evaluation",
        element: <ValueAssessmentPage />,
      },
      {
        path: "/indicator",
        element: <IndicatorsPage />,
      },
      {
        path: "/chips",
        element: <ChipsPage />,
      },
    ],
  },
  {
    path: "/embed/:stock_id",
    element: <Widget />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}

export const ROUTES = [
  {
    title: "最新動態",
    path: "/",
    children: null,
  },
  {
    title: "財務報表",
    path: "/financial",
    children: FINANCIAL_PAGE_CONVERTER,
  },
  {
    title: "獲利能力",
    path: "/profitability",
    children: PROFIT_PAGE_CONVERTER,
  },
  {
    title: "安全性分析",
    path: "/security",
    children: SECURITY_PAGE_CONVERTER,
  },
  {
    title: "成長力分析",
    path: "/growth",
    children: GROWTH_PAGE_CONVERTER,
  },
  {
    title: "價值評估",
    path: "/evaluation",
    children: VALUE_ASSESSMENT_CONVERTER,
  },
  // {
  //   title: "關鍵指標",
  //   path: "/indicator",
  //   children: INDICATORS_CONVERTER,
  // },
  {
    title: "籌碼",
    path: "/chips",
    children: CHIPS_PAGE_CONVERTER,
  },
];
