import React, { Component } from 'react';
import { Radio, Checkbox, Row, Col, InputNumber } from 'antd';
import styles from './index.less';

class BaseAccual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accrualRate: '',
      select: 'day',
    };
  }

  onChangeRadio = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { accrualRate } = this.state;
    this.setState({
      select: e.target.value,
    });
    const data = {
      select: e.target.value,
      accrualRate,
    };
    onChangeValue(data);
  };

  onChange = (value) => {
    const { onChangeValue = () => {} } = this.props;
    const { select } = this.state;
    this.setState({
      accrualRate: value,
    });
    const data = {
      select,
      accrualRate: value,
    };
    onChangeValue(data);
  };

  render() {
    const { accrualRate, select } = this.state;
    console.log(accrualRate);
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
                  onChange={this.onChange}
                />
                <Radio.Group onChange={this.onChangeRadio} value={select} buttonStyle="solid">
                  <Radio.Button value="day">Day</Radio.Button>
                  <Radio.Button value="hour">Hours</Radio.Button>
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
