import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
import Chart from 'react-google-charts';
import { jsPDF as JsPDF } from 'jspdf';
import styles from './index.less';

class CareerGraph extends PureComponent {
  renderExtraCard = () => {
    return (
      <>
        <Button className={styles.btn_download} id="btn_download">
          <img
            className={styles.downloadIcon}
            src="/assets/images/iconDownload.svg"
            alt="download"
          />
          Download
        </Button>
      </>
    );
  };

  createCustomHTMLContent = (salaryHike, promotedTo, roleChangedTo) => {
    const toolTip = `${
      `${`${
        '<div ' +
        'style="padding: 10px; width: 169px; text-align: center; ' +
        'background-color: #568afa; color: #ffffff; border-radius: 5px; ' +
        'border: none; font-size: 12px;font-weight: 500; "> ' +
        '<span style="line-height: 1.5">Salary Hike: '
      }${salaryHike} </span></br> <span style="line-height: 1.5">Promoted to : `}${promotedTo}</span></br> ` +
      `<span style="line-height: 1.5">Role Changed to : `
    }${roleChangedTo} </span> </div>`;
    return toolTip;
  };

  render() {
    const dummyData = {
      averageScore: 7.7,
      chartData: [
        {
          year: 2018,
          value: 4,
          performanceDetail: {
            salaryHike: '20%',
            promotedTo: 'PM',
            roleChangedTo: 'Manager',
          },
        },
        {
          year: 2019,
          value: 5,
          performanceDetail: {
            salaryHike: '10%',
            promotedTo: 'PM',
            roleChangedTo: 'Senior',
          },
        },
        {
          year: 2020,
          value: 7,
          performanceDetail: {
            salaryHike: '15%',
            promotedTo: 'PM',
            roleChangedTo: 'Software Engineer 1',
          },
        },
        {
          year: 2021,
          value: 8,
          performanceDetail: {
            salaryHike: '5%',
            promotedTo: 'PM',
            roleChangedTo: 'Manager',
          },
        },
      ],
    };

    const chartEvents = {
      eventName: 'ready',
      callback: ({ chartWrapper }) => {
        const chart = chartWrapper.getChart();
        const btnSave = document.getElementById('btn_download');
        btnSave.addEventListener(
          'click',
          () => {
            const doc = new JsPDF();
            doc.addImage(chart.getImageURI(), 0, 0);
            doc.save('ChartCareerGraph.pdf');
          },
          false,
        );
      },
    };

    const options = {
      hAxis: {
        title: 'Duration',
        titleTextStyle: {
          color: '#000000',
          fontSize: 13,
          bold: true,
          italic: false,
        },
        format: '####',
      },
      vAxis: {
        title: 'Performance Score',
        titleTextStyle: {
          color: '#000000',
          fontSize: 13,
          bold: true,
          italic: false,
        },
        baselineColor: '#d6dce0',
        minValue: 0,
        maxValue: 10,
        ticks: [0, 2, 4, 6, 8, 10],
      },
      pointSize: 5,
      colors: ['#2c6df9'],
      curveType: 'function',
      legend: 'none',
      tooltip: { isHtml: true },
      chartArea: { left: '15%', top: '10%' },
    };

    return (
      <div className={styles.careerPath}>
        <Card className={styles.careerPath_card} title="Career Path" extra={this.renderExtraCard()}>
          <div className={styles.careerPath_chart}>
            <div id="divToPDF">
              <Chart
                className={styles.chart}
                width="500px"
                height="300px"
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={[
                  [
                    { type: 'number', label: 'Year' },
                    { type: 'number', label: 'Performance Score' },
                    { type: 'boolean', role: 'certainty' },
                    { type: 'string', role: 'tooltip', p: { html: true } },
                  ],
                  [2018, 4, true, this.createCustomHTMLContent('30%', 'Manager', 'PM')],
                  [2019, 5, true, this.createCustomHTMLContent('20%', 'Manager', 'PM')],
                  [2020, 7, true, this.createCustomHTMLContent('10%', 'Manager', 'PM')],
                  [2021, 2, false, this.createCustomHTMLContent('15%', 'Manager', 'PM')],
                ]}
                options={options}
                chartEvents={[chartEvents]}
                rootProps={{ 'data-testid': '1' }}
              />
            </div>
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

export default CareerGraph;
