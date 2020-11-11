import React, { Component } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

class ListSpentTime extends Component {
  onChange = () => {};

  renderItem = (render) => {
    return (
      <Row gutter={[10, 17]} className={styles.item}>
        <Col span={8}>
          <div>{render.period} </div>
        </Col>
        <Col span={8}>
          <div>{render.date} </div>
        </Col>
        <Col span={7}>
          <div>{render.amount} </div>
        </Col>
      </Row>
    );
  };

  render() {
    const array = [
      {
        period: '01/01/2020 - 31/12/2020',
        date: '31/12/2020',
        amount: '10 days',
      },
    ];

    return (
      <div className={styles.root}>
        <Row gutter={[10, 17]} className={styles.backgroundStyles}>
          <Col span={8}>
            <div>Schedule period</div>
          </Col>
          <Col span={8}>
            <div>Accrual date </div>
          </Col>
          <Col span={7}>
            <div>Accrual amount </div>
          </Col>
        </Row>
        {array.map((render) => this.renderItem(render))}
      </div>
    );
  }
}

export default ListSpentTime;
