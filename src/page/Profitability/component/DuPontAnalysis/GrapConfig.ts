export const labelDataSets = {
  labels: [],
  datasets: [
    {
      label: "稅後淨利率",
      data: [],
      borderColor: "#e8af02",
      backgroundColor: "#e8af02",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "總資產迴轉",
      data: [],
      backgroundColor: "#0d9618",
      borderColor: "#0d9618",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "權益乘數",
      data: [],
      borderColor: "#9440ec",
      backgroundColor: "#9440ec",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "ROA",
      data: [],
      borderColor: "#dc3911",
      backgroundColor: "#dc3911",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
  ],
};

export const graphConfig = {
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
