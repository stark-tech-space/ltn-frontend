import moment from "moment";

export const GRAPH_DATA = {
  labels: [],
  datasets: [
    {
      label: "營業現金流",
      data: [],
      borderColor: "rgb(232,175,0)",
      backgroundColor: "rgb(232,175,0)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "融資現金流",
      data: [],
      backgroundColor: "#dc3911",
      borderColor: "#dc3911",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "投資現金流",
      data: [],
      borderColor: "#0586f4",
      backgroundColor: "#0586f4",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "自由現金流",
      data: [],
      borderColor: "#0f9617",
      backgroundColor: "#0f9617",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "淨現金流",
      data: [],
      borderColor: "#b98c01",
      backgroundColor: "#b98c01",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
  ],
};

export const OPTIONS = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
  scales: {
    x: {
      alignToPixels: true,
      offset: false,
      type: "time",
      time: {
        unit: "year",
        tooltipFormat: "YYYY-[Q]Q",
      },
    },
    y: {
      type: "linear",
      display: true,
      position: "left",
      title: {
        display: true,
        text: "千元",
        align: "end",
        font: {
          size: 12,
          weight: "bold",
        },
      },
    },
  },
};
