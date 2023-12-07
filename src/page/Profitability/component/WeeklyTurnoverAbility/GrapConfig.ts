export const TURNOVER_DATASETS: Record<string, any> = {
  "0": {
    labels: ["應收帳款週轉", "存貨週轉"],
    datasets: [
      {
        type: "line" as const,
        label: "應收帳款週轉",
        data: [],
        borderColor: "rgb(232,175,0)",
        backgroundColor: "rgb(232,175,0)",
        borderWidth: 1,
        yAxisID: "y",
        fill: false,
      },
      {
        type: "line" as const,
        label: "存貨週轉",
        data: [],
        backgroundColor: "rgba(237, 88, 157, 0.15)",
        borderColor: "rgba(237, 88, 157, 0.35)",
        borderWidth: 1,
        yAxisID: "y",
        fill: false,
      },
    ],
  },
  "1": {
    labels: ["固定資產", "固定資產周轉"],
    datasets: [
      {
        type: "bar" as const,
        label: "固定資產",
        data: [],
        borderColor: "rgb(232,175,0)",
        backgroundColor: "rgb(232,175,0)",
        borderWidth: 1,
        yAxisID: "y1",
        fill: false,
      },
      {
        type: "line" as const,
        label: "固定資產周轉",
        data: [],
        backgroundColor: "rgba(237, 88, 157, 0.15)",
        borderColor: "rgba(237, 88, 157, 0.35)",
        borderWidth: 1,
        yAxisID: "y",
        fill: false,
      },
    ],
  },
  "2": {
    labels: ["總資產", "總資產週轉"],
    datasets: [
      {
        type: "bar" as const,
        label: "總資產",
        data: [],
        borderColor: "rgb(232,175,0)",
        backgroundColor: "rgb(232,175,0)",
        borderWidth: 1,
        yAxisID: "y1",
        fill: false,
      },
      {
        type: "line" as const,
        label: "總資產週轉",
        data: [],
        backgroundColor: "rgba(237, 88, 157, 0.15)",
        borderColor: "rgba(237, 88, 157, 0.35)",
        borderWidth: 1,
        yAxisID: "y",
        fill: false,
      },
    ],
  },
};

export const TURNOVER_GRAPH_Y1_AXIS = {
  type: "linear",
  display: true,
  position: "right",
  title: {
    display: true,
    align: "end",
    text: "千元",
    font: {
      size: 12,
      weight: "bold",
    },
  },
  grid: {
    drawOnChartArea: false,
  },
};

const DEFAULT_TURNOVER_GRAPH_OPTION_SCALES = {
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
      text: "次",
      align: "end",
      font: {
        size: 12,
        weight: "bold",
      },
    },
  },
};

const DEFAULT_TURNOVER_GRAPH_OPTIONS = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
  scales: DEFAULT_TURNOVER_GRAPH_OPTION_SCALES,
};

export const TURNOVER_GRAPH_OPTIONS: Record<string, any> = {
  "0": DEFAULT_TURNOVER_GRAPH_OPTIONS,
  "1": {
    ...DEFAULT_TURNOVER_GRAPH_OPTIONS,
    scales: {
      ...DEFAULT_TURNOVER_GRAPH_OPTION_SCALES,
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          align: "end",
          text: "千元",
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
  },
  "2": {
    ...DEFAULT_TURNOVER_GRAPH_OPTIONS,
    scales: {
      ...DEFAULT_TURNOVER_GRAPH_OPTION_SCALES,
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          align: "end",
          text: "千元",
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
  },
};
