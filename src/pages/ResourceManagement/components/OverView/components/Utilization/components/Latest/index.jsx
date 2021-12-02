import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { connect } from 'umi';
import { Col, Row, Tooltip as TooltipAntd } from 'antd';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import CenterImage from '@/assets/resourceManagement/chartCenterImage.svg';
import styles from './index.less';
import TopArrowIcon from '@/assets/resourceManagement/topArrow.svg';
import HelpIcon from '@/assets/resourceManagement/helpIcon.svg';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Latest = (props) => {
  const { dispatch, resourceManagement: { resourceUtilizationList = {} } = {} } = props;
  const { summaryToday = [], summaryYesterday = [] } = resourceUtilizationList;
  const [calculatedData, setCalculatedData] = useState({
    utilization: 0,
    increasePercent: 0,
  });

  const fetchData = () => {
    dispatch({
      type: 'resourceManagement/fetchResourceUtilizationList',
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const colors = ['#FC6A22', '#FCB96C', '#66B03F', '#D6DCE0'];

  const renderPercent = (x) => {
    if (x === 0 || Number.isInteger(x)) return x;
    return parseFloat(x).toFixed(2);
  };

  const formatData = () => {
    const billableToday = summaryToday.find((x) => x.status === 'Billable') || { percent: 0 };
    const benchToday = summaryToday.find((x) => x.status === 'Bench') || { percent: 0 };
    const bufferToday = summaryToday.find((x) => x.status === 'Buffer') || { percent: 0 };
    const totalToday = summaryToday.find((x) => x.status === 'Total') || { percent: 0 };

    // generate data for chart
    return {
      datasets: [
        {
          data: [15, 35, 40, 10],
          // data: [
          //   renderPercent(billableToday?.percent),
          //   renderPercent(bufferToday?.percent),
          //   renderPercent(benchToday?.percent),
          //   renderPercent(
          //     totalToday?.percent -
          //       (billableToday?.percent + bufferToday?.percent + benchToday?.percent),
          //   ),
          // ],
          backgroundColor: colors,
          borderWidth: 0,
        },
      ],
    };
  };

  const calculateUtilization = () => {
    const billableToday = summaryToday.find((x) => x.status === 'Billable') || {};
    const totalToday = summaryToday.find((x) => x.status === 'Total') || {};

    const billableYesterday = summaryYesterday.find((x) => x.status === 'Billable') || {};
    const totalYesterday = summaryYesterday.find((x) => x.status === 'Total') || {};

    // other
    if (totalYesterday && totalYesterday?.count > 0 && totalToday && totalToday?.count > 0) {
      const utilizationYesterdayTemp = billableYesterday.count / totalYesterday.count;
      const utilizationTodayTemp = billableToday.count / totalToday.count;
      let result = 0;
      if (utilizationYesterdayTemp > 0 && utilizationTodayTemp > 0) {
        result =
          ((utilizationTodayTemp - utilizationYesterdayTemp) / utilizationYesterdayTemp) * 100;
      }
      setCalculatedData({
        utilization: utilizationTodayTemp * 100,
        increasePercent: result,
      });
    }
  };

  useEffect(() => {
    calculateUtilization();
  }, [JSON.stringify(resourceUtilizationList)]);

  const generateItems = () => {
    const billableToday = summaryToday.find((x) => x.status === 'Billable') || {};
    const benchToday = summaryToday.find((x) => x.status === 'Bench') || {};
    // const unpaidToday = summaryToday.find((x) => x.status === 'Unpaid') || {};
    const bufferToday = summaryToday.find((x) => x.status === 'Buffer') || {};
    const totalToday = summaryToday.find((x) => x.status === 'Total') || {};

    return [
      {
        name: 'Total Resources',
        value: totalToday.count,
      },
      {
        name: 'Total Billable resources',
        value: `${billableToday?.count} (${renderPercent(billableToday?.percent)}%)`,
      },
      // {
      //   name: 'Total Unpaid resources',
      //   value: `${unpaidToday?.count} (${Math.round(unpaidToday?.percent)}%)`,
      // },
      {
        name: 'Total Buffer resources',
        value: `${bufferToday?.count} (${renderPercent(bufferToday?.percent)}%)`,
      },
      {
        name: 'Total Benched resources',
        value: `${benchToday?.count} (${renderPercent(benchToday?.percent)}%)`,
      },
    ];
  };

  const numSectors = formatData().datasets[0].data.length;
  const sectorDegree = 180 / numSectors;

  return (
    <div className={styles.Latest}>
      <Row className={styles.container} gutter={[50, 0]} justify="center">
        <Col span={12}>
          <div className={styles.left}>
            <div className={styles.chart}>
              <Doughnut
                data={formatData()}
                options={{
                  rotation: 270,
                  circumference: 180,
                  cutout: 95,
                  layout: {
                    padding: {
                      top: 24,
                      bottom: 14,
                      left: 24,
                      right: 24,
                    },
                  },
                  plugins: {
                    tooltip: {
                      enabled: false,
                    },
                    datalabels: {
                      anchor: 'end',
                      align: (context) => {
                        return sectorDegree * context.dataIndex + 20;
                      },
                      offset: () => {
                        return -32;
                      },
                      display: (context) => {
                        const { dataset } = context;
                        const count = dataset.data.length;
                        return (
                          context.dataIndex !== count - 1 && dataset.data[context.dataIndex] !== 0
                        );
                      },

                      color: '#161C29',
                      labels: {
                        title: {
                          font: {
                            weight: '500',
                            size: 16,
                          },
                        },
                      },
                    },
                  },
                }}
                plugins={[
                  {
                    afterDatasetDraw: (chart) => {
                      const { ctx } = chart;
                      ctx.save();
                      const image = new Image();
                      image.src = CenterImage;
                      const imageSize = 105;
                      ctx.drawImage(
                        image,
                        chart.width / 2 - imageSize / 2,
                        chart.height / 2 + 20,
                        imageSize,
                        imageSize,
                      );
                      ctx.restore();
                    },
                  },
                  ChartDataLabels,
                ]}
              />
            </div>
            <div className={styles.numbers}>
              <div className={styles.numbers__above}>
                <span className={styles.bigNumber}>
                  {renderPercent(calculatedData.utilization)}%
                </span>
                <span className={styles.smallNumber}>
                  <img src={TopArrowIcon} alt="" />
                  <span>{renderPercent(calculatedData.increasePercent)}%</span>
                </span>
              </div>
              <div className={styles.numbers__below}>
                <div>
                  Current Utilization{' '}
                  <TooltipAntd
                    title={
                      <div style={{ fontSize: '12px' }}>
                        Current utilization is calculated as a percentage of Total Billable
                        resources / Total Resources
                        <br />
                        <br />
                        Compared to the previous week, the Resource utilization has increased by{' '}
                        {calculatedData.increasePercent}%
                      </div>
                    }
                    placement="rightTop"
                    color="#1A1A46"
                    overlayInnerStyle={{
                      padding: '7px 15px',
                    }}
                    overlayStyle={{
                      borderRadius: '5px',
                    }}
                  >
                    <img src={HelpIcon} alt="" />
                  </TooltipAntd>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.right}>
            <div className={styles.information}>
              {generateItems().map((x) => (
                <div className={styles.item}>
                  <span className={styles.label}>{x.name}</span>
                  <span className={styles.value}>{x.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ resourceManagement }) => ({
  resourceManagement,
}))(Latest);
