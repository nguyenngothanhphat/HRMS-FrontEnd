/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-restricted-properties */
import React from 'react';
import { Row, Col } from 'antd';
import { Pie } from '@ant-design/charts';

import styles from './index.less';

const PayDetail = () => {
  // data dummy
  const data = [
    {
      type: 'Basic',
      value: 27,
      color: '#6236FF',
    },
    {
      type: 'Lunch Allowance',
      value: 25,
      color: '#B84CB4',
    },
    {
      type: 'Petrol Allowance',
      value: 18,
      color: '#FD4546',
    },
    {
      type: 'Mob & Internet Allowance',
      value: 15,
      color: '#FF6CA1',
    },
    {
      type: 'Variable Pay',
      value: 10,
      color: '#4CB8B8 ',
    },
    {
      type: 'Deductions',
      value: 5,
      color: '#FFA100',
    },
  ];

  const config = {
    appendPadding: 0,
    data,
    height: 160,
    width: 160,
    angleField: 'value',
    colorField: 'type',
    color: ['#6236FF', '#B84CB4', '#FD4546', '#FF6CA1', '#4CB8B8', '#FFA100'],
    radius: 1,
    innerRadius: 0.64,
    meta: {
      value: {
        formatter: (v) => `${v} ₹`,
      },
    },
    label: {
      content: '',
    },

    statistic: {
      title: false,
      content: {
        offsetY: 4,
        style: {
          fontSize: '13px',
          fontWeight: 'bold',
          lineHeight: '15px',
          color: '#707177',
        },
      },
    },
    legend: false,

    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
      {
        type: 'pie-statistic-active',
      },
    ],
  };
  const renderViewDeductions = () => {
    return data.map((item) => {
      return (
        <Row className={styles.container}>
          <Col span={1}>
            <div className={styles.circleColor} style={{ background: `${item.color}` }} />
          </Col>
          <Col span={8}> {item.type}</Col>
          <Col span={6} className={styles.money}>
            {item.value}
          </Col>
          {item.type === 'Deductions' ? (
            <Col span={9} className={styles.viewGross}>
              + View Deductions
            </Col>
          ) : null}
        </Row>
      );
    });
  };
  return (
    <Row className={styles.PayDetail}>
      <Col span={7}>
        <Pie {...config} />
      </Col>
      <Col span={13}>
        <Row className={styles.grossPay}>
          <Col span={1} />
          <Col span={8}> Gross Pay</Col>
          <Col span={6} className={styles.money}>
            (+) ₹ 6,40,000
          </Col>
          <Col span={9} className={styles.viewGross}>
            - View Gross Pay
          </Col>
        </Row>
        {renderViewDeductions()}

        <Row className={styles.netPay}>
          <Col span={1} />
          <Col span={8}> Net Pay</Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            ₹ 5,90,000
          </Col>
        </Row>
      </Col>
      <Col span={4} />
    </Row>
  );
};

export default PayDetail;
