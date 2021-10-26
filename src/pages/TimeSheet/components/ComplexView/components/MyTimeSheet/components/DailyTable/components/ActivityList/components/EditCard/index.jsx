import { Col, Form, Input, Row, Select, TimePicker } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import ApproveIcon from '@/assets/timeSheet/approve.svg';
import ArrowDown from '@/assets/timeSheet/arrowDown.svg';
import CancelIcon from '@/assets/timeSheet/cancel.svg';
import ClockIcon from '@/assets/timeSheet/clock.svg';
import styles from './index.less';
import {
  hourFormat,
  minuteStep,
  activityName,
  hourFormatAPI,
  dateFormatAPI,
  MT_SECONDARY_COL_SPAN,
} from '@/utils/timeSheet';
import { getCurrentCompany } from '@/utils/authority';

const { Option } = Select;

const { ACTIVITY, START_TIME, END_TIME, NIGHT_SHIFT, TOTAL_HOURS, NOTES, ACTIONS } =
  MT_SECONDARY_COL_SPAN;

const EditCard = (props) => {
  const [form] = Form.useForm();

  const {
    card: {
      id = '',
      taskName = '',
      startTime = '',
      endTime = '',
      nightShift = false,
      // totalHours = '',
      notes = '',
    } = {},
    cardIndex,
    cardDay = '',
    onCancelCard = () => {},
    top = '',
    height = '',
  } = props;

  const {
    dispatch,
    employee: {
      _id: employeeId = '',
      generalInfo: {
        legalName: empName = '',
        workEmail: empWorkEmail = '',
        userId: empUserId = '',
      } = {} || {},
      departmentInfo: { name: empDepartmentName = '', _id: empDepartmentId = '' } = {} || {},
      managerInfo: {
        _id: managerId = '',
        generalInfo: {
          legalName: managerName = '',
          workEmail: managerWorkEmail = '',
          userId: managerUserId = '',
        } = {} || {},
        department: { name: managerDepartmentName = '', _id: managerDepartmentId = '' } = {} || {},
      } = {} || {},
    } = {} || {},
  } = props;

  const [timeInState, setTimeInState] = useState('');
  const [timeOutState, setTimeOutState] = useState('');

  // use effect
  useEffect(() => {
    if (startTime) {
      setTimeInState(moment(startTime, hourFormatAPI));
    }
    if (endTime) {
      setTimeOutState(moment(endTime, hourFormatAPI));
    }
  }, [startTime, endTime]);

  // main function
  const updateActivityEffect = (values) => {
    const payload = {
      ...values,
      id,
      startTime: moment(values.startTime).format(hourFormatAPI),
      endTime: moment(values.endTime).format(hourFormatAPI),
      employeeId,
      projectName: 'HRMS',
      employee: {
        employeeName: empName,
        employeeCode: empUserId,
        workEmail: empWorkEmail,
        department: {
          name: empDepartmentName,
          id: empDepartmentId,
        },
      },
      // managerInfo: {
      //   employeeName: 'Lewis Manager',
      //   employeeId: '615a5d6bdb04f89a75e7f2e0',
      //   employeeCode: 'lewis-manager',
      //   workEmail: 'lewis-manager@mailinator.com',
      //   department: {
      //     name: 'Engineering',
      //     id: '6153e2ecb51335302899a375',
      //   },
      // },
      managerInfo: {
        employeeName: managerName,
        employeeId: managerId,
        employeeCode: managerUserId,
        workEmail: managerWorkEmail,
        department: {
          name: managerDepartmentName,
          id: managerDepartmentId,
        },
      },
      date: moment(cardDay).format(dateFormatAPI),
      companyId: getCurrentCompany(),
    };

    return dispatch({
      type: 'timeSheet/updateActivityEffect',
      payload,
      date: moment(cardDay).format(dateFormatAPI),
    });
  };

  const onFinish = async (values) => {
    const res = await updateActivityEffect(values);
    if (res.code === 200) {
      onCancelCard();
    }
  };

  // DISABLE TIMEPICKER
  const onChangeTimeIn = (value) => {
    setTimeInState(value);
  };

  const onChangeTimeOut = (value) => {
    setTimeOutState(value);
  };

  // HOURS
  const getDisabledHoursTimeIn = () => {
    if (!timeOutState) return [];
    const hour = moment(timeOutState).hours();
    const minute = moment(timeOutState).minutes();

    const hours = [];
    for (let i = 0; i < 24; i += 1) {
      if (i > hour || (i === hour && minute === 0)) hours.push(i);
    }
    return hours;
  };

  const getDisabledHoursTimeOut = () => {
    if (!timeInState) return [];
    const hour = moment(timeInState).hours();
    const minute = moment(timeInState).minutes();

    const hours = [];
    for (let i = 0; i < 24; i += 1) {
      if (i < hour || (i === hour && minute === 30)) hours.push(i);
    }
    return hours;
  };

  // MINUTES
  const getDisabledMinutesTimeIn = (selectingHour) => {
    if (!timeOutState) return [];

    const minute = moment(timeOutState).minutes();
    const hour = moment(timeOutState).hours();

    const minutes = [];
    for (let i = 0; i < 60; i += 1) {
      if (i >= minute && selectingHour === hour) minutes.push(i);
    }
    return minutes;
  };

  const getDisabledMinutesTimeOut = (selectingHour) => {
    if (!timeInState) return [];

    const minute = moment(timeInState).minute();
    const hour = moment(timeInState).hours();

    const minutes = [];
    for (let i = 0; i < 60; i += 1) {
      if (i <= minute && selectingHour === hour) minutes.push(i);
    }
    return minutes;
  };

  // MAIN AREA
  return (
    <Form
      form={form}
      name="editForm"
      autoComplete="off"
      className={styles.EditCard}
      style={{
        top,
        height,
      }}
      onFinish={onFinish}
      initialValues={{
        taskName,
        startTime: startTime ? moment(startTime, hourFormatAPI) : '',
        endTime: endTime ? moment(endTime, hourFormatAPI) : '',
        nightShift,
        notes,
      }}
    >
      <Row gutter={[12, 0]}>
        <Col span={ACTIVITY} className={`${styles.normalCell} ${styles.boldText}`}>
          <Form.Item name="taskName" rules={[{ required: true }]}>
            <Select suffixIcon={<img src={ArrowDown} alt="" />}>
              {activityName.map((a) => (
                <Option value={a}>{a}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={START_TIME} className={styles.normalCell}>
          <Form.Item name="startTime" rules={[{ required: true }]}>
            <TimePicker
              format={hourFormat}
              minuteStep={minuteStep}
              suffixIcon={<img src={ClockIcon} alt="" />}
              placeholder="Time In"
              disabledHours={getDisabledHoursTimeIn}
              disabledMinutes={getDisabledMinutesTimeIn}
              onChange={onChangeTimeIn}
              allowClear={false}
              use12Hours
              onOpenChange={() => form.validateFields()}
              showNow={false}
            />
          </Form.Item>
        </Col>
        <Col span={END_TIME} className={styles.normalCell}>
          <Form.Item name="endTime" rules={[{ required: true }]}>
            <TimePicker
              format={hourFormat}
              minuteStep={minuteStep}
              suffixIcon={<img src={ClockIcon} alt="" />}
              placeholder="Time Out"
              disabledHours={getDisabledHoursTimeOut}
              disabledMinutes={getDisabledMinutesTimeOut}
              onChange={onChangeTimeOut}
              allowClear={false}
              use12Hours
              showNow={false}
            />
          </Form.Item>
        </Col>
        <Col span={NIGHT_SHIFT} className={styles.normalCell}>
          <Form.Item name="nightShift" rules={[{ required: true }]}>
            <Select suffixIcon={<img src={ArrowDown} alt="" />}>
              <Option value>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={TOTAL_HOURS} className={`${styles.normalCell} ${styles.blueText}`}>
          <Form.Item name="totalHours" />
        </Col>
        <Col span={NOTES} className={styles.normalCell}>
          <Form.Item name="notes" rules={[{ required: true }]}>
            <Input.TextArea autoSize={{ minRows: 4, maxRows: 10 }} />
          </Form.Item>
        </Col>
        <Col span={ACTIONS} className={`${styles.normalCell} ${styles.alignCenter}`}>
          <div className={styles.actionsButton}>
            <button type="submit" htmlType="submit">
              <img type htmlType="submit" src={ApproveIcon} alt="" />
            </button>
            <img
              src={CancelIcon}
              alt=""
              onClick={() => {
                onCancelCard(cardIndex);
              }}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default connect(
  ({ user: { currentUser: { employee = {} } = {} }, timeSheet: { myTimesheet = [] } = {} }) => ({
    myTimesheet,
    employee,
  }),
)(EditCard);
