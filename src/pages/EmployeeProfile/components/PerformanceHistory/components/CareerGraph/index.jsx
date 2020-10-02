import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
import { formatMessage } from 'umi';
import Chart from 'react-google-charts';
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

  createDataRows = (data) => {
    const arrayPerformance = [];
    data.map((item, index) => {
      const { value, year, performanceDetail } = item;
      const { salaryHike, promotedTo, roleChangedTo } = performanceDetail;
      if (index + 1 === data.length) {
        arrayPerformance.push({
          c: [
            { v: year },
            { v: value },
            { v: false },
            this.createCustomHTMLContent(salaryHike, promotedTo, roleChangedTo),
          ],
        });
      } else {
        arrayPerformance.push({
          c: [
            { v: year },
            { v: value },
            { v: true },
            this.createCustomHTMLContent(salaryHike, promotedTo, roleChangedTo),
          ],
        });
      }
      return arrayPerformance;
    });
    return arrayPerformance;
  };

  createCustomHTMLContent = (salaryHike, promotedTo, roleChangedTo) => {
    const toolTip = `${
      `${`${
        '<div ' +
        'style="padding: 10px; width: 169px; text-align: center; ' +
        'background-color: #568afa; color: #ffffff; border-radius: 5px; ' +
        'border: none; font-size: 12px;font-weight: 500; "> <span style="line-height: 1.5">Salary Hike: '
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
            document.getElementById('download_link').setAttribute('href', chart.getImageURI());
            document.getElementById('download_link').click();
          },
          false,
        );
      },
    };

    const titleTextStyle = {
      color: '#000000',
      fontSize: 13,
      bold: true,
      italic: false,
    };

    const options = {
      hAxis: {
        title: formatMessage({
          id: 'pages.employeeProfile.performanceHistory.career.duration',
        }),
        titleTextStyle,
        format: '####',
      },
      vAxis: {
        title: formatMessage({
          id: 'pages.employeeProfile.performanceHistory.career.performanceScore',
        }),
        titleTextStyle,
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
        <Card
          className={styles.careerPath_card}
          title={formatMessage({
            id: 'pages.employeeProfile.performanceHistory.career.careerGraph',
          })}
          extra={this.renderExtraCard()}
        >
          <div className={styles.careerPath_chart}>
            <Chart
              className={styles.chart}
              width="550px"
              height="450px"
              chartType="LineChart"
              loader={<div>Loading Chart ...</div>}
              columns={[
                { type: 'number', label: 'Year' },
                { type: 'number', label: 'Performance Score' },
                { type: 'boolean', role: 'certainty' },
                { type: 'string', role: 'tooltip', p: { html: true } },
              ]}
              rows={this.createDataRows(dummyData.chartData)}
              options={options}
              chartEvents={[chartEvents]}
            />
            <div id="piechart_3d" />
            <a style={{ display: 'none' }} id="download_link" href="/" download>
              CareerPathChart
            </a>
          </div>
          <div className={styles.careerPath_score}>
            <span>{dummyData.averageScore}</span>
            <p>
              {formatMessage({
                id: 'pages.employeeProfile.performanceHistory.career.averageScore',
              })}
            </p>
          </div>
        </Card>
      </div>
    );
  }
}

export default CareerGraph;
