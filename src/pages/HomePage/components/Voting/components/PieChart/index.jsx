import { Pie } from '@ant-design/charts';
import React from 'react';
import GrayDot from '@/assets/homePage/grayDot.svg';
import styles from './index.less';

const PieChart = (props) => {
  const { options = [], showTitle = true } = props;

  const config = {
    appendPadding: 20,
    data: options,
    angleField: 'percent',
    colorField: 'text',
    radius: 1,
    height: 300,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}%',
      style: {
        textAlign: 'center',
        fontSize: 13,
        fontWeight: 500,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    legend: {
      position: 'bottom',
      layout: 'vertical',
      itemName: {
        style: {
          fontSize: 13,
          color: '#000',
        },
      },
    },
    statistic: {
      title: false,
      content: {
        content: '',
      },
    },
  };
  return (
    <div className={styles.PieChart}>
      {showTitle && (
        <p className={styles.questionText}>How do you feel about getting back to office?</p>
      )}
      <div className={styles.poll}>
        <Pie {...config} />
      </div>
      <div className={styles.votingInformation}>
        <span className={styles.number}>250 votes</span>
        <img src={GrayDot} alt="" />
        <span className={styles.dueTime}>2d left</span>
      </div>
    </div>
  );
};

export default PieChart;
