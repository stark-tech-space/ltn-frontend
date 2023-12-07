import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./component/Layout";
import Financial from "page/Financial";
import RealTimeNewsPage from "page/News";
import ProfitabilityPage from "page/Profitability";
import SecurityAnalysisPage from "page/SecurityAnalysis";
import GrowthAnalysisPage from "page/GrowthAnalysis";
import ValueAssessmentPage from "page/ValueAssessment";
import IndicatorsPage from "page/Indicators";
import ChipsPage from "page/Chips";

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
]);

export default function Router() {
  return <RouterProvider router={router} />;
}

export const ROUTES = [
  {
    title: "最新動態",
    path: "/",
  },
  {
    title: "財務報表",
    path: "/financial",
  },
  {
    title: "獲利能力",
    path: "/profitability",
  },
  {
    title: "安全性分析",
    path: "/security",
  },
  {
    title: "成長力分析",
    path: "/growth",
  },
  {
    title: "價值評估",
    path: "/evaluation",
  },
  {
    title: "關鍵指標",
    path: "/indicator",
  },
  {
    title: "籌碼",
    path: "/chips",
  },
];
