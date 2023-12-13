export const multiLabelDataSets = {
  labels: [],
  datasets: [
    {
      label: "毛利率",
      data: [],
      borderColor: "#e8af02",
      backgroundColor: "#e8af02",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "營業利益率",
      data: [],
      backgroundColor: "#0586f4",
      borderColor: "#0586f4",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "稅前淨利率",
      data: [],
      borderColor: "#dc3911",
      backgroundColor: "#dc3911",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "稅後淨利率",
      data: [],
      borderColor: "#0d9618",
      backgroundColor: "#0d9618",
      borderWidth: 2,
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
      borderColor: "#e8af02",
      backgroundColor: "#e8af02",
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
