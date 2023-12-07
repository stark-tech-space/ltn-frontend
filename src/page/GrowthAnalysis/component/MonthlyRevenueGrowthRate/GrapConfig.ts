export const labelDataSets = {
  labels: [],
  datasets: [
    {
      type: "line" as const,
      label: "月均價",
      borderColor: "#EB5757",
      backgroundColor: "#EB5757",
      borderWidth: 2,
      fill: false,
      data: [],
      yAxisID: "y1",
    },
    {
      type: "line" as const,
      label: "單月營收年增率",
      backgroundColor: "rgb(0, 99, 232)",
      data: [],
      borderColor: "rgb(0, 99, 232)",
      borderWidth: 1,
      yAxisID: "y1",
      fill: false,
      order: 1,
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
      position: "right",
      min: 250,
      title: {
        display: true,
        text: "元",
        align: "end",
        font: {
          size: 12,
          weight: "bold",
        },
      },
      grid: {
        drawOnChartArea: false,
      },
    },
    y1: {
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
