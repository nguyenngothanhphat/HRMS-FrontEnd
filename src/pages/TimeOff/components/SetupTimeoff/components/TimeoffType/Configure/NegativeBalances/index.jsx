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
    return (
      <div className={styles.contentNegative}>
        <div className={styles.title}>Negative balances</div>
        <div className={styles.borderStyles} />
        <div className={styles.formBody}>
          <Row gutter={[20, 0]}>
            <Col span={10}>
              <div className={styles.titleText}>
                Employees can apply for casual leaves that make their balances negative unto
              </div>
              <Checkbox className={styles.checkbox}>Unlimited negative balances</Checkbox>
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

export default BaseAccual;
