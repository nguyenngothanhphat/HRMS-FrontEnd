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
      generalInfo: { legalName: empName = '', workEmail: empWorkEmail } = {} || {},
      department: { name: empDepartmentName, _id: empDepartmentId } = {} || {},
      manager: {
        _id: managerId = '',
        generalInfo: { legalName: managerName = '', workEmail: managerWorkEmail } = {} || {},
        department: { name: managerDepartmentName, _id: managerDepartmentId } = {} || {},
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
          employeeId,
          workEmail: empWorkEmail,
          department: {
            name: empDepartmentName,
            id: empDepartmentId,
          },
        },
        managerInfo: {
          employeeName: managerName,
          employeeId: managerId,
          workEmail: managerWorkEmail,
          department: {
            name: managerDepartmentName,
            id: managerDepartmentId,
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
