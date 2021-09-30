import { Col, Row, Form, Input, Select, TimePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import ApproveIcon from '@/assets/timeSheet/approve.svg';
import CancelIcon from '@/assets/timeSheet/cancel.svg';
import ClockIcon from '@/assets/timeSheet/clock.svg';
import ArrowDown from '@/assets/timeSheet/arrowDown.svg';
import { addTimeForDate, hourFormat, minuteStep, activityName } from '@/utils/timeSheet';
import { getCurrentCompany, getCurrentLocation } from '@/utils/authority';

import styles from './index.less';

const { Option } = Select;
const AddCard = (props) => {
  const [form] = Form.useForm();
  const [refreshing, setRefreshing] = useState(false);
  const {
    card: {
      taskName = '',
      startTime = '',
      endTime = '',
      nightshift = false,
      // totalHours = '',
      notes = '',
    } = {},
    cardIndex,
    cardDay = '',
    onRemoveCard = () => {},
    onEditValue = () => {},
  } = props;

  const { dispatch, employee: { _id: employeeId = '' } = {} } = props;

  useEffect(() => {
    if (refreshing) {
      form.setFieldsValue({
        taskName,
        startTime,
        endTime,
        nightshift,
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
        startTime: moment(values.startTime).format('hh:mm'),
        endTime: moment(values.endTime).format('hh:mm'),
        date: moment(cardDay).locale('en').format('YYYY-MM-DD'),
        projectName: 'HRMS',
        notes: values.notes,
        employeeId,
        companyId: getCurrentCompany(),
        location: getCurrentLocation(),
      },
    });
  };
  const onFinish = async (values) => {
    const res = await addActivityEffect(values);
    if (res.code === 200) {
      onRemoveCard(cardIndex);
    }
  };

  const onValuesChange = (changedValues, allValues) => {
    // startTime & endTime we selected from TimePicker have dates are today
    // example now is 09/29/2021 - 16:08:20, after we pick a time, the value is 09/29/2021 - 16:08:20 (moment js)
    // so we MUST change the date into the one this AddCard belongs to
    // example this activity is in 08/15/2021
    // result will be 08/15/2021 - 16:08:20 (moment js)
    onEditValue(
      {
        ...allValues,
        startTime: allValues.startTime ? addTimeForDate(cardDay, allValues.startTime) : '',
        endTime: allValues.endTime ? addTimeForDate(cardDay, allValues.endTime) : '',
      },
      cardIndex,
    );
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
        nightshift: false,
      }}
    >
      <Row gutter={[12, 0]}>
        <Col span={3} className={`${styles.normalCell} ${styles.boldText}`}>
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
        <Col span={3} className={styles.normalCell}>
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
        <Col span={3} className={styles.normalCell}>
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
        <Col span={3} className={styles.normalCell}>
          <Form.Item name="nightshift" rules={[{ required: true }]}>
            <Select
              placeholder="Night shift"
              value={nightshift}
              suffixIcon={<img src={ArrowDown} alt="" />}
            >
              <Option value>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={3} className={`${styles.normalCell} ${styles.blueText}`}>
          <Form.Item name="totalHours" />
        </Col>
        <Col span={6} className={styles.normalCell}>
          <Form.Item name="notes" rules={[{ required: true }]}>
            <Input.TextArea
              value={notes}
              placeholder="Enter notes..."
              autoSize={{ minRows: 3, maxRows: 7 }}
            />
          </Form.Item>
        </Col>
        <Col span={3} className={`${styles.normalCell} ${styles.alignCenter}`}>
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
