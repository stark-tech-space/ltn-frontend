export const labelDataSets = {
  labels: [],
  datasets: [
    {
      type: "line" as const,
      label: "現金股利殖利率",
      data: [],
      borderColor: "rgb(229,166,0)",
      backgroundColor: "rgb(229,166,0)",
      borderWidth: 2,
      yAxisID: "y1",
      fill: false,
      tension: 0,
    },
    {
      type: "line" as const,
      label: "3年平均現金股息殖利率",
      data: [],
      borderColor: "rgb(68, 157, 68)",
      backgroundColor: "rgb(68, 157, 68)",
      borderWidth: 2,
      yAxisID: "y1",
      fill: false,
      tension: 0,
    },
    {
      type: "line" as const,
      label: "5年平均現金股息殖利率",
      data: [],
      borderColor: "rgb(137, 56, 234)",
      backgroundColor: "rgb(137, 56, 234)",
      borderWidth: 2,
      yAxisID: "y1",
      fill: false,
      tension: 0,
    },
    {
      type: "line" as const,
      label: "月均價",
      backgroundColor: "rgb(196,66,66)",
      data: [],
      borderColor: "rgb(196,66,66)",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
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
