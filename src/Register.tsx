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
  ArcElement,
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
    TimeSeriesScale,
    ArcElement
  );
  // }, []);

  return null;
}
