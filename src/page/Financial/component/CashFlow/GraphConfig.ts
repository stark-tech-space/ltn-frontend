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
      label: "投資現金流",
      data: [],
      backgroundColor: "rgba(237, 88, 157, 0.15)",
      borderColor: "rgba(237, 88, 157, 0.35)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "投資現金流",
      data: [],
      borderColor: "rgb(0, 99, 132)",
      backgroundColor: "rgb(0, 99, 132)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "自由現金流",
      data: [],
      borderColor: "rgb(0, 199, 132)",
      backgroundColor: "rgb(0, 199, 132)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "淨現金流",
      data: [],
      borderColor: "rgb(0, 99, 232)",
      backgroundColor: "rgb(0, 99, 232)",
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
