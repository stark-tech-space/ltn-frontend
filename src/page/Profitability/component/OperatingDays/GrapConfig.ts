export const labelDataSets = {
  labels: [],
  datasets: [
    {
      label: "應收帳款收現天數",
      data: [],
      borderColor: "#e8af02",
      backgroundColor: "#e8af02",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "存貨週轉天數",
      data: [],
      backgroundColor: "#0586f4",
      borderColor: "#0586f4",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "營運週轉天數",
      data: [],
      borderColor: "#dc3911",
      backgroundColor: "#dc3911",
      borderWidth: 2,
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
        tooltipFormat: "YYYY-[Q]Q",
      },
    },
    y: {
      type: "linear",
      display: true,
      position: "left",
      title: {
        display: true,
        text: "天",
        align: "end",
        font: {
          size: 12,
          weight: "bold",
        },
      },
    },
  },
};
