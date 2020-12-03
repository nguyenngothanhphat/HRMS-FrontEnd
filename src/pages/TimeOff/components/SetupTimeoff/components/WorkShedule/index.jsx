import React, { Component } from 'react';
// import moment from 'moment';
import { Form, InputNumber, Row, Col, Radio, Button, TimePicker } from 'antd';
import s from './index.less';

class WorkShedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value1: 'am',
      value2: 'am',
      array: [
        {
          id: 1,
          name: 'Sun',
        },
        {
          id: 2,
          name: 'Mon',
        },
        {
          id: 3,
          name: 'Tue',
        },
        {
          id: 4,
          name: 'Wed',
        },
        {
          id: 5,
          name: 'Thu',
        },
        {
          id: 6,
          name: 'Fri',
        },
        {
          id: 7,
          name: 'Sat',
        },
      ],
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

  handleClick = (id) => {
    const { array } = this.state;
    const result = array.map((item) => ({
      ...item,
      check: item.id === id ? !item.check : item.check,
    }));
    this.setState({ array: result });
  };

  renderItem = (item = {}) => {
    return (
      <div
        className={item.check ? s.circleActive : s.circle}
        onClick={() => this.handleClick(item.id)}
      >
        <div className={s.padding}>{item.name}</div>
      </div>
    );
  };

  onFinish = (values) => {
    console.log('Success:', values);
  };

  render() {
    const { array } = this.state;
    const format = 'HH:mm';

    const options = [
      { label: 'AM', value: 'am' },
      { label: 'PM', value: 'pm' },
    ];
    const { value1, value2 } = this.state;
    return (
      <div className={s.root}>
        <Form onFinish={this.onFinish}>
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
              <div className={s.form}>
                <Form.Item label="Total Hours in a workday" name="totalHour">
                  <InputNumber min={0} placeholder="hours/day" />
                </Form.Item>
                <Row>
                  <Col>
                    <Form.Item label="Workday end at" name="startAt">
                      <TimePicker format={format} />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item label=" " name="amPM">
                      <Radio.Group
                        options={options}
                        onChange={this.onChange2}
                        value={value1}
                        optionType="button"
                        buttonStyle="solid"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Item label="Workday end at">
                      <TimePicker format={format} />
                    </Form.Item>
                  </Col>
                  <Col>
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
              </div>
              <div className={s.workHour}>Work days</div>
              <div className={`${s.description} ${s.pb17}`}>
                For each day the employee takes off, the number of hours as per the standard work
                schedule will be deducted from the total leave balance.
              </div>
              <div className={s.checkboxWrap}>{array.map((item) => this.renderItem(item))}</div>
            </div>
            <div className={s.straight} />
            <div className={s.flex}>
              <Button className={s.btnSave} type="primary" htmlType="submit">
                Next
              </Button>
              <Button className={s.btnSave}>Next</Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default WorkShedule;
