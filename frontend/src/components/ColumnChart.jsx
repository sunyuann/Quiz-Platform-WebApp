import React from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';

function ColumnChart ({ title, xTitle, yTitle, data }) {
  const options = {
    animationEnabled: true,
    title: {
      text: title,
    },
    axisX: {
      title: xTitle,
    },
    axisY: {
      title: yTitle,
    },
    data: [
      {
        type: 'column',
        dataPoints: data,
      },
    ],
  };

  return <CanvasJSChart options={options} />;
}

export default ColumnChart;
