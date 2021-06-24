import React, { Component } from 'react';
import { Radio, Checkbox, Row, Col, InputNumber } from 'antd';
import styles from './index.less';

class BaseAccual extends Component {
  constructor(props) {
    const {
      // baseAccrual,
      baseAccrual: { date, time, unlimited },
    } = props;
    super(props);
    this.state = {
      time,
      date,
      unlimited,
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
    // const { date, time, unlimited } = this.state;
    const option = [
      { label: 'Days', value: 'day' },
      { label: 'Hours', value: 'hour' },
    ];
    const { date, time, unlimited } = this.state;
    return (
      <div className={styles.contentBaseAccrual}>
        <div className={styles.title}>Base accrual rate</div>
        <div className={styles.borderStyles} />
        <div className={styles.formBody}>
          <Row gutter={[24, 12]}>
            <Col span={10}>
              <div className={styles.leftSection}>
                <div className={styles.titleText}>
                  During the employee’s 1st year of employment, total casual leave accrued
                </div>
                <Checkbox
                  className={styles.checkbox}
                  defaultChecked={unlimited}
                  onChange={(e) => this.onChangeSelect(e)}
                >
                  Unlimited casual leave
                </Checkbox>
              </div>
            </Col>
            <Col span={14} className={styles.rightSection}>
              <Row className={styles.inputText} gutter={[24, 0]}>
                <Col>
                  <InputNumber
                    min={0}
                    max={date === 'day' ? 365 : 12}
                    // defaultValue={0}
                    defaultValue={time}
                    // placeholder={date === 'day' ? 'days' : 'hours'}
                    // formatter={(value) => (date === 'day' ? `${value} days` : `${value} hours`)}
                    // parser={(value) =>
                    //   date === 'day' ? value.replace('days', '') : value.replace('hours', '')
                    // }
                    onChange={this.onChange}
                  />
                </Col>
                <Col style={{ paddingLeft: '1px !important' }}>
                  {/* <div className={styles.radioTime}> */}
                  <Radio.Group
                    onChange={this.onChangeRadio}
                    options={option}
                    value={date}
                    optionType="button"
                    buttonStyle="solid"
                    className={styles.radioGroup}
                  />
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
