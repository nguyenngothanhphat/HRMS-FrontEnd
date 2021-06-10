import React, { Component } from 'react';
import { Radio, Row, Col, InputNumber, Select, Checkbox } from 'antd';
import styles from './index.less';

class CarryoverCap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uptownAmount: '',
      date: 'day',
      unlimited: false,
    };
  }

  onChangeRadio = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { uptownAmount, unlimited } = this.state;
    this.setState({
      date: e.target.value,
    });
    const data = {
      date: e.target.value,
      uptownAmount,
      unlimited,
    };
    onChangeValue(data);
  };

  onChange = (value) => {
    const { onChangeValue = () => {} } = this.props;
    const { date, unlimited } = this.state;
    this.setState({
      uptownAmount: value,
    });
    const data = {
      date,
      uptownAmount: value,
      unlimited,
    };
    onChangeValue(data);
  };

  onChangeSelect = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { date, uptownAmount } = this.state;
    this.setState({
      unlimited: e.target.checked,
    });
    const data = {
      date,
      uptownAmount,
      unlimited: e.target.checked,
    };
    onChangeValue(data);
  };

  render() {
    const { date } = this.state;
    const {
      carryoverCap: { date: dateData, effectiveFrom, unlimited, uptownAmount },
    } = this.props;
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
                    max={date === 'day' ? 365 : 12}
                    // defaultValue={0}
                    value={uptownAmount}
                    placeholder={date === 'day' ? 'days' : 'hours'}
                    formatter={(value) => (date === 'day' ? `${value} days` : `${value} hours`)}
                    parser={(value) =>
                      date === 'day' ? value.replace('days', '') : value.replace('hours', '')
                    }
                    onChange={this.onChange}
                  />
                </Col>
                <Col>
                  <Radio.Group
                    onChange={this.onChangeRadio}
                    value={dateData}
                    buttonStyle="solid"
                    className={styles.radioGroup}
                  >
                    <Radio.Button value="Day">Days</Radio.Button>
                    <Radio.Button value="Hour">Hours</Radio.Button>
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
              <Select className={styles.date} placeholder="Select a carryover date" />
            </Col>
          </Row>
          <Row gutter={[20, 0]}>
            <Col span={10}>
              <Checkbox
                className={styles.checkbox}
                checked={unlimited}
                onChange={this.onChangeSelect}
              >
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
