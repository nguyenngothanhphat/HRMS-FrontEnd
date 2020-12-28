import React, { Component } from 'react';
import { Radio, Checkbox, Row, Col, InputNumber } from 'antd';
import styles from './index.less';

class Balance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balanceRate: '',
      select: 'day',
    };
  }

  onChangeRadio = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { balanceRate } = this.state;
    this.setState({
      select: e.target.value,
    });
    const data = {
      select: e.target.value,
      balanceRate,
    };
    onChangeValue(data);
  };

  onChange = (value) => {
    const { onChangeValue = () => {} } = this.props;
    const { select } = this.state;
    this.setState({
      balanceRate: value,
    });
    const data = {
      select,
      balanceRate: value,
    };
    onChangeValue(data);
  };

  render() {
    const { accrualRate, select } = this.state;
    console.log(accrualRate);
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
              <Checkbox className={styles.checkbox}>
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
        </div>
      </div>
    );
  }
}

export default Balance;
