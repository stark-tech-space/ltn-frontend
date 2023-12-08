export const labelDataSets = {
  labels: [],
  datasets: [
    {
      label: "外資及陸資",
      data: [],
      backgroundColor: "#ED589D",
    },
    {
      label: "自營商",
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

export const graphConfig = {
  type: "bar",
  responsive: true,
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
        unit: "year",
        tooltipFormat: "YYYY/MM",
      },
    },
    y: {
      stacked: true,
    },
  },
};
