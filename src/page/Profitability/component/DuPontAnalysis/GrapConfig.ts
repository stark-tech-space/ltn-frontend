export const labelDataSets = {
  labels: [],
  datasets: [
    {
      label: "稅後淨利率",
      data: [],
      borderColor: "rgb(232,175,0)",
      backgroundColor: "rgb(232,175,0)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "總資產迴轉",
      data: [],
      backgroundColor: "rgba(237, 88, 157, 0.15)",
      borderColor: "rgba(237, 88, 157, 0.35)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "權益乘數",
      data: [],
      borderColor: "rgb(0, 99, 132)",
      backgroundColor: "rgb(0, 99, 132)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "ROA",
      data: [],
      borderColor: "rgb(0, 199, 132)",
      backgroundColor: "rgb(0, 199, 132)",
      borderWidth: 1,
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
        tooltipFormat: "YYYY/MM",
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
