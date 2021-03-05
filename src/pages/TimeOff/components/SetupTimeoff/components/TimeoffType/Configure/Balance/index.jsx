import React, { Component } from 'react';
import { Radio, Checkbox, Row, Col, InputNumber } from 'antd';
import styles from './index.less';

class Balance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notGreaterThan: '',
      date: 'day',
      unlimited: 'false',
    };
  }

  onChangeRadio = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { notGreaterThan, unlimited } = this.state;
    this.setState({
      date: e.target.value,
    });
    const data = {
      date: e.target.value,
      notGreaterThan,
      unlimited,
    };
    onChangeValue(data);
  };

  onChange = (value) => {
    const { onChangeValue = () => {} } = this.props;
    const { date, unlimited } = this.state;
    this.setState({
      notGreaterThan: value,
    });
    const data = {
      date,
      notGreaterThan: value,
      unlimited,
    };
    onChangeValue(data);
  };

  onChangeSelect = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { date, notGreaterThan } = this.state;
    this.setState({
      unlimited: e.target.checked,
    });
    const data = {
      date,
      notGreaterThan,
      unlimited: e.target.checked,
    };
    onChangeValue(data);
  };

  render() {
    const { accrualRate, date } = this.state;
    // console.log(accrualRate);
    return (
      <div className={styles.contentbalance}>
        <div className={styles.title}>Maximum balance</div>
        <div className={styles.borderStyles} />
        <div className={styles.formBody}>
          <Row gutter={[20, 0]}>
            <Col span={10}>
              <div className={styles.titleText}>
                At a time, employees cannot have a casual leave balance greater than
              </div>
              <Checkbox className={styles.checkbox} onChange={this.onChangeSelect}>
                Do not limit employee Casual leave balance
              </Checkbox>
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

export default Balance;
