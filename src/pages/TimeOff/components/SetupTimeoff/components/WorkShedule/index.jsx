import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Form, InputNumber, Row, Col, Radio, Button, TimePicker, Spin } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

import s from './index.less';

@connect(
  ({
    loading,
    timeOff: { employeeSchedule: getByLocation } = {},
    user: { currentUser: { location: { _id: idLocation = '' } = {} } = {} } = {},
  }) => ({
    idLocation,
    loading: loading.effects['timeOff/getEmployeeScheduleByLocation'],
    getByLocation,
  }),
)
class WorkShedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      check: false,
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
        },
        {
          id: 3,
          text: 'TUESDAY',
          name: 'Tue',
        },
        {
          id: 4,
          text: 'WEDNESDAY',
          name: 'Wed',
        },
        {
          id: 5,
          text: 'THURSDAY',
          name: 'Thu',
        },
        {
          id: 6,
          text: 'FRIDAY',
          name: 'Fri',
        },
        {
          id: 7,
          name: 'Sat',
          text: 'SATURDAY',
        },
      ],
      startTime: '',
      endTime: '',
    };
  }

  componentDidMount() {
    const { dispatch, idLocation } = this.props;

    dispatch({
      type: 'timeOff/getInitEmployeeSchedule',
      payload: { location: idLocation },
    }).then(
      dispatch({
        type: 'timeOff/getEmployeeScheduleByLocation',
        payload: { location: idLocation },
      }),
    );
  }

  handleClick = (id, formatArray) => {
    const result = formatArray.map((item) => ({
      ...item,
      checked: item.id === id ? !item.checked : item.checked,
    }));
    this.setState({ array: result, check: true });
  };

  renderItem = (item = {}, formatArray = []) => {
    return (
      <div
        className={item.checked ? s.circleActive : s.circle}
        onClick={() => this.handleClick(item.id, formatArray)}
      >
        <div className={s.padding}>{item.name}</div>
      </div>
    );
  };

  selectStartTime = (time, timeString) => {
    this.setState({
      startTime: timeString,
    });
  };

  selectEndTime = (time, timeString) => {
    this.setState({
      endTime: timeString,
    });
  };

  onFinish = (values, formatArray) => {
    const { getByLocation, dispatch } = this.props;
    const { _id } = getByLocation;
    const { startTime, endTime } = this.state;
    const arrayActive = formatArray.filter((item) => item.checked === true);
    const arrayFiler = arrayActive.map((item) => ({ checked: item.checked, date: item.text }));
    const { endAmPM, startAmPM, totalHour } = values;

    const payload = {
      startWorkDay: { start: startTime || '8:00', amPM: startAmPM },
      endWorkDay: { end: endTime || '17:00', amPM: endAmPM },
      totalHour,
      workDay: arrayFiler,
      _id,
    };
    dispatch({
      type: 'timeOff/updateEmployeeSchedule',
      payload,
    });
  };

  renderIcons = () => (
    <div className={s.listIcons}>
      <UpOutlined className={s.itemIcon} />
      <DownOutlined className={s.itemIcon} />
    </div>
  );

  render() {
    const format = 'HH:mm';

    // const options = [
    //   { label: 'AM', value: 'AM' },
    //   { label: 'PM', value: 'PM' },
    // ];
    const { array = [], check } = this.state;
    const { getByLocation, loading } = this.props;
    const {
      endWorkDay: { end: endTime, amPM: afternoon } = {},
      startWorkDay: { start: startTime, amPM: beforenoon } = {},
      workDay = [],
      totalHour,
    } = getByLocation;

    let formatArray = [...array];
    if (check === false) {
      workDay.forEach((workDayItem) => {
        formatArray = formatArray.map((resultItem) => ({
          ...resultItem,
          checked: resultItem.text === workDayItem.date ? workDayItem.checked : resultItem.checked,
        }));
      });
    }

    return (
      <div className={s.root}>
        <Row>
          <Form
            onFinish={(values) => this.onFinish(values, formatArray)}
            requiredMark={false}
            initialValues={{
              startAmPM: 'AM',
              endAmPM: 'PM',
            }}
          >
            <div className={s.title}>Setup the standard company Holiday Calendar</div>
            <div className={s.description}>
              Below is a list of holidays celebrated in your region/country. Select the ones for
              which your company provides holidays. You may add holidays to the list as well.
            </div>
            {loading ? (
              <div className={s.center}>
                <Spin />
              </div>
            ) : (
              <div className={s.formActive}>
                <div className={s.activeText}>
                  <span>Standard work schedule policy</span>
                  <div className={s.editIcon}>
                    <img src="/assets/images/edit.svg" alt="edit" className={s.editImg} />
                    <span className={s.editText}>Edit</span>
                  </div>
                </div>
                <div className={s.straight} />
                <div className={s.formWorkHour}>
                  <div className={s.workHour}>Work hour</div>
                  <div className={`${s.description} ${s.pb17}`}>
                    For each day the employee takes off, the number of hours as per the standard
                    work schedule will be deducted from the total leave balance.
                  </div>
                  <Row justify="space-between">
                    <Col span={7} className={s.formInput}>
                      <div>
                        <div className={s.content}>Total hours in a workday</div>
                        <Form.Item name="totalHour">
                          <InputNumber
                            min={0}
                            max={12}
                            defaultValue={totalHour}
                            placeholder="hours/day"
                            formatter={(value) => `${value} hours/day`}
                            parser={(value) => value.replace('days', '')}
                          />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={8} className={s.formInput}>
                      <div>
                        <div className={s.content}>Workday starts at</div>
                        <Row gutter={[16, 0]}>
                          <Col>
                            <Form.Item name="startAt">
                              <TimePicker
                                format={format}
                                defaultValue={moment(startTime, format)}
                                onChange={this.selectStartTime}
                                suffixIcon={this.renderIcons()}
                              />
                            </Form.Item>
                          </Col>
                          <Col style={{ padding: '2px' }} className={s.radioSection}>
                            <Form.Item name="startAmPM">
                              {/* <div className={s.radioTime}> */}
                              <Radio.Group
                                // options={options}
                                // onChange={this.onChange1}
                                defaultValue={beforenoon}
                                optionType="button"
                                buttonStyle="solid"
                                className={s.radioGroup}
                              >
                                <Radio.Button value="AM">AM</Radio.Button>
                                <Radio.Button value="PM">PM</Radio.Button>
                              </Radio.Group>
                              {/* </div> */}
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col span={8} className={s.formInput}>
                      <div>
                        <div className={s.content}>Workday ends at</div>
                        <Row gutter={[16, 0]}>
                          <Col>
                            <Form.Item name="endAt">
                              <TimePicker
                                format={format}
                                onChange={this.selectEndTime}
                                defaultValue={moment(endTime, format)}
                                suffixIcon={this.renderIcons()}
                              />
                            </Form.Item>
                          </Col>
                          <Col style={{ padding: '2px' }} className={s.radioSection}>
                            <Form.Item name="endAmPM">
                              <div className={s.radioTime}>
                                <Radio.Group
                                  // options={options}
                                  // onChange={this.onChange2}
                                  defaultValue={afternoon}
                                  optionType="button"
                                  buttonStyle="solid"
                                  className={s.radioGroup}
                                >
                                  <Radio.Button value="AM">AM</Radio.Button>
                                  <Radio.Button value="PM">PM</Radio.Button>
                                </Radio.Group>
                              </div>
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                  <div className={s.bottom}>
                    <div className={s.workHour}>Work days</div>
                    <div className={`${s.description} ${s.pb17}`}>
                      Only for the days selected below, timeoff hours will be deducted from the
                      total leave balance
                    </div>
                    <div className={s.checkboxWrap}>
                      {formatArray.map((item) => this.renderItem(item, formatArray))}
                    </div>
                  </div>
                </div>
                <div className={s.straight} />
                <div className={s.flex}>
                  <Button htmlType="submit">Save</Button>
                </div>
              </div>
            )}
          </Form>
        </Row>
      </div>
    );
  }
}

export default WorkShedule;
