import React, { PureComponent } from 'react';
import { Card } from 'antd';
import Chart from 'chart.js';
import styles from './index.less';

class CareerPath extends PureComponent {
  chartRef = React.createRef();

  componentDidMount() {
    const myChartRef = this.chartRef.current.getContext('2d');
    const labels = [1, 2, 3, 4, 5, 6];
    const values = [12, 19, 3, 5, 2, 3, 8];
    const data = labels.map((label, index) => ({ x: label, y: values[index] }));
    // const lineChartData = {
    //   labels: ['2018', '2019', '2020', '2021'],
    //   datasets: [
    //     {
    //       label: 'My Dataset',
    //       data,
    //       borderColor: '#922893',
    //       pointBackgroundColor: 'transparent',
    //     },
    //   ],
    // };

    // eslint-disable-next-line no-new
    new Chart(myChartRef, {
      type: 'line',
      plugins: [
        {
          afterDraw: (chart) => {
            const { ctx } = chart.chart;
            console.log('ctx', ctx);
            const xAxis = chart.scales['x-axis-0'];
            const yAxis = chart.scales['y-axis-0'];
            console.log('xAxis', xAxis);
            console.log('yAxis', yAxis);
            chart.config.data.datasets[0].data.forEach((value, index) => {
              console.log('value', value);
              console.log('index', index);

              if (index > 0) {
                // const valueFrom = data[index - 1];
                // const xFrom = xAxis.getPixelForValue(valueFrom.x);
                // const yFrom = yAxis.getPixelForValue(valueFrom.y);
                // const xTo = xAxis.getPixelForValue(value.x);
                // const yTo = yAxis.getPixelForValue(value.y);
                // ctx.save();
                // ctx.strokeStyle = '#2c6df9';
                // ctx.lineWidth = 2;
                if (index + 1 === data.length) {
                  // ctx.setLineDash([5, 10]);
                }
                ctx.beginPath();
                // ctx.moveTo(xFrom, yFrom);
                // ctx.lineTo(xTo, yTo);
                ctx.stroke();
                ctx.restore();
              }
            });
          },
        },
      ],
      data: {
        labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        datasets: [
          {
            label: 'My Dataset',
            data,
            borderColor: '#2c6df9',
            pointBackgroundColor: 'transparent',
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                stepSize: 1,
              },
              gridLines: {
                drawOnChartArea: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
              gridLines: {
                drawOnChartArea: false,
              },
            },
          ],
        },
      },
    });
  }

  renderExtraCard = () => {
    return <>Extra card</>;
  };

  render() {
    const dummyData = {
      averageScore: 7.7,
      chartDate: [
        {
          year: 2018,
          value: 4,
        },
        {
          year: 2019,
          value: 5,
        },
        {
          year: 2020,
          value: 7,
        },
        {
          year: 2021,
          value: 8,
        },
      ],
    };

    return (
      <div className={styles.careerPath}>
        <Card className={styles.careerPath_card} title="Career Path" extra={this.renderExtraCard()}>
          <div className={styles.careerPath_chart}>
            <canvas
              id="myChart"
              ref={this.chartRef}
              className={styles.careerPath_canvasChart}
              height="125"
            />
          </div>
          <div className={styles.careerPath_score}>
            <span>{dummyData.averageScore}</span>
            <p>Average score</p>
          </div>
        </Card>
      </div>
    );
  }
}

export default CareerPath;
