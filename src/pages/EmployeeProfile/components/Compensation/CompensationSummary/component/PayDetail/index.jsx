/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-restricted-properties */
import React from 'react';
import { Row, Col } from 'antd';
import { Pie, measureTextWidth } from '@ant-design/charts';

import styles from './index.less';

const PayDetail = () => {
  const renderStatistic = (containerWidth, text, style) => {
    const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
    const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

    let scale = 1;

    if (containerWidth < textWidth) {
      scale = Math.min(
        Math.sqrt(
          Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))),
        ),
        1,
      );
    }

    const textStyleStr = `width:${containerWidth}px;`;
    return `<div style="${textStyleStr};font-size:${scale}em;line-height:${
      scale < 1 ? 1 : 'inherit'
    };">${text}</div>`;
  };

  // data dummy
  const data = [
    {
      type: 'Basic',
      value: 27,
    },
    {
      type: 'Lunch Allowance',
      value: 25,
    },
    {
      type: 'Petrol Allowance',
      value: 18,
    },
    {
      type: 'Mob & Internet Allowance',
      value: 15,
    },
    {
      type: 'Variable Pay',
      value: 10,
    },
    {
      type: 'Deductions',
      value: 5,
    },
  ];

  const config = {
    appendPadding: 0,
    data,
    height: 160,
    width: 160,
    angleField: 'value',
    colorField: 'type',
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
        customHtml: (container, view, datum, newdata) => {
          const { width } = container.getBoundingClientRect();
          const text = datum ? `₹ ${datum.value}` : `₹ ${newdata.reduce((r, d) => r + d.value, 0)}`;
          return renderStatistic(width, text, {
            fontSize: 32,
          });
        },
      },
    },
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
  return (
    <div>
      <Row>
        <Col span={12}>
          <Pie {...config} />
        </Col>
      </Row>
    </div>
  );
};

export default PayDetail;
