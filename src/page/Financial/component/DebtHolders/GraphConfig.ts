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
      label: "短期借款",
      backgroundColor: "#EDC240",
      data: [],
      borderColor: "#EDC240",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "應付短期票券",
      backgroundColor: "#d8770e",
      data: [],
      borderColor: "#d8770e",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "應付帳款及票據",
      backgroundColor: "#79c418",
      data: [],
      borderColor: "#79c418",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "預收款項",
      backgroundColor: "#1b8021",
      data: [],
      borderColor: "#1b8021",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "一年內到期長期負債",
      backgroundColor: "#6eafcf",
      data: [],
      borderColor: "#6eafcf",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "長期負債",
      backgroundColor: "#0586f4",
      data: [],
      borderColor: "#0586f4",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "總負債",
      backgroundColor: "#752e7b",
      data: [],
      borderColor: "#752e7b",
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
      label: "普通股股本",
      backgroundColor: "#e8af00",
      data: [],
      borderColor: "#e8af00",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "保留盈餘",
      backgroundColor: "#0586f4",
      data: [],
      borderColor: "#0586f4",
      borderWidth: 1,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "淨值",
      backgroundColor: "#dc3911",
      data: [],
      borderColor: "#dc3911",
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
