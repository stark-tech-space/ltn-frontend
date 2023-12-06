export const labelDataSets = {
  labels: [],
  datasets: [
    {
      type: "bar" as const,
      label: "現金股利",
      data: [],
      borderColor: "rgb(232,175,0)",
      backgroundColor: "rgb(232,175,0)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
      order: 2,
    },
    {
      type: "line" as const,
      label: "現金股利發放率",
      backgroundColor: "rgb(0, 99, 232, 0.55)",
      data: [],
      borderColor: "rgb(0, 99, 232, 0.85)",
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
      position: "left",
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
      position: "right",
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
