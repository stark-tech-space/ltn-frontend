export const labelDataSets = {
  labels: [],
  datasets: [
    {
      type: "line" as const,
      label: "長期投資",
      data: [],
      backgroundColor: "rgba(237, 88, 157, 0.15)",
      borderColor: "rgba(237, 88, 157, 0.35)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      type: "line" as const,
      label: "固定資產",
      data: [],
      borderColor: "#EB5757",
      backgroundColor: "#EB5757",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      type: "line" as const,
      label: "總資產",
      data: [],
      borderColor: "#2D9CDB",
      backgroundColor: "#2D9CDB",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
  ],
};

export const lineGraphConfig = {
  maintainAspectRatio: false,
  responsive: true,
  locale: "zh-TW",
  interaction: {
    intersect: false,
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
  },
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

export const pieChartLabelDataSets = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [
        "rgba(7, 102, 173, 0.5)",
        "rgba(41, 173, 178,0.5)",
        "rgba(197, 232, 152,0.5)",
        "rgba(174, 68, 90,0.5)",
        "rgba(197, 255, 248,0.5)",
        "rgba(150, 239, 255,0.5)",
        "rgba(95, 189, 255,0.5)",
        "rgba(123, 102, 255,0.5)",
        "rgba(69, 25, 82,0.5)",
      ],
      borderColor: [
        "rgba(7, 102, 173, 1)",
        "rgba(41, 173, 178,1)",
        "rgba(197, 232, 152,1)",
        "rgba(174, 68, 90,1)",
        "rgba(197, 255, 248,1)",
        "rgba(150, 239, 255,1)",
        "rgba(95, 189, 255,1)",
        "rgba(123, 102, 255,1)",
        "rgba(69, 25, 82,1)",
      ],
      borderWidth: 1,
    },
  ],
};

export const pieChartConfig = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      maxWidth: 320,
    },
  },
};
