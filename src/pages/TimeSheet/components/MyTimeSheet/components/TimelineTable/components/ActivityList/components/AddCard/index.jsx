import { Col, Row, Form, Input, Select, TimePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import ApproveIcon from '@/assets/timeSheet/approve.svg';
import CancelIcon from '@/assets/timeSheet/cancel.svg';
import ClockIcon from '@/assets/timeSheet/clock.svg';
import ArrowDown from '@/assets/timeSheet/arrowDown.svg';
import {
  hourFormat,
  minuteStep,
  activityName,
  hourFormatAPI,
  dateFormatAPI,
  MT_SECONDARY_COL_SPAN,
} from '@/utils/timeSheet';
import { getCurrentCompany, getCurrentLocation } from '@/utils/authority';

import styles from './index.less';

const { Option } = Select;

const { ACTIVITY, START_TIME, END_TIME, NIGHT_SHIFT, TOTAL_HOURS, NOTES, ACTIONS } =
  MT_SECONDARY_COL_SPAN;

const AddCard = (props) => {
  const [form] = Form.useForm();
  const [refreshing, setRefreshing] = useState(false);
  const [timeInState, setTimeInState] = useState('');
  const [timeOutState, setTimeOutState] = useState('');
  const [timePicker, setTimePicker] = useState({
    timeIn: {
      arrHours: [],
      arrMinutes: [],
    },
    timeOut: {
      arrHours: [],
      arrMinutes: [],
    },
  });
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

  const {
    dispatch,
    employee: {
      _id: employeeId = '',
      generalInfo: {
        legalName: empName = '',
        workEmail: empWorkEmail = '',
        userId: empUserId = '',
      } = {} || {},
      department: { name: empDepartmentName = '', _id: empDepartmentId = '' } = {} || {},
      manager: {
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

  useEffect(() => {
    if (refreshing) {
      form.setFieldsValue({
        taskName,
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
    return dispatch({
      type: 'timeSheet/addActivityEffect',
      payload: {
        taskName: values.taskName,
        startTime: moment(values.startTime).format(hourFormatAPI),
        endTime: moment(values.endTime).format(hourFormatAPI),
        date: moment(cardDay).locale('en').format(dateFormatAPI),
        projectName: 'HRMS',
        notes: values.notes,
        employeeId,
        companyId: getCurrentCompany(),
        location: getCurrentLocation(),
        nightShift: values.nightShift,
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
        //   employeeName: managerName,
        //   employeeId: managerId,
        //   employeeCode: managerUserId,
        //   workEmail: managerWorkEmail,
        //   department: {
        //     name: managerDepartmentName,
        //     id: managerDepartmentId,
        //   },
        // },
        managerInfo: {
          employeeName: 'Lewis Manager',
          employeeId: '615a5d6bdb04f89a75e7f2e0',
          employeeCode: 'lewis-manager',
          workEmail: 'lewis-manager@mailinator.com',
          department: {
            name: 'Engineering',
            id: '6153e2ecb51335302899a375',
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

  const onChangeTimeIn = (value) => {
    setTimeInState(value);
  };

  const onChangeTimeOut = (value) => {
    setTimeOutState(value);
  };

  const selectTimeIn = (value) => {
    let hours = [...timePicker.timeIn.arrHours];
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const midDay = moment('12:00pm', hourFormat); // 12:00PM
    const isBeforeTime = value.isBefore(midDay);

    const hour = +value.format('hh');
    const minute = +value.format('mm');

    if (minute === 0) {
      // If hour = 4 and minute = 0 => 4:00
      // => BECAUSE in the Time OUT picker, we can select 4:30 so arr hours CAN NOT include the selected hour. Ex: [1,2,3]
      hours = arr.filter((item) => item < hour);
    } else {
      // 4:30
      hours = arr.filter((item) => item <= hour); // arr hours CAN include the selected hour. Ex: [1,2,3,4]
    }

    console.log('time in ISBEFORE: ', isBeforeTime);
    if (isBeforeTime) hours = [];

    // after select Time IN Picker => will disabled some hours (based on timeOut.arrHours) in Time OUT Picker
    setTimePicker((prevState) => ({
      ...prevState,
      timeOut: {
        ...prevState.timeOut,
        arrHours: hours,
        arrMinutes: [minute],
      },
    }));
  };

  const selectTimeOut = (value) => {
    let hours = [...timePicker.timeOut.arrHours]; // If Time IN was selected 4:00 so hours = [1,2,3]
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const midDay = moment('12:00pm', hourFormat); // 12:00PM
    const isAfterTime = value.isAfter(midDay);

    const hour = +value.format('hh');
    const minute = +value.format('mm');

    const newArr = arr.filter((item) => {
      return hours.indexOf(item) < 0;
    }); // => [4,5,6,7,8,9,10,11,12]

    if (minute === 0) {
      // If 6:00
      // BECAUSE in the Time IN picker, we CANNOT select any hours after 6:00
      hours = newArr.filter((item) => item >= hour); // arr hours CAN include the selected hour. Ex: [6,7,8,9,10,11,12]
    } else {
      hours = newArr.filter((item) => item > hour); // arr hours CAN NOT include the selected hour. Ex: [7,8,9,10,11,12]
    }

    hours.push(0); // in order to disable number 12
    console.log('time out ISAFTER: ', isAfterTime);
    if (isAfterTime) hours = [];

    // after select Time OUT Picker => will disabled some hours (based on timeIn.arrHours) in Time IN Picker
    setTimePicker((prevState) => ({
      ...prevState,
      timeIn: {
        ...prevState.timeIn,
        arrHours: hours,
        arrMinutes: [minute],
      },
    }));
  };

  const disableMinuteOut = (selectedHour) => {
    const minuteArr = [...timePicker.timeOut.arrMinutes];
    const newTimeInState = +timeInState.format('hh');
    const arr = [0, 30];
    let minutes = [];

    if (selectedHour > -1) {
      if (selectedHour === newTimeInState) {
        if (minuteArr[0] !== 30) {
          minutes = arr.filter((item) => item === minuteArr[0]);
        } else {
          minutes = arr.filter((item) => item !== minuteArr[0]);
        }
      } else {
        minutes = [];
      }
    }

    return minutes;
  };
  const disableMinuteIn = (selectedHour) => {
    const minuteArr = [...timePicker.timeIn.arrMinutes];
    const newTimeOutState = +timeOutState.format('hh');
    const arr = [0, 30];
    let minutes = [];

    if (selectedHour > -1) {
      if (selectedHour === newTimeOutState) {
        if (minuteArr[0] !== 30) {
          minutes = arr.filter((item) => item !== minuteArr[0]);
        } else {
          minutes = arr.filter((item) => item === minuteArr[0]);
        }
      } else {
        minutes = [];
      }
    }

    return minutes;
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
              placeholder="Time in"
              onChange={onChangeTimeIn}
              onSelect={selectTimeIn}
              disabledHours={() => timePicker.timeIn.arrHours}
              disabledMinutes={timeOutState ? disableMinuteIn : null}
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
              placeholder="Time out"
              onChange={onChangeTimeOut}
              onSelect={selectTimeOut}
              disabledHours={() => timePicker.timeOut.arrHours}
              disabledMinutes={timeInState ? disableMinuteOut : null}
              use12Hours
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

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({ employee }))(
  AddCard,
);
