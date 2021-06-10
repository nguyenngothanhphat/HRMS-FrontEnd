import React, { Component } from 'react';
import { Radio, Checkbox, Row, Col, InputNumber } from 'antd';
import styles from './index.less';

class WaitingPeriod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      afterAmount: '',
      date: 'day',
      unlimited: false,
    };
  }

  onChangeRadio = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { afterAmount, unlimited } = this.state;
    this.setState({
      date: e.target.value,
    });
    const data = {
      date: e.target.value,
      afterAmount,
      unlimited,
    };
    onChangeValue(data);
  };

  onChange = (value) => {
    const { onChangeValue = () => {} } = this.props;
    const { date, unlimited } = this.state;
    this.setState({
      afterAmount: value,
    });
    const data = {
      date,
      afterAmount: value,
      unlimited,
    };
    onChangeValue(data);
  };

  onChangeSelect = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { date, afterAmount } = this.state;
    this.setState({
      unlimited: e.target.checked,
    });
    const data = {
      date,
      afterAmount,
      unlimited: e.target.checked,
    };
    onChangeValue(data);
  };

  render() {
    const { date } = this.state;
    const {
      waitingPeriod: { afterAmount, date: dateData, accrue },
    } = this.props;
    return (
      <div className={styles.contentWaiting}>
        <div className={styles.title}>Waiting periods</div>
        <div className={styles.borderStyles} />
        <div className={styles.formBody}>
          <Row gutter={[20, 0]}>
            <Col span={10}>
              <div className={styles.titleText}>
                New employees can apply for casual leaves after
              </div>
              <Checkbox checked={accrue} className={styles.checkbox} onChange={this.onChangeSelect}>
                Accrue casual leave during this period
              </Checkbox>
            </Col>
            <Col span={12}>
              <Row className={styles.inputText} gutter={[24, 0]}>
                <Col>
                  <InputNumber
                    min={0}
                    max={12}
                    // defaultValue={0}
                    value={afterAmount}
                    placeholder="day"
                    formatter={(value) => `${value} day`}
                    parser={(value) => value.replace('days', '')}
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
        </div>
      </div>
    );
  }
}

export default WaitingPeriod;
