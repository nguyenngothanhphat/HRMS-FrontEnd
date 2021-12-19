import { Col, Form, Input, notification, Row, Select, TimePicker } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import ApproveIcon from '@/assets/timeSheet/approve.svg';
import ArrowDown from '@/assets/timeSheet/arrowDown.svg';
import CancelIcon from '@/assets/timeSheet/cancel.svg';
import ClockIcon from '@/assets/timeSheet/clock.svg';
import { getCurrentCompany } from '@/utils/authority';
import {
  activityName,
  dateFormatAPI,
  hourFormat,
  hourFormatAPI,
  minuteStep,
  MT_SECONDARY_COL_SPAN,
} from '@/utils/timeSheet';
import styles from './index.less';

const { Option } = Select;

const { ACTIVITY, START_TIME, END_TIME, NIGHT_SHIFT, TOTAL_HOURS, NOTES, ACTIONS } =
  MT_SECONDARY_COL_SPAN;

const AddCard = (props) => {
  const [form] = Form.useForm();
  const [refreshing, setRefreshing] = useState(false);
  const [timeInState, setTimeInState] = useState('');
  const [timeOutState, setTimeOutState] = useState('');

  const {
    card: {
      taskName = '',
      startTime = '',
      endTime = '',
      nightShift = false,
      // totalHours = '',
      notes = '',
    } = {},
    cardIndex,
    cardDay = '',
    onRemoveCard = () => {},
    onEditValue = () => {},
  } = props;

  const { dispatch, user: { currentUser: { employee = {}, location = {} } = {} } = {} } = props;

  const { _id: employeeId = '' } = employee;

  useEffect(() => {
    if (refreshing) {
      form.setFieldsValue({
        taskName: taskName || null,
        startTime,
        endTime,
        nightShift,
        notes,
      });
      setRefreshing(false);
    }
  }, [refreshing]);

  // main function
  const addActivityEffect = (values) => {
    if (!employee?.managerInfo) {
      notification.error({ message: 'User does not have manager' });
      return {};
    }

    return dispatch({
      type: 'timeSheet/addActivityEffect',
      payload: {
        taskName: values.taskName,
        startTime: moment(values.startTime).format(hourFormatAPI),
        endTime: moment(values.endTime).format(hourFormatAPI),
        date: moment(cardDay).locale('en').format(dateFormatAPI),
        notes: values.notes,
        employeeId,
        companyId: getCurrentCompany(),
        nightShift: values.nightShift,
        location,
        type: 'TASK',
        employee: {
          _id: employee._id,
          department: employee.departmentInfo,
          generalInfo: employee.generalInfo,
          manager: {
            _id: employee.managerInfo._id,
            generalInfo: employee.managerInfo.generalInfo,
          },
        },
      },
      date: moment(cardDay).format(dateFormatAPI),
    });
  };
  const onFinish = async (values) => {
    const res = await addActivityEffect(values);
    if (res.code === 200) {
      onRemoveCard(cardIndex);
    }
  };

  const onValuesChange = (changedValues, allValues) => {
    onEditValue(allValues, cardIndex);
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
    const hour = moment(timeOutState).hour();

    const hours = [];
    for (let i = 0; i < 24; i += 1) {
      if (i > hour) hours.push(i);
    }
    return hours;
  };

  const getDisabledHoursTimeOut = () => {
    if (!timeInState) return [];
    const hour = moment(timeInState).hour();

    const hours = [];
    for (let i = 0; i < 24; i += 1) {
      if (i < hour) hours.push(i);
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
      if (i === minute && selectingHour === hour) minutes.push(i);
    }
    return minutes;
  };

  const getDisabledMinutesTimeOut = (selectingHour) => {
    if (!timeInState) return [];
    const minute = moment(timeInState).minute();
    const hour = moment(timeInState).hours();

    const minutes = [];
    for (let i = 0; i < 60; i += 1) {
      if (i === minute && selectingHour === hour) minutes.push(i);
    }
    return minutes;
  };

  const onTimePickerSelect = (type, value) => {
    form.setFieldsValue({
      [type]: value,
    });
  };

  // MAIN AREA
  return (
    <Form
      form={form}
      name="editForm"
      autoComplete="off"
      className={styles.AddCard}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      initialValues={{
        nightShift: false,
      }}
    >
      <Row gutter={[12, 0]}>
        <Col span={ACTIVITY} className={`${styles.normalCell} ${styles.boldText}`}>
          <Form.Item name="taskName" rules={[{ required: true }]}>
            <Select
              placeholder="Activity"
              value={taskName || null}
              suffixIcon={<img src={ArrowDown} alt="" />}
            >
              {activityName.map((a) => (
                <Option value={a}>{a}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={START_TIME} className={styles.normalCell}>
          <Form.Item name="startTime" rules={[{ required: true }]}>
            <TimePicker
              value={startTime}
              format={hourFormat}
              minuteStep={minuteStep}
              suffixIcon={<img src={ClockIcon} alt="" />}
              placeholder="Time In"
              disabledHours={getDisabledHoursTimeIn}
              disabledMinutes={getDisabledMinutesTimeIn}
              onChange={onChangeTimeIn}
              allowClear={false}
              showNow={false}
              use12Hours={false}
              onSelect={(time) => onTimePickerSelect('startTime', time)}
            />
          </Form.Item>
        </Col>
        <Col span={END_TIME} className={styles.normalCell}>
          <Form.Item name="endTime" rules={[{ required: true }]}>
            <TimePicker
              value={endTime}
              minuteStep={minuteStep}
              format={hourFormat}
              suffixIcon={<img src={ClockIcon} alt="" />}
              placeholder="Time Out"
              disabledHours={getDisabledHoursTimeOut}
              disabledMinutes={getDisabledMinutesTimeOut}
              onChange={onChangeTimeOut}
              allowClear={false}
              showNow={false}
              use12Hours={false}
              onSelect={(time) => onTimePickerSelect('endTime', time)}
            />
          </Form.Item>
        </Col>
        <Col span={NIGHT_SHIFT} className={styles.normalCell}>
          <Form.Item name="nightShift" rules={[{ required: true }]}>
            <Select
              placeholder="Night shift"
              value={nightShift}
              suffixIcon={<img src={ArrowDown} alt="" />}
            >
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
            <Input.TextArea
              value={notes}
              placeholder="Enter notes..."
              autoSize={{ minRows: 3, maxRows: 7 }}
            />
          </Form.Item>
        </Col>
        <Col span={ACTIONS} className={`${styles.normalCell} ${styles.alignCenter}`}>
          <div className={styles.actionsButton}>
            <button type="submit" htmlType="submit">
              <img type htmlType="submit" src={ApproveIcon} alt="" />{' '}
            </button>
            {/* <img type htmlType="submit" src={ApproveIcon} alt="" /> */}
            <img
              src={CancelIcon}
              alt=""
              onClick={() => {
                onRemoveCard(cardIndex);
                setRefreshing(true);
              }}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default connect(({ user }) => ({ user }))(AddCard);
