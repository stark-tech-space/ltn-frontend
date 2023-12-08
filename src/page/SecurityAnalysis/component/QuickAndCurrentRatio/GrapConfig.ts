export const RATIO_DATASET = {
  labels: [],
  datasets: [
    {
      label: '速動比',
      data: [],
      borderColor: 'rgb(232,175,0)',
      backgroundColor: 'rgb(232,175,0)',
      borderWidth: 1,
      yAxisID: 'y',
      fill: false,
    },
    {
      label: '流動比',
      data: [],
      borderColor: 'rgb(0, 199, 132)',
      backgroundColor: 'rgb(0, 199, 132)',
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
        text: '%',
        align: 'end',
        font: {
          size: 12,
          weight: 'bold',
        },
      },
    },
  },
};
