const skipped = (ctx: any, value: any) => (ctx.p0.skip || ctx.p1.skip ? value : undefined);
const down = (ctx: any, value: any) => (ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined);
export const labelDataSets = {
  labels: [],
  datasets: [
    {
      type: "line" as const,
      label: "本益比",
      data: [],
      borderColor: "rgb(232,175,0)",
      backgroundColor: "rgb(232,175,0)",
      borderWidth: 1,
      yAxisID: "y1",
      fill: false,
      spanGaps: true,
      segment: {
        borderColor: (ctx: any) => undefined,
        borderDash: (ctx: any) => undefined,
      },
    },
    {
      type: "line" as const,
      label: "月均價",
      backgroundColor: "rgba(237, 88, 157, 0.15)",
      data: [],
      borderColor: "rgba(237, 88, 157, 0.35)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
      spanGaps: true,
      segment: {
        borderColor: (ctx: any) => undefined,
        borderDash: (ctx: any) => undefined,
      },
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
