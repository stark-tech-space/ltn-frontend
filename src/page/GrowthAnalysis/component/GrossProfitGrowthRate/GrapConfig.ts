import moment from "moment";

export const graphConfig = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    tooltip: {
      callbacks: {
        title: function (context: any) {
          if (context[0]?.dataset?.yAxisID === "y1") {
            return moment(context[0].label, "YYYY/MM")
              .format("YYYY-Q")
              .split("-")
              .join("-Q");
          }
          return context[0]?.label || "";
        },
      },
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
