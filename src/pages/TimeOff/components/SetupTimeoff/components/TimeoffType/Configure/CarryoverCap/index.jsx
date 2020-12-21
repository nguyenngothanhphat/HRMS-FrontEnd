import React, { Component } from 'react';
import { Radio, Row, Col, InputNumber, Select, Checkbox } from 'antd';
import styles from './index.less';

class CarryoverCap extends Component {
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
    return (
      <div className={styles.contentCarryover}>
        <div className={styles.title}>Carryover cap</div>
        <div className={styles.borderStyles} />
        <div className={styles.formBody}>
          <Row gutter={[20, 0]}>
            <Col span={10}>
              <div className={styles.titleText}>
                Employees can carryover casual leaves from one year to next uptown
              </div>
            </Col>
            <Col span={12}>
              <Row className={styles.inputText} gutter={[24, 0]}>
                <Col>
                  <InputNumber
                    min={0}
                    max={12}
                    defaultValue={0}
                    placeholder="day"
                    formatter={(value) => `${value} day`}
                    parser={(value) => value.replace('days', '')}
                    onChange={this.onChange}
                  />
                </Col>
                <Col>
                  <Radio.Group
                    onChange={this.onChangeRadio}
                    value={select}
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
          <Row gutter={[20, 0]}>
            <Col span={10}>
              <div className={styles.titleText}>effective from</div>
            </Col>
            <Col span={12}>
              <Select className={styles.select} placeholder="Select a carryover date" />
            </Col>
          </Row>
          <Row gutter={[20, 0]}>
            <Col span={10}>
              <Checkbox className={styles.checkbox}>
                Do not limit number of hours/days employee carryover
              </Checkbox>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default CarryoverCap;
