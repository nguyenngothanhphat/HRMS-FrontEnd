import React, { Component } from 'react';
import { Radio, Checkbox, Row, Col, InputNumber } from 'antd';
import styles from './index.less';

class BaseAccual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unto: '',
      date: 'day',
      unlimited: false,
    };
  }

  onChangeRadio = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { unto, unlimited } = this.state;
    this.setState({
      date: e.target.value,
    });
    const data = {
      date: e.target.value,
      unto,
      unlimited,
    };
    onChangeValue(data);
  };

  onChange = (value) => {
    const { onChangeValue = () => {} } = this.props;
    const { date, unlimited } = this.state;
    this.setState({
      unto: value,
    });
    const data = {
      date,
      unto: value,
      unlimited,
    };
    onChangeValue(data);
  };

  onChangeSelect = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { date, unto } = this.state;
    this.setState({
      unlimited: e.target.checked,
    });
    const data = {
      date,
      unto,
      unlimited: e.target.checked,
    };
    onChangeValue(data);
  };

  render() {
    // const { date } = this.state;
    const {
      negativeBalance: { date, unlimited, unto },
    } = this.props;
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
              <Checkbox
                className={styles.checkbox}
                checked={unlimited}
                onChange={this.onChangeSelect}
              >
                Unlimited negative balances
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

export default BaseAccual;
