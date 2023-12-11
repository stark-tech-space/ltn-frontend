export const labelDataSets_01 = {
  labels: [],
  datasets: [
    {
      label: "流動負債",
      data: [],
      borderColor: "#EDC240",
      backgroundColor: "#EDC240",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "長期負債",

      data: [],
      backgroundColor: "#0386f4",
      borderColor: "#0386f4",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "淨值",
      data: [],
      borderColor: "#B02C20",
      backgroundColor: "#B02C20",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "總負債 + 淨值",
      data: [],
      borderColor: "#109618",
      backgroundColor: "#109618",
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
      type: "bar" as const,
      label: "短期借款",
      backgroundColor: "rgba(237, 88, 157, 0.15)",
      data: [],
      borderColor: "rgba(237, 88, 157, 0.35)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      type: "bar" as const,
      label: "應付短期票券",
      backgroundColor: "rgba(237, 88, 157, 0.15)",
      data: [],
      borderColor: "rgba(237, 88, 157, 0.35)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      type: "bar" as const,
      label: "應付帳款及票據",
      backgroundColor: "rgba(237, 88, 157, 0.15)",
      data: [],
      borderColor: "rgba(237, 88, 157, 0.35)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      type: "bar" as const,
      label: "預收款項",
      backgroundColor: "rgba(237, 88, 157, 0.15)",
      data: [],
      borderColor: "rgba(237, 88, 157, 0.35)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      type: "bar" as const,
      label: "一年內到期長期負債",
      backgroundColor: "rgba(237, 88, 157, 0.15)",
      data: [],
      borderColor: "rgba(237, 88, 157, 0.35)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      type: "bar" as const,
      label: "長期負債",
      backgroundColor: "rgba(237, 88, 157, 0.15)",
      data: [],
      borderColor: "rgba(237, 88, 157, 0.35)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      type: "bar" as const,
      label: "總負債",
      backgroundColor: "rgba(237, 88, 157, 0.15)",
      data: [],
      borderColor: "rgba(237, 88, 157, 0.35)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
  ],
};

export const labelDataSets_03 = {
  labels: [],
  datasets: [
    {
      type: "bar" as const,
      label: "普通股股本",
      backgroundColor: "rgba(237, 88, 157, 0.15)",
      data: [],
      borderColor: "rgba(237, 88, 157, 0.35)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      type: "bar" as const,
      label: "保留盈餘",
      backgroundColor: "rgba(237, 88, 157, 0.15)",
      data: [],
      borderColor: "rgba(237, 88, 157, 0.35)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      type: "bar" as const,
      label: "淨值",
      backgroundColor: "rgba(237, 88, 157, 0.15)",
      data: [],
      borderColor: "rgba(237, 88, 157, 0.35)",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
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
  },
};
