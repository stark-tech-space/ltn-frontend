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

export const labelDataSets_02 = {
  labels: [],
  datasets: [
    {
      label: "外資及陸資(不含外資自營商)",
      data: [],
      backgroundColor: "#ED589D",
    },
    {
      label: "外資自營商",
      data: [],
      backgroundColor: "#FF7E47",
    },
    {
      label: "外資及陸資",
      data: [],
      backgroundColor: "#536DFA",
    },
    {
      label: "股价",
      data: [],
      borderColor: "rgb(0, 99, 232)",
      backgroundColor: "rgb(0, 99, 232)",
      borderWidth: 1,
      yAxisID: "y1",
      fill: false,
    },
  ],
};

export const graphConfig = {
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
    y1: {
      type: "linear",
      display: true,
      position: "right",
      title: {
        display: true,
        text: "股价",
        align: "end",
        font: {
          size: 12,
          weight: "bold",
        },
      },
    },
  },
};
