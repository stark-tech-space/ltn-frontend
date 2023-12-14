import moment from "moment";

export const labelDataSets = {
  datasets: [
    {
      type: "bar" as const,
      label: "每股淨值",
      data: [],
      backgroundColor: "#f6e1b1",
      borderColor: "#e8af00",
      borderWidth: 1,
      yAxisID: "y1",
      fill: false,
      order: 2,
    },
    {
      type: "line" as const,
      label: "月均價",
      data: [],
      borderColor: "#EB5757",
      backgroundColor: "#EB5757",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
      order: 1,
    },
  ],
};

export const OPTIONS = {
  maintainAspectRatio: false,
  responsive: true,
  locale: "zh-TW",
  plugins: {
    legend: {
      position: "bottom",
    },
    tooltip: {
      callbacks: {
        title: function (context: any) {
          if (context[0]?.dataset?.yAxisID === "y1") {
            return moment(context[0].raw.x, "YYYY-MM-DD").format("YYYY-[Q]Q");
          }
          return context[0]?.label;
        },
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
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
      position: "right",
      title: {
        display: true,
        text: "股價",
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
