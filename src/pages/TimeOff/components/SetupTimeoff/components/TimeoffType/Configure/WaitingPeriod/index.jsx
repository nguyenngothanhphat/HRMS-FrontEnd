import React, { Component } from 'react';
import { Radio, Checkbox, Row, Col, InputNumber } from 'antd';
import styles from './index.less';

class WaitingPeriod extends Component {
  constructor(props) {
    const {
      waitingPeriod: { afterAmount, date, accrue },
    } = props;
    super(props);
    this.state = {
      afterAmount,
      date,
      accrue,
    };
  }

  // componentDidMount() {
  //   const {
  //     waitingPeriod: { afterAmount, date, accrue },
  //   } = this.props;
  //   this.setState({
  //     afterAmount,
  //     date,
  //     accrue,
  //   });
  // }

  onChangeRadio = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { afterAmount, accrue } = this.state;
    this.setState({
      date: e.target.value,
    });
    const data = {
      date: e.target.value,
      afterAmount,
      accrue,
    };
    onChangeValue(data);
  };

  onChange = (value) => {
    const { onChangeValue = () => {} } = this.props;
    const { date, accrue } = this.state;
    this.setState({
      afterAmount: value,
    });
    const data = {
      date,
      afterAmount: value,
      accrue,
    };
    onChangeValue(data);
  };

  onChangeSelect = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { date, afterAmount } = this.state;
    this.setState({
      accrue: e.target.checked,
    });
    const data = {
      date,
      afterAmount,
      accrue: e.target.checked,
    };
    onChangeValue(data);
  };

  render() {
    const { date, afterAmount, accrue } = this.state;
    const option = [
      { label: 'Days', value: 'day' },
      { label: 'Hours', value: 'hour' },
    ];
    // const {
    //   waitingPeriod: { afterAmount, date, accrue },
    // } = this.props;
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
              <Checkbox
                defaultChecked={accrue}
                className={styles.checkbox}
                onChange={this.onChangeSelect}
              >
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
                    defaultValue={afterAmount}
                    // placeholder="day"
                    // formatter={(value) => `${value} day`}
                    // parser={(value) => value.replace('days', '')}
                    onChange={this.onChange}
                  />
                </Col>
                <Col>
                  <Radio.Group
                    onChange={this.onChangeRadio}
                    value={date}
                    options={option}
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

export default WaitingPeriod;
