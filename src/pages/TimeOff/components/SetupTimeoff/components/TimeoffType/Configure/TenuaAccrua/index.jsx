import React, { Component } from 'react';
import { Radio, Select, Button, InputNumber, Row, Col } from 'antd';
import styles from './index.less';

class TenuaAccrua extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeDay: '',
      select: 'days',
      dayPerYear: '',
      effective: '',
    };
  }

  onChangeRadio = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { effective, dayPerYear, employeeDay } = this.state;
    this.setState({
      select: e.target.value,
    });
    const data = {
      select: e.target.value,
      effective,
      dayPerYear,
      employeeDay,
    };
    onChangeValue(data);
  };

  onChange = (value) => {
    const { onChangeValue = () => {} } = this.props;
    const { effective, dayPerYear, select } = this.state;
    this.setState({
      employeeDay: value,
    });
    const data = {
      select,
      effective,
      dayPerYear,
      employeeDay: value,
    };
    onChangeValue(data);
  };

  onChangeYear = (value) => {
    const { onChangeValue = () => {} } = this.props;
    const { effective, select, employeeDay } = this.state;
    this.setState({
      dayPerYear: value,
    });
    const data = {
      select,
      effective,
      dayPerYear: value,
      employeeDay,
    };
    onChangeValue(data);
  };

  render() {
    const { select } = this.state;
    return (
      <div className={styles.contentTenua}>
        <div className={styles.flex}>
          <div className={styles.titleText}> Tenure accrual rate</div>
          <div>
            <Button className={styles.btnAdd}>Add a new tenure accrual rate</Button>
          </div>
        </div>
        <div className={styles.borderStyles} />
        <div className={styles.form}>
          <div className={styles.effectForm}>
            <Row gutter={[30, 20]}>
              <Col span={10}>During the employee’s</Col>
              <Col span={10}>
                <InputNumber
                  min={1}
                  max={10}
                  formatter={(value) => `${value}days`}
                  parser={(value) => value.replace('days', '')}
                  onChange={this.onChange}
                />
              </Col>
            </Row>
            <Row gutter={[30, 20]}>
              <Col span={10}>year of employment, additional casual leaves accrued per year is</Col>
              <Col span={10}>
                <Row gutter={[24, 0]}>
                  <Col>
                    <InputNumber
                      min={0}
                      max={10}
                      formatter={(value) => `${value}days`}
                      parser={(value) => value.replace('days', '')}
                      onChange={this.onChangeYear}
                    />
                  </Col>
                  <Col>
                    <Radio.Group
                      value={select}
                      buttonStyle="solid"
                      className={styles.radioGroup}
                      onChange={this.onChangeRadio}
                    >
                      <Radio.Button value="days">Day</Radio.Button>
                      <Radio.Button value="hour">Hours</Radio.Button>
                    </Radio.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={[30, 0]}>
              <Col span={10}>effective from</Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={10}>
                <Select className={styles.select} placeholder="their anniversary date" />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default TenuaAccrua;
