export const labelDataSets = {
  labels: [],
  datasets: [
    {
      type: "line" as const,
      label: "流動資產",
      data: [],
      backgroundColor: "#EDC240",
      borderColor: "#EDC240",
      borderWidth: 2,
      yAxisID: "y",
      fill: { above: "blue", below: "red" },
    },
    {
      type: "line" as const,
      label: "長期投資",
      data: [],
      backgroundColor: "#0586f4",
      borderColor: "#0586f4",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      type: "line" as const,
      label: "固定資產",
      data: [],
      borderColor: "#b02b21",
      backgroundColor: "#b02b21",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      type: "line" as const,
      label: "總資產",
      data: [],
      borderColor: "#0f9617",
      backgroundColor: "#0f9617",
      borderWidth: 2,
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
    filler: {
      propagate: false,
    },
  },
};

export const pieChartLabelDataSets = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [
        "#0586f4",
        "#b02b20",
        "rgba(197, 232, 152)",
        "#e8af02",
        "#d8770f",
        "#79c418",
        "#1a8021",
        "#6977d4",
        "#752c7b",
      ],
      borderColor: [
        "#0586f4",
        "#b02b20",
        "rgba(197, 232, 152,1)",
        "#e8af02",
        "#d8770f",
        "#79c418",
        "#1a8021",
        "#6977d4",
        "#752c7b",
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
