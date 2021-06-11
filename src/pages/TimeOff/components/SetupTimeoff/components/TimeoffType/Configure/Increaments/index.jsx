import React, { Component } from 'react';
import { Radio, Checkbox, Row, Col, InputNumber } from 'antd';
import styles from './index.less';

class Increaments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      min: 0,
      date: '',
      notImpose: false,
    };
  }

  componentDidMount() {
    const {
      minIncrements: { min, date, notImpose },
    } = this.props;
    this.setState({
      min,
      date,
      notImpose,
    });
  }

  onChangeRadio = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { min, notImpose } = this.state;
    this.setState({
      date: e.target.value,
    });
    const data = {
      min,
      date: e.target.value,
      notImpose,
    };
    onChangeValue(data);
  };

  onChange = (value) => {
    const { onChangeValue = () => {} } = this.props;
    const { date, notImpose } = this.state;
    this.setState({
      min: value,
    });
    const data = {
      min: value,
      date,
      notImpose,
    };
    onChangeValue(data);
  };

  onChecked = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { min, date } = this.state;
    this.setState({
      notImpose: e.target.checked,
    });
    const data = {
      min,
      date,
      notImpose: e.target.checked,
    };
    onChangeValue(data);
  };

  render() {
    const { min, date, notImpose } = this.state;
    const option = [
      { label: 'Days', value: 'day' },
      { label: 'Hours', value: 'hour' },
    ];
    return (
      <div className={styles.contentIncrements}>
        <div className={styles.title}>Minimum increments</div>
        <div className={styles.borderStyles} />
        <div className={styles.formBody}>
          <Row gutter={[20, 0]}>
            <Col span={10}>
              <div className={styles.titleText}>
                Employees can apply for casual leaves in a minimum increments of
              </div>
              <Checkbox
                defaultChecked={notImpose}
                onChange={this.onChecked}
                className={styles.checkbox}
              >
                Do not impose a minimum increment
              </Checkbox>
            </Col>
            <Col span={12}>
              <Row className={styles.inputText} gutter={[24, 0]}>
                <Col>
                  <InputNumber
                    min={0}
                    max={12}
                    defaultValue={min}
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

export default Increaments;
