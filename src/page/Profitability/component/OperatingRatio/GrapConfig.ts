export const multiLabelDataSets = {
  labels: [],
  datasets: [
    {
      label: "營業費用率",
      data: [],
      borderColor: "#e8af02",
      backgroundColor: "#e8af02",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "銷售費用率",
      data: [],
      backgroundColor: "#0586f4",
      borderColor: "#0586f4",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "管理費用率",
      data: [],
      borderColor: "#dc3911",
      backgroundColor: "#dc3911",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "研發費用率",
      data: [],
      borderColor: "#0d9618",
      backgroundColor: "#0d9618",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
  ],
};

export const graphConfig_01 = {
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
