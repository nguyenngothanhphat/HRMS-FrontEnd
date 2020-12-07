import React, { Component } from 'react';
import { Radio, Select, Button, InputNumber, Row, Col } from 'antd';
import styles from './index.less';

class TenuaAccrua extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeDay: '',
      select: 'day',
      dayPerYear: '',
      effective: '',
    };
  }

  onChange = () => {};

  render() {
    const { select, employeeDay, effective, dayPerYear } = this.state;
    return (
      <div className={styles.contentTenua}>
        <div className={styles.flex}>
          <div className={styles.titleText}> Tenure accrual rate</div>
          <div>
            <Button>Add a new tenure accrual rate</Button>
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
                <InputNumber
                  min={0}
                  max={10}
                  formatter={(value) => `${value}days`}
                  parser={(value) => value.replace('days', '')}
                />
                <Radio.Group value={select} buttonStyle="solid">
                  <Radio.Button value="day">Day</Radio.Button>
                  <Radio.Button value="hour">Hours</Radio.Button>
                </Radio.Group>
              </Col>
            </Row>
            <Row gutter={[30, 20]}>
              <Col span={10}>effective from</Col>
              <Col span={10}>
                <Select className={styles.select} />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default TenuaAccrua;
