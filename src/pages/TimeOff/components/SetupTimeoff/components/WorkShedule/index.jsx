import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Form, InputNumber, Row, Col, Radio, Button, TimePicker, Spin } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

import { getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import s from './index.less';

@connect(
  ({
    loading,
    timeOff: { employeeSchedule = {} } = {},
    user: { currentUser: { location: { _id: idLocation = '' } = {} } = {} } = {},
  }) => ({
    idLocation,
    loading: loading.effects['timeOff/getEmployeeScheduleByLocation'],
    employeeSchedule,
  }),
)
class WorkShedule extends Component {
  formRef = React.createRef();

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
      edit: true,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/getEmployeeScheduleByLocation',
      payload: { location: getCurrentLocation(), tenantId: getCurrentTenant() },
    });
  }

  handleClick = (id, formatArray) => {
    const result = formatArray.map((item) => ({
      ...item,
      checked: item.id === id ? !item.checked : item.checked,
    }));
    this.setState({ array: result, check: true });
  };

  renderItem = (item = {}, formatArray = []) => {
    const { edit } = this.state;
    return (
      // <div
      //   className={item.checked ? s.circleActive : s.circle}
      //   onClick={() => this.handleClick(item.id, formatArray)}
      // >
      <Button
        // className={s.padding}
        disabled={edit}
        className={item.checked ? s.circleActive : s.circle}
        onClick={() => this.handleClick(item.id, formatArray)}
      >
        {item.name}
      </Button>
      // </div>
    );
  };

  selectStartTime = (timeString) => {
    this.setState({
      startTime: timeString,
    });
  };

  selectEndTime = (timeString) => {
    this.setState({
      endTime: timeString,
    });
  };

  onChangeEdit = () => {
    this.setState({
      edit: false,
    });
  };

  onFinish = (values, formatArray) => {
    const { employeeSchedule, dispatch, idLocation } = this.props;
    const { edit } = this.state;
    const { _id } = employeeSchedule;
    const arrayActive = formatArray.filter((item) => item.checked === true);
    const arrayFiler = arrayActive.map((item) => ({ checked: item.checked, date: item.text }));
    const { endAmPM, startAmPM, totalHour, endAt, startAt } = values;

    const payload = {
      startWorkDay: { start: startAt.format('HH:mm'), amPM: startAmPM },
      endWorkDay: { end: endAt.format('HH:mm'), amPM: endAmPM },
      totalHour,
      workDay: arrayFiler,
      _id,
      location: idLocation,
      tenantId: getCurrentTenant(),
    };

    this.setState({ edit: !edit });
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

  handleCancel = (formatArray) => {
    const { employeeSchedule, dispatch } = this.props;
    const { edit } = this.state;
    const {
      endWorkDay: { end: endTime, amPM: afternoon } = {},
      startWorkDay: { start: startTime, amPM: beforenoon } = {},
      // workDay = [],
      totalHour,
      workDay,
    } = employeeSchedule;

    this.setState({ edit: !edit });
    const format = 'HH:mm';

    this.formRef.current.setFieldsValue({
      amPM: beforenoon,
      afternoon,
      totalHour,
      start: moment(startTime, format),
      end: moment(endTime, format),
    });

    dispatch({
      type: 'timeOff/save',
      payload: { employeeSchedule },
    });
  };

  render() {
    const format = 'HH:mm';

    // const options = [
    //   { label: 'AM', value: 'AM' },
    //   { label: 'PM', value: 'PM' },
    // ];
    const { array = [], check, edit } = this.state;
    const { employeeSchedule, loading } = this.props;
    const {
      endWorkDay: { end: endTime, amPM: afternoon } = {},
      startWorkDay: { start: startTime, amPM: beforenoon } = {},
      workDay = [],
      totalHour,
    } = employeeSchedule;

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
        <div className={s.title}>Setup the standard company Holiday Calendar</div>
        <div className={s.description}>
          Below is a list of holidays celebrated in your region/country. Select the ones for which
          your company provides holidays. You may add holidays to the list as well.
        </div>
        {loading ? (
          <div className={s.center}>
            <Spin />
          </div>
        ) : (
          <Row>
            <Form
              ref={this.formRef}
              onFinish={(values) => this.onFinish(values, formatArray)}
              // onFinish={(values) => console.log(values)}
              requiredMark={false}
              initialValues={{
                startAmPM: beforenoon,
                endAmPM: afternoon,
                totalHour,
                startAt: moment(startTime, 'HH:mm'),
                endAt: moment(endTime, 'HH:mm'),
              }}
            >
              <div className={s.formActive}>
                <div className={s.activeText}>
                  <span>Standard work schedule policy</span>
                  <div className={s.editIcon}>
                    <img src="/assets/images/edit.svg" alt="edit" className={s.editImg} />
                    <span className={s.editText} onClick={this.onChangeEdit}>
                      Edit
                    </span>
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
                            max={24}
                            disabled={edit}
                            placeholder="hours/day"
                            formatter={(value) => `${value} hours/day`}
                            parser={(value) => value.replace('days', '')}
                            onChange={this.onChangeEdit}
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
                                onChange={this.selectStartTime}
                                value={moment(startTime, format)}
                                disabled={edit}
                                suffixIcon={this.renderIcons()}
                                allowClear={false}
                              />
                            </Form.Item>
                          </Col>
                          <Col style={{ padding: '2px' }} className={s.radioSection}>
                            <Form.Item name="startAmPM">
                              <Radio.Group
                                onChange={this.onChangeEdit}
                                optionType="button"
                                buttonStyle="solid"
                                disabled={edit}
                                className={s.radioGroup}
                              >
                                <Radio.Button value="AM">AM</Radio.Button>
                                <Radio.Button value="PM">PM</Radio.Button>
                              </Radio.Group>
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
                                disabled={edit}
                                onChange={this.selectEndTime}
                                value={moment(endTime, format)}
                                suffixIcon={this.renderIcons()}
                                allowClear={false}
                              />
                            </Form.Item>
                          </Col>
                          <Col style={{ padding: '2px' }} className={s.radioSection}>
                            <Form.Item name="endAmPM">
                              <Radio.Group
                                onChange={this.onChangeEdit}
                                optionType="button"
                                disabled={edit}
                                buttonStyle="solid"
                                className={s.radioGroup}
                              >
                                <Radio.Button value="AM">AM</Radio.Button>
                                <Radio.Button value="PM">PM</Radio.Button>
                              </Radio.Group>
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                  <div className={s.bottom}>
                    <p className={s.workHour}>Work days</p>
                    <p className={`${s.description} ${s.pb17}`}>
                      Only for the days selected below, timeoff hours will be deducted from the
                      total leave balance
                    </p>
                    <div className={s.checkboxWrap}>
                      {formatArray.map((item) => this.renderItem(item, formatArray))}
                    </div>
                  </div>
                </div>
                <div className={s.straight} />
                <div className={s.flex}>
                  {edit ? (
                    <></>
                  ) : (
                    <>
                      <Button
                        onClick={() => this.handleCancel(formatArray)}
                        className={s.cancelBtn}
                      >
                        Cancel
                      </Button>
                      <Button className={s.btnSave} htmlType="submit">
                        Save
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Form>
          </Row>
        )}
      </div>
    );
  }
}

export default WorkShedule;
