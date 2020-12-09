import React, { Component } from 'react';
import { Checkbox, Row, Col, Select } from 'antd';
import styles from './index.less';

class AnnualReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resetDate: '',
    };
  }

  render() {
    return (
      <div className={styles.content}>
        <div className={styles.title}>Annual reset</div>
        <div className={styles.borderStyles} />
        <div className={styles.formBody}>
          <Row gutter={[20, 0]}>
            <Col span={10}>
              <div className={styles.titleText}>
                During the employee’s 1st year of employment, total casual leave accrued
              </div>
              <Checkbox className={styles.checkbox}>Unlimited causal leave</Checkbox>
            </Col>
            <Col span={12}>
              <Select className={styles.select} placeholder="Select a reset date" />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default AnnualReset;
