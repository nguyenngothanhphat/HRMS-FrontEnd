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
    const { array } = this.state;
    const arrayActive = array.filter((item) => item.check === true).map((data) => data.name);
    const { endAmPM, endAt, startAmPM, startAt, totalHour } = values;
    const payload = {
      startWorkDay: { start: startAt, amPM: startAmPM },
      endWorkDay: { start: endAt, amPM: endAmPM },
      totalHour,
      workday: arrayActive,
    };
    console.log(payload);
  };

  render() {
    const { array } = this.state;
    const format = 'HH:mm';

    const options = [
      { label: 'AM', value: 'AM' },
      { label: 'PM', value: 'PM' },
    ];
    const { value1, value2 } = this.state;
    return (
      <div className={s.root}>
        <Form
          onFinish={this.onFinish}
          requiredMark={false}
          initialValues={{
            startAmPM: 'AM',
            endAmPM: 'AM',
          }}
        >
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
              <Row justify="space-between">
                <Col xs={24} sm={24} md={24} lg={7} xl={7} className={s.formInput}>
                  <div className={s.content}>Total Hours in a workday</div>
                  <Form.Item name="totalHour">
                    <InputNumber
                      min={0}
                      max={12}
                      defaultValue={0}
                      placeholder="hours/day"
                      formatter={(value) => `${value} hours/day`}
                      parser={(value) => value.replace('days', '')}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={7} xl={7} className={s.formInput}>
                  <div className={s.content}>Workday start at</div>
                  <Row gutter={[16, 0]}>
                    <Col>
                      <Form.Item name="startAt">
                        <TimePicker format={format} />
                      </Form.Item>
                    </Col>
                    <Col style={{ padding: '5px' }}>
                      <Form.Item name="startAmPM">
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
                </Col>
                <Col xs={24} sm={24} md={24} lg={7} xl={7} className={s.formInput}>
                  <div className={s.content}>Workday end at</div>
                  <Row gutter={[13, 0]}>
                    <Col>
                      <Form.Item name="endAt">
                        <TimePicker format={format} />
                      </Form.Item>
                    </Col>
                    <Col style={{ padding: '5px' }}>
                      <Form.Item name="endAmPM">
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
                </Col>
              </Row>
              <div className={s.bottom}>
                <div className={s.workHour}>Work days</div>
                <div className={`${s.description} ${s.pb17}`}>
                  For each day the employee takes off, the number of hours as per the standard work
                  schedule will be deducted from the total leave balance.
                </div>
                <div className={s.checkboxWrap}>{array.map((item) => this.renderItem(item))}</div>
              </div>
              <div className={s.straight} />
              <div className={s.flex}>
                <Button className={s.btnSave} htmlType="submit">
                  Save
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default WorkShedule;
