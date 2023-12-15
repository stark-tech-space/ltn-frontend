export const OPTIONS = {
  maintainAspectRatio: false,
  responsive: true,
  locale: "zh-TW",
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
      grid: {
        offset: false,
        drawTicks: true,
      },
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
};
