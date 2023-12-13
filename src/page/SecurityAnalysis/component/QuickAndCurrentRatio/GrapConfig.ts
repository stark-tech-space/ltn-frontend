export const RATIO_DATASET = {
  labels: [],
  datasets: [
    {
      label: "速動比",
      data: [],
      borderColor: "#e8af02",
      backgroundColor: "#e8af02",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "流動比",
      data: [],
      borderColor: "#0586f4",
      backgroundColor: "#0586f4",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
  ],
};

export const RATIO_GRAPH_CONFIG = {
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
        text: "%",
        align: "end",
        font: {
          size: 12,
          weight: "bold",
        },
      },
    },
  },
};
