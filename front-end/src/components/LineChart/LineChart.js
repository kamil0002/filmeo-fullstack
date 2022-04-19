import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { formatData, getWeekDays } from 'utils/formatChartData';
import numeral from 'numeral';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Wydatki',
      font: {
        family: 'Poppins, sans-serif',
        weight: 500,
        size: 14,
      },
    },

    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';

          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += `${numeral(context.parsed.y).format('0.00')} PLN`;
          }
          return label;
        },
      },
    },
  },
};

const LineChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    setChartData({
      labels: getWeekDays(),
      datasets: [
        {
          data: formatData(data),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    });
  }, []);

  return chartData && <Line options={options} data={chartData} />;
};

export default LineChart;

LineChart.propTypes = {
  data: PropTypes.object.isRequired,
};
