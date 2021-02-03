import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Form, InputNumber, Row, Col, Radio, Button, TimePicker } from 'antd';
import s from './index.less';

@connect(
  ({ timeOff, user: { currentUser: { location: { _id: idLocation = '' } = {} } = {} } = {} }) => ({
    timeOff,
    idLocation,
  }),
)
class WorkShedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value1: 'AM',
      value2: 'PM',
      array: [
        {
          id: 1,
          text: 'SUNDAY',
          name: 'Sun',
        },
        {
          id: 2,
          text: 'MONDAY',
          name: 'Mon',
          check: true,
        },
        {
          id: 3,
          text: 'TUESDAY',
          name: 'Tue',
          check: true,
        },
        {
          id: 4,
          text: 'WEDNESDAY',
          name: 'Wed',
          check: true,
        },
        {
          id: 5,
          text: 'THURSDAY',
          name: 'Thu',
          check: true,
        },
        {
          id: 6,
          text: 'FRIDAY',
          name: 'Fri',
          check: true,
        },
        {
          id: 7,
          name: 'Sat',
          text: 'SATURDAY',
        },
      ],
    };
  }

  componentDidMount() {
    const { dispatch, idLocation } = this.props;
    dispatch({
      type: 'timeOff/getInitEmployeeSchedule',
    }).then(
      dispatch({
        type: 'timeOff/getEmployeeScheduleByLocation',
        payload: { location: idLocation },
      }).then((response = {}) => {
        const { statusCode, data: listData = {} } = response;
        if (statusCode === 200) {
          const { totalHour, startWorkDay = {}, endWorkDay = {}, workDay = [] } = listData;
        }
      }),
    );
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
    const arrayActive = array.filter((item) => item.check === true);
    const arrayFiler = arrayActive.map((item) => ({ check: item.check, name: item.name }));

    const { endAmPM, endAt, startAmPM, startAt, totalHour } = values;
    const payload = {
      startWorkDay: { start: startAt, amPM: startAmPM },
      endWorkDay: { start: endAt, amPM: endAmPM },
      totalHour,
      workday: arrayFiler,
    };
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
            endAmPM: 'PM',
            totalHour: 8,
            startAt: moment('8', format),
            endAt: moment('17', format),
          }}
        >
          <div className={s.title}>Setup the employee work schedule</div>
          <div className={s.description}>
            How many hours does a regular work day consists of for an employee? How may days does an
            employee work in a week?
          </div>
          <div className={s.formActive}>
            <div className={s.activeText}>
              <span>Standard work schedule policy</span>
            </div>
            <div className={s.straight} />
            <div className={s.formWorkHour}>
              <div className={s.workHour}>Work hour</div>

              <div className={`${s.description} ${s.pb17}`}>
                For each day the employee takes off, the number of hours as per the standard work
                schedule will be deducted from the total leave balance.
              </div>
              <Row justify="space-between">
                <Col xs={24} sm={24} md={24} lg={12} xl={7} className={s.formInput}>
                  <div className={s.content}>Total Hours in a workday</div>
                  <Form.Item name="totalHour">
                    <InputNumber
                      min={0}
                      max={12}
                      defaultValue={8}
                      placeholder="hours/day"
                      formatter={(value) => `${value} hours/day`}
                      parser={(value) => value.replace('days', '')}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={7} className={s.formInput}>
                  <div className={s.content}>Workday start at</div>
                  <Row gutter={[16, 0]}>
                    <Col>
                      <Form.Item name="startAt">
                        <TimePicker format={format} />
                      </Form.Item>
                    </Col>
                    <Col style={{ padding: '2px' }}>
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
                <Col xs={24} sm={24} md={24} lg={24} xl={7} className={s.formInput}>
                  <div className={s.content}>Workday end at</div>
                  <Row gutter={[16, 0]}>
                    <Col>
                      <Form.Item name="endAt">
                        <TimePicker format={format} value={moment('5:00', format)} />
                      </Form.Item>
                    </Col>
                    <Col style={{ padding: '2px' }}>
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
            </div>
            <div className={s.straight} />
            <div className={s.flex}>
              <Button htmlType="submit">Save</Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default WorkShedule;
