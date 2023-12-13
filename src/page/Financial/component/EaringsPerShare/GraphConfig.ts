import moment from "moment";

export const OPTIONS = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    tooltip: {
      callbacks: {
        title: function (context: any) {
          if (context[0]?.dataset?.yAxisID === "y") {
            return moment(context[0].raw.x, "YYYY-MM-DD")
              .format("YYYYY-[Q]Q");
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
    y1: {
      type: "linear",
      display: true,
      position: "right",
      title: {
        display: true,
        align: "end",
        text: "股價",
        font: {
          size: 12,
          weight: "bold",
        },
      },
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};
