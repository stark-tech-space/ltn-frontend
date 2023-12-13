export const TURNOVER_DATASETS: Record<string, any> = {
  "0": {
    labels: ["應收帳款週轉", "存貨週轉"],
    datasets: [
      {
        type: "line" as const,
        label: "應收帳款週轉",
        data: [],
        borderColor: "#e8af02",
        backgroundColor: "#e8af02",
        borderWidth: 2,
        yAxisID: "y",
        fill: false,
      },
      {
        type: "line" as const,
        label: "存貨週轉",
        data: [],
        backgroundColor: "#0586f4",
        borderColor: "#0586f4",
        borderWidth: 2,
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
        borderColor: "#e8af02",
        backgroundColor: "#f7dfab",
        borderWidth: 1,
        yAxisID: "y1",
        fill: false,
        order: 2,
      },
      {
        type: "line" as const,
        label: "固定資產周轉",
        data: [],
        backgroundColor: "#0586f4",
        borderColor: "#0586f4",
        borderWidth: 2,
        yAxisID: "y",
        fill: false,
        order: 1,
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
        borderColor: "#e8af02",
        backgroundColor: "#f7dfab",
        borderWidth: 2,
        yAxisID: "y1",
        fill: false,
        order: 2,
      },
      {
        type: "line" as const,
        label: "總資產週轉",
        data: [],
        backgroundColor: "#0586f4",
        borderColor: "#0586f4",
        borderWidth: 2,
        yAxisID: "y",
        fill: false,
        order: 1,
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
      tooltipFormat: "YYYY-[Q]Q",
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
