import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { formatData, getWeekDays } from 'utils/formatChartData';
import numeral from 'numeral';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  legend: {
    display: false,
    boxWidth: 0,
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Wypożyczenia w ostatnim tygodniu',
      padding: {
        bottom: 15,
      },
      font: {
        family: 'Poppins, sans-serif',
        weight: 500,
        size: 14,
      },
    },
  },
  maintainAspectRatio: false,

  scales: {
    y: {
      ticks: {
        // Include a dollar sign in the ticks
        callback: function (value) {
          return numeral(value).format('0.0');
        },
      },
    },
  },
};

const BarChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    setChartData({
      labels: getWeekDays(),
      datasets: [
        {
          data: formatData(data, 'rentals'),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
        },
      ],
    });
  }, []);
  return chartData && <Bar options={options} data={chartData} />;
};

export default BarChart;

BarChart.propTypes = {
  data: PropTypes.object.isRequired,
};
