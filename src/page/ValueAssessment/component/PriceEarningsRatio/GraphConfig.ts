export const labelDataSets = {
  labels: [],
  datasets: [
    {
      type: "line" as const,
      label: "本益比",
      data: [],
      borderColor: "rgb(232,175,0)",
      backgroundColor: "rgb(232,175,0)",
      borderWidth: 1,
      yAxisID: "y1",
      fill: false,
    },
    {
      type: "line" as const,
      label: "月均價",
      backgroundColor: "#EB5757",
      data: [],
      pointRadius: 0,
      borderColor: "#EB5757",
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
  elements: {
    line: {
      tension: 0.4,
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
        text: "倍",
        align: "end",
        font: {
          size: 12,
          weight: "bold",
        },
      },
    },
  },
};
