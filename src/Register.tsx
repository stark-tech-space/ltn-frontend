import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  TimeScale,
  TimeSeriesScale,
} from "chart.js";
import "chartjs-adapter-moment";

export default function Register() {
  // useEffect(() => {
  ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
    TimeScale,
    TimeSeriesScale
  );
  // }, []);
  console.log(111);

  return null;
}
