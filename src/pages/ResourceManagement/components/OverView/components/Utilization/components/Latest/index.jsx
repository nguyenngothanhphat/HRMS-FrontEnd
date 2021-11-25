import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { connect } from 'umi';

import { Col, Row } from 'antd';

import styles from './index.less';
import TopArrowIcon from '@/assets/resourceManagement/topArrow.svg';
import HelpIcon from '@/assets/resourceManagement/helpIcon.svg';

ChartJS.register(ArcElement, Tooltip, Legend);

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

  const formatData = () => {
    const billableToday = summaryToday.find((x) => x.status === 'Billable') || {};
    const benchToday = summaryToday.find((x) => x.status === 'Bench') || {};
    const bufferToday = summaryToday.find((x) => x.status === 'Buffer') || {};
    const totalToday = summaryToday.find((x) => x.status === 'Total') || {};

    // generate data for chart
    return {
      datasets: [
        {
          data: [10, 20, 50, 20],
          // data: [billable?.percent, buffer?.percent, bench?.percent, 100-(billable?.percent+ buffer?.percent+ bench?.percent)],
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
        },
      ],
    };
  };

  const calculateUtilization = () => {
    const billableToday = summaryToday.find((x) => x.status === 'Unpaid') || {};
    const totalToday = summaryToday.find((x) => x.status === 'Total') || {};

    const billableYesterday = summaryYesterday.find((x) => x.status === 'Unpaid') || {};
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
        value: `${billableToday?.count} (${Math.round(billableToday?.percent * 100)}%)`,
      },
      // {
      //   name: 'Total Unpaid resources',
      //   value: `${unpaidToday?.count} (${Math.round(unpaidToday?.percent * 100)}%)`,
      // },
      {
        name: 'Total Buffer resources',
        value: `${bufferToday?.count} (${Math.round(bufferToday?.percent * 100)}%)`,
      },
      {
        name: 'Total Benched resources',
        value: `${benchToday?.count} (${Math.round(benchToday?.percent * 100)}%)`,
      },
    ];
  };
  return (
    <div className={styles.Latest}>
      <Row className={styles.container} gutter={[50, 0]} justify="center">
        <Col span={12}>
          <div className={styles.left}>
            <div className={styles.chart}>
              <Doughnut data={formatData()} options={{ rotation: 270, circumference: 180 }} />
            </div>
            <div className={styles.numbers}>
              <div className={styles.numbers__above}>
                <span className={styles.bigNumber}>
                  {parseFloat(calculatedData.utilization).toFixed(2)}%
                </span>
                <span className={styles.smallNumber}>
                  <img src={TopArrowIcon} alt="" />
                  <span>{calculatedData.increasePercent}%</span>
                </span>
              </div>
              <div className={styles.numbers__below}>
                <span>
                  Current Utilization <img src={HelpIcon} alt="" />
                </span>
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
