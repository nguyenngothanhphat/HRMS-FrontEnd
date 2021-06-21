import React, { Component } from 'react';
import { Radio, Checkbox, Row, Col, InputNumber } from 'antd';
import styles from './index.less';

class Balance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notGreaterThan: 0,
      date: 'day',
      unlimited: 'false',
    };
  }

  componentDidMount() {
    const { maxBalance } = this.props;
    this.setState({
      notGreaterThan: maxBalance.notGreaterThan,
      date: maxBalance.date,
      unlimited: maxBalance.unlimited,
    });
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
    const option = [
      { label: 'Days', value: 'day' },
      { label: 'Hours', value: 'hour' },
    ];
    const {
      maxBalance: { notGreaterThan, date, unlimited },
    } = this.props;
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
              <Checkbox
                defaultChecked={unlimited}
                className={styles.checkbox}
                onChange={this.onChangeSelect}
              >
                Do not limit employee Casual leave balance
              </Checkbox>
            </Col>
            <Col span={12}>
              <Row className={styles.inputText} gutter={[24, 0]}>
                <Col>
                  <InputNumber
                    min={0}
                    max={date === 'day' ? 365 : 12}
                    defaultValue={notGreaterThan}
                    onChange={this.onChange}
                  />
                </Col>
                <Col>
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

export default Balance;
