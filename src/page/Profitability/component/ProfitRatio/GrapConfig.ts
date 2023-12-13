export const multiLabelDataSets = {
  labels: [],
  datasets: [
    {
      label: "毛利率",
      data: [],
      borderColor: "rgb(232,175,0)",
      backgroundColor: "rgb(232,175,0)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "營業利益率",
      data: [],
      backgroundColor: "rgba(237, 88, 157, 0.15)",
      borderColor: "rgba(237, 88, 157, 0.35)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "稅前淨利率",
      data: [],
      borderColor: "rgb(0, 99, 132)",
      backgroundColor: "rgb(0, 99, 132)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "稅後淨利率",
      data: [],
      borderColor: "rgb(0, 199, 132)",
      backgroundColor: "rgb(0, 199, 132)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
  ],
};

export const singleLabelDataSets = {
  labels: [],
  datasets: [
    {
      label: "所得稅佔稅前淨利比",
      data: [],
      borderColor: "rgb(0, 99, 132)",
      backgroundColor: "rgb(0, 99, 132)",
      borderWidth: 1,
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
