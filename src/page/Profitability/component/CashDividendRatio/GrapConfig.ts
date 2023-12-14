export const labelDataSets = {
  labels: [],
  datasets: [
    {
      type: "bar" as const,
      label: "現金股利",
      data: [],
      borderColor: "#e8af02",
      backgroundColor: "#f7dfab",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
      order: 2,
    },
    {
      type: "line" as const,
      label: "現金股利發放率",
      backgroundColor: "#0586f4",
      data: [],
      borderColor: "#0586f4",
      borderWidth: 2,
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
        tooltipFormat: "YYYY-[Q]Q",
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
