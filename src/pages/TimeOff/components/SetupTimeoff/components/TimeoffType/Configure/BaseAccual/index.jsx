import React, { Component } from 'react';
import { Radio, Checkbox, Row, Col, InputNumber } from 'antd';
import styles from './index.less';

class BaseAccual extends Component {
  onChange = () => {};

  render() {
    return (
      <div className={styles.content}>
        <div className={styles.title}>Base accrual rate</div>
        <div className={styles.borderStyles} />
        <div className={styles.title}>
          <Row gutter={[20, 0]}>
            <Col span={10}>
              <div className={styles.titleText}>
                During the employee’s 1st year of employment, total casual leave accrued
              </div>
              <Checkbox className={styles.checkbox}>Unlimited causal leave</Checkbox>
            </Col>
            <Col span={12}>
              <div className={styles.inputText}>
                <InputNumber
                  min={1}
                  max={10}
                  formatter={(value) => `${value}days`}
                  parser={(value) => value.replace('days', '')}
                  defaultValue={3}
                />
                <Radio.Group defaultValue="a" buttonStyle="solid">
                  <Radio.Button value="a">Day</Radio.Button>
                  <Radio.Button value="d">Hours</Radio.Button>
                </Radio.Group>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default BaseAccual;
