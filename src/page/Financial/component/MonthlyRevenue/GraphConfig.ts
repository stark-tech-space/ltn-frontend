export const labelDataSets_01 = {
  labels: [],
  datasets: [
    {
      type: "line" as const,
      label: "月均價",
      data: [],
      borderColor: "#EB5757",
      backgroundColor: "#EB5757",
      borderWidth: 2,
      yAxisID: "y1",
      fill: false,
    },
    {
      type: "bar" as const,
      label: "每月營收",
      data: [],
      backgroundColor: "#f6e1b1",
      borderColor: "#e8af00",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
  ],
};

export const labelDataSets_02 = {
  labels: [],
  datasets: [
    {
      type: "line" as const,
      label: "月均價",
      data: [],
      borderColor: "#EB5757",
      backgroundColor: "#EB5757",
      borderWidth: 2,
      yAxisID: "y1",
      fill: false,
    },
    {
      type: "bar" as const,
      label: "月每股營收",
      data: [],
      backgroundColor: "#f6e1b1",
      borderColor: "#e8af00",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
  ],
};

export const OPTIONS_01 = {
  maintainAspectRatio: false,
  responsive: true,
  locale: "zh-TW",
  plugins: {
    legend: {
      position: "bottom",
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
      grid: {
        offset: false,
        drawTicks: true,
      },
      ticks: {
        autoSkip: false,
        maxRotation: 0,
        major: {
          enabled: true,
        },
      },
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
        text: "千元",
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

export const OPTIONS_02 = {
  maintainAspectRatio: false,
  responsive: true,
  locale: "zh-TW",
  plugins: {
    legend: {
      position: "bottom",
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
      ticks: {
        autoSkip: false,
        maxRotation: 0,
        major: {
          enabled: true,
        },
      },
      grid: {
        offset: false,
        drawTicks: true,
      },
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
        text: "元",
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
