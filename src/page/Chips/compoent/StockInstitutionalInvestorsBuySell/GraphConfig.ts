export const labelDataSets_01 = {
  labels: [],
  datasets: [
    {
      label: "外資及陸資",
      data: [],
      backgroundColor: "#ED589D",
    },
    {
      label: "投信",
      data: [],
      backgroundColor: "#FF7E47",
    },
    {
      label: "自營商",
      data: [],
      backgroundColor: "#536DFA",
    },
  ],
};

export const graphConfig_01 = {
  type: "bar",
  responsive: true,
  locale: "zh-TW",
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
  scales: {
    x: {
      stacked: true,
      alignToPixels: true,
      offset: false,
      type: "time",
      time: {
        unit: "day",
        tooltipFormat: "YYYY/MM/DD",
      },
    },
    y: {
      stacked: true,
      title: {
        display: true,
        text: "张",
        align: "end",
        font: {
          size: 12,
          weight: "bold",
        },
      },
    },
  },
};
