import React, { Component } from 'react';
import { Form, Input, Row, Col, Radio, Checkbox } from 'antd';
import s from './index.less';

class WorkShedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value1: 'am',
      value2: 'am',
    };
  }

  onChange1 = (e) => {
    this.setState({
      value1: e.target.value,
    });
  };

  onChange2 = (e) => {
    this.setState({
      value2: e.target.value,
    });
  };

  render() {
    const options = [
      { label: 'AM', value: 'am' },
      { label: 'PM', value: 'pm' },
    ];
    const { value1, value2 } = this.state;
    return (
      <div className={s.root}>
        <div className={s.title}>Setup the employee work schedule</div>
        <div className={s.description}>
          How many hours does a regular work day consists of for an employee? How may days does an
          employee work in a week?
        </div>
        <div className={s.formActive}>
          <div className={s.activeText}>Standard work schedule policy</div>
          <div className={s.straight} />
          <div className={s.formWorkHour}>
            <div className={s.workHour}>Work hour</div>
            <div className={`${s.description} ${s.pb17}`}>
              For each day the employee takes off, the number of hours as per the standard work
              schedule will be deducted from the total leave balance.
            </div>
            <Form layout="vertical" className={s.form}>
              <Form.Item label="Total Hours in a workday">
                <Input placeholder="hours/day" />
              </Form.Item>
              <Row>
                <Col span={14}>
                  <Form.Item label="Workday start at">
                    <Input placeholder="hours/day" />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label=" ">
                    <Radio.Group
                      options={options}
                      onChange={this.onChange1}
                      value={value1}
                      optionType="button"
                      buttonStyle="solid"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={14}>
                  <Form.Item label="Workday end at">
                    <Input placeholder="hours/day" />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label=" ">
                    <Radio.Group
                      options={options}
                      onChange={this.onChange2}
                      value={value2}
                      optionType="button"
                      buttonStyle="solid"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <div className={s.workHour}>Work days</div>
            <div className={`${s.description} ${s.pb17}`}>
              For each day the employee takes off, the number of hours as per the standard work
              schedule will be deducted from the total leave balance.
            </div>
            <div className={s.checkboxWrap}>
              <Checkbox>Sunday</Checkbox>
              <Checkbox>Monday</Checkbox>
              <Checkbox>TuesDay</Checkbox>
              <Checkbox>Wednesday</Checkbox>
              <Checkbox>Thursday</Checkbox>
              <Checkbox>Friday</Checkbox>
              <Checkbox>Saturday</Checkbox>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WorkShedule;
