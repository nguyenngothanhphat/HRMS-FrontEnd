import React, { Component } from 'react';
import { Radio, Checkbox, Row, Col, InputNumber } from 'antd';
import styles from './index.less';

class BaseAccual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: '',
      date: 'day',
      unlimited: false,
    };
  }

  onChangeRadio = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { time, unlimited } = this.state;
    this.setState({
      date: e.target.value,
    });
    const data = {
      select: e.target.value,
      time,
      unlimited,
    };
    onChangeValue(data);
  };

  onChange = (value) => {
    const { onChangeValue = () => {} } = this.props;
    const { date, unlimited } = this.state;
    this.setState({
      time: value,
    });
    const data = {
      date,
      time: value,
      unlimited,
    };
    onChangeValue(data);
  };

  onChangeSelect = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { date, time } = this.state;
    this.setState({
      unlimited: e.target.checked,
    });
    const data = {
      date,
      time,
      unlimited: e.target.checked,
    };
    onChangeValue(data);
  };

  render() {
    const { accrualRate, date } = this.state;
    return (
      <div className={styles.contentBaseAccrual}>
        <div className={styles.title}>Base accrual rate</div>
        <div className={styles.borderStyles} />
        <div className={styles.formBody}>
          <Row gutter={[20, 0]}>
            <Col span={10}>
              <div className={styles.titleText}>
                During the employee’s 1st year of employment, total casual leave accrued
              </div>
              <Checkbox className={styles.checkbox} onChange={this.onChangeSelect}>
                Unlimited causal leave
              </Checkbox>
            </Col>
            <Col span={12}>
              <Row className={styles.inputText} gutter={[24, 0]}>
                <Col>
                  <InputNumber
                    min={0}
                    max={12}
                    defaultValue={0}
                    placeholder="days"
                    formatter={(value) => `${value} day`}
                    parser={(value) => value.replace('days', '')}
                    onChange={this.onChange}
                  />
                </Col>
                <Col>
                  <Radio.Group
                    onChange={this.onChangeRadio}
                    value={date}
                    buttonStyle="solid"
                    className={styles.radioGroup}
                  >
                    <Radio.Button value="day">Days</Radio.Button>
                    <Radio.Button value="hour">Hours</Radio.Button>
                  </Radio.Group>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default BaseAccual;
