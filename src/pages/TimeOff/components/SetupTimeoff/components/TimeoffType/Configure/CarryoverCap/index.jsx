import React, { Component } from 'react';
import { Radio, Row, Col, InputNumber, DatePicker, Checkbox } from 'antd';
import moment from 'moment';
import styles from './index.less';

const dateFormat = 'MM-DD-YYYY';
class CarryoverCap extends Component {
  constructor(props) {
    const {
      carryoverCap: { date, effectiveFrom, unlimited, uptownAmount },
    } = props;
    super(props);
    this.state = {
      uptownAmount,
      date,
      unlimited,
      effectiveFrom: moment(effectiveFrom).locale('en').format(dateFormat),
    };
  }

  // componentDidMount() {
  //   const {
  //     carryoverCap: { date, effectiveFrom, unlimited, uptownAmount },
  //   } = this.props;
  //   this.setState({
  //     date,
  //     effectiveFrom,
  //     unlimited,
  //     uptownAmount,
  //   });
  // }

  onChangeRadio = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { uptownAmount, unlimited, effectiveFrom } = this.state;
    this.setState({
      date: e.target.value,
    });
    const data = {
      date: e.target.value,
      uptownAmount,
      unlimited,
      effectiveFrom,
    };
    onChangeValue(data);
  };

  onChange = (value) => {
    const { onChangeValue = () => {} } = this.props;
    const { date, unlimited, effectiveFrom } = this.state;
    this.setState({
      uptownAmount: value,
    });
    const data = {
      date,
      uptownAmount: value,
      unlimited,
      effectiveFrom,
    };
    onChangeValue(data);
  };

  onChangeSelect = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { date, uptownAmount, effectiveFrom } = this.state;
    this.setState({
      unlimited: e.target.checked,
    });
    const data = {
      date,
      uptownAmount,
      effectiveFrom,
      unlimited: e.target.checked,
    };
    onChangeValue(data);
  };

  onChangeDate = (value) => {
    const { onChangeValue = () => {} } = this.props;
    const { date, uptownAmount, unlimited } = this.state;
    this.setState({
      effectiveFrom: value,
    });
    const data = {
      date,
      uptownAmount,
      effectiveFrom: value,
      unlimited,
    };
    onChangeValue(data);
  };

  render() {
    const { date, uptownAmount, unlimited, effectiveFrom } = this.state;
    const option = [
      { label: 'Days', value: 'day' },
      { label: 'Hours', value: 'hour' },
    ];

    const dateEffect = moment(effectiveFrom).locale('en').format(dateFormat);
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
                    defaultValue={uptownAmount}
                    // placeholder={date === 'day' ? 'days' : 'hours'}
                    // formatter={(value) => (date === 'day' ? `${value} days` : `${value} hours`)}
                    // parser={(value) =>
                    //   date === 'day' ? value.replace('days', '') : value.replace('hours', '')
                    // }
                    onChange={this.onChange}
                  />
                </Col>
                <Col>
                  <Radio.Group
                    onChange={this.onChangeRadio}
                    defaultValue={date}
                    buttonStyle="solid"
                    optionType="button"
                    options={option}
                    className={styles.radioGroup}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={[20, 0]}>
            <Col span={10}>
              <div className={styles.titleText}>effective from</div>
            </Col>
            <Col span={12}>
              {/* <Select className={styles.date} placeholder="Select a carryover date" /> */}
              <DatePicker
                value={moment(dateEffect, dateFormat)}
                format={dateFormat}
                onChange={this.onChangeDate}
              />
            </Col>
          </Row>
          <Row gutter={[20, 0]}>
            <Col span={10}>
              <Checkbox
                className={styles.checkbox}
                defaultChecked={unlimited}
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
