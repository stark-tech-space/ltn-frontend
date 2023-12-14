export const labelDataSets = {
  labels: [],
  datasets: [
    {
      type: "line" as const,
      label: "單月營收年增率",
      backgroundColor: "rgb(229, 166, 0)",
      data: [],
      borderColor: "rgb(229, 166, 0)",
      borderWidth: 2,
      yAxisID: "y1",
      fill: false,
      order: 1,
      tension: 0,
    },
    {
      type: "line" as const,
      label: "月均價",
      borderColor: "rgb(196,66,66)",
      backgroundColor: "rgb(196,66,66)",
      borderWidth: 2,
      fill: false,
      data: [],
      yAxisID: "y1",
      tension: 0.4,
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
      title: {
        display: true,
        text: "股價",
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
