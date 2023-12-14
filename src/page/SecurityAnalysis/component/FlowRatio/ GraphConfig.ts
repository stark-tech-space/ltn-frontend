export const labelDataSets = {
  labels: [],
  datasets: [
    {
      label: "營業現金流對流動負債比",
      data: [],
      borderColor: "rgb(232,175,0)",
      backgroundColor: "rgb(232,175,0)",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "營業現金流對負債比",
      data: [],
      borderColor: "rgb(58, 132, 236)",
      backgroundColor: "rgb(58, 132, 236)",
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
