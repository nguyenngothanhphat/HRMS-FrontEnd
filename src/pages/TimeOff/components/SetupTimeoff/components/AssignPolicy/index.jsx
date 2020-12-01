import React, { Component } from 'react';
import { Select, Row, Col, Divider } from 'antd';

import styles from './index.less';

class AssignPolicy extends Component {
  onChange = () => {};

  renderItem = () => {
    return (
      <div className={styles.fromBody}>
        <div className={styles.textContent}>Standard Holiday calendar</div>
        <Row>
          <Col span={10}>
            <p>Assign to</p>
            <Select className={styles.select} placeholder="All employees" />
          </Col>
          <Col span={10}>
            <p>Excluding</p>
            <Select className={styles.select} placeholder="None" />
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const array = [
      {
        text: 'Standard Workhours and days',
      },
      {
        text: 'Assign to',
      },
      {
        text: 'Assign to',
      },
      {
        text: 'Assign to',
      },
      {
        text: 'Assign to',
      },
    ];

    return (
      <div className={styles.balance}>
        <div className={styles.balanceFrom}>
          <div className={styles.header}>Standard Holiday calendar</div>
          <Divider />
          {array.map((item) => this.renderItem(item))}
        </div>
      </div>
    );
  }
}

export default AssignPolicy;
