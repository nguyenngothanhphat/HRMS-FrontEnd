import React, { Component } from 'react';
import { Radio, Checkbox, Row, Col, InputNumber } from 'antd';
import styles from './index.less';

class WaitingPeriod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minimumIncrements: '',
      select: 'day',
    };
  }

  onChangeRadio = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { minimumIncrements } = this.state;
    this.setState({
      select: e.target.value,
    });
    const data = {
      select: e.target.value,
      minimumIncrements,
    };
    onChangeValue(data);
  };

  onChange = (value) => {
    const { onChangeValue = () => {} } = this.props;
    const { select } = this.state;
    this.setState({
      minimumIncrements: value,
    });
    const data = {
      select,
      minimumIncrements: value,
    };
    onChangeValue(data);
  };

  render() {
    const { minimumIncrements, select } = this.state;
    return (
      <div className={styles.content}>
        <div className={styles.title}>Waiting periods</div>
        <div className={styles.borderStyles} />
        <div className={styles.formBody}>
          <Row gutter={[20, 0]}>
            <Col span={10}>
              <div className={styles.titleText}>
                New employees can apply for casual leaves after
              </div>
              <Checkbox className={styles.checkbox}>
                Accrue casual leave during this period
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

export default WaitingPeriod;
