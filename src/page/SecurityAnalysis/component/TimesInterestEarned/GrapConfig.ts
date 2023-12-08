export const RATIO_DATASET = {
  labels: [],
  datasets: [
    {
      label: '利息保障倍數',
      data: [],
      borderColor: 'rgb(232,175,0)',
      backgroundColor: 'rgb(232,175,0)',
      borderWidth: 1,
      yAxisID: 'y',
      fill: false,
    },
  ],
};

export const RATIO_GRAPH_CONFIG = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  scales: {
    x: {
      alignToPixels: true,
      offset: false,
      type: 'time',
      time: {
        unit: 'year',
        tooltipFormat: 'YYYY/MM',
      },
    },
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      title: {
        display: true,
        text: '',
        align: 'end',
        font: {
          size: 12,
          weight: 'bold',
        },
      },
    },
  },
};
