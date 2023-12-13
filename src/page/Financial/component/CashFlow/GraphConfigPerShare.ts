export const PER_SHARE_GRAPH_DATA = {
  labels: [],
  datasets: [
    {
      label: "每股營業現金流",
      data: [],
      borderColor: "#e8af02",
      backgroundColor: "#e8af02",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "每股投資現金流出",
      data: [],
      backgroundColor: "#0586f4",
      borderColor: "#0586f4",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "每股融資現金流入",
      data: [],
      borderColor: "#dc3911",
      backgroundColor: "#dc3911",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "每股自由現金流入",
      data: [],
      borderColor: "#0d9618",
      backgroundColor: "#0d9618",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
    {
      label: "每股淨現金流入",
      data: [],
      borderColor: "#b98c00",
      backgroundColor: "#b98c00",
      borderWidth: 2,
      yAxisID: "y",
      fill: false,
    },
  ],
};

export const PER_SHARE_OPTIONS = {
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
        text: "元",
        align: "end",
        font: {
          size: 12,
          weight: "bold",
        },
      },
    },
  },
};
