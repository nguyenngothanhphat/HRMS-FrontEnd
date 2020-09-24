import React, { PureComponent } from 'react';
import { Card, Row, Button } from 'antd';
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
          <Row justify="space-between" align="middle">
            <div className={styles.careerPath_chart}>
              <Chart
                className={styles.chart}
                width="500px"
                height="300px"
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                columns={[
                  { type: 'number', label: 'Year' },
                  { type: 'number', label: 'Performance Score' },
                  { type: 'boolean', role: 'certainty' },
                  { type: 'string', role: 'tooltip', p: { html: true } },
                ]}
                rows={[
                  {
                    c: [
                      { v: 2018 },
                      { v: 4 },
                      { v: true },
                      this.createCustomHTMLContent('20%', 'Manager', 'PM'),
                    ],
                  },
                  {
                    c: [
                      { v: 2019 },
                      { v: 5 },
                      { v: true },
                      this.createCustomHTMLContent('30%', 'Manager', 'PM'),
                    ],
                  },
                  {
                    c: [
                      { v: 2020 },
                      { v: 7 },
                      { v: true },
                      this.createCustomHTMLContent('40%', 'Manager', 'PM'),
                    ],
                  },
                  {
                    c: [
                      { v: 2021 },
                      { v: 8 },
                      { v: false },
                      this.createCustomHTMLContent('50%', 'Manager', 'PM'),
                    ],
                  },
                ]}
                options={{
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
                    gridlines: {
                      color: 'transparent',
                    },
                    minValue: 0,
                    maxValue: 10,
                    ticks: [0, 2, 4, 6, 8, 10],
                  },
                  pointSize: 5,
                  colors: ['#2c6df9'],
                  curveType: 'function',
                  legend: 'none',
                  tooltip: { isHtml: true },
                }}
                rootProps={{ 'data-testid': '1' }}
              />
            </div>
            <div className={styles.careerPath_score}>
              <div className={styles.careerPath_scoreWrapper}>
                <span>{dummyData.averageScore}</span>
                <p>Average score</p>
              </div>
            </div>
          </Row>
        </Card>
      </div>
    );
  }
}

export default CareerGraph;
