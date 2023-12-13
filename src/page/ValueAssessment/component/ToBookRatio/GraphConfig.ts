import moment from "moment";

export const labelDataSets = {
  labels: [],
  datasets: [
    {
      type: "line" as const,
      label: "股價淨值比",
      data: [],
      borderColor: "rgb(229,166,0)",
      backgroundColor: "rgb(229,166,0)",
      borderWidth: 2,
      yAxisID: "y1",
      fill: false,
      spanGaps: true,
      segment: {
        borderColor: (ctx: any) => undefined,
        borderDash: (ctx: any) => undefined,
      },
      tension: 0,
    },
    {
      type: "line" as const,
      label: "月均價",
      backgroundColor: "rgb(196,66,66)",
      data: [],
      borderColor: "rgb(196,66,66)",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
      spanGaps: true,
      segment: {
        borderColor: (ctx: any) => undefined,
        borderDash: (ctx: any) => undefined,
      },
      tension: 0.4,
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
        text: "倍",
        align: "end",
        font: {
          size: 12,
          weight: "bold",
        },
      },
    },
  },
};
