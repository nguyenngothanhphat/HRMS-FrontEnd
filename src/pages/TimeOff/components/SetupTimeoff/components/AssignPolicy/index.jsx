import React, { Component } from 'react';
import { Select, Row, Col } from 'antd';

import styles from './index.less';

class AssignPolicy extends Component {
  onChange = () => {};

  render() {
    return (
      <div className={styles.balance}>
        <div className={styles.balanceFrom}>
          <div className={styles.content}>Assign Policies</div>
          <div className={styles.straightLine} />
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
            <div className={styles.subFrom}>
              <div className={styles.textContent}>Standard Workhours and days</div>
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
          </div>
        </div>
      </div>
    );
  }
}

export default AssignPolicy;
