import { Col, Row, Form, Input, Select, TimePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import ApproveIcon from '@/assets/timeSheet/approve.svg';
import CancelIcon from '@/assets/timeSheet/cancel.svg';
import ClockIcon from '@/assets/timeSheet/clock.svg';
import ArrowDown from '@/assets/timeSheet/arrowDown.svg';
import { addTimeForDate, hourFormat, minuteStep } from '@/utils/timeSheet';

import styles from './index.less';

const { Option } = Select;
const AddCard = (props) => {
  const [form] = Form.useForm();
  const [refreshing, setRefreshing] = useState(false);
  const {
    card: {
      activity = '',
      timeIn = '',
      timeOut = '',
      nightshift = false,
      // totalHours = '',
      notes = '',
    } = {},
    cardIndex,
    cardDay = '',
    onRemoveCard = () => {},
    onEditValue = () => {},
    dispatch,
  } = props;

  useEffect(() => {
    if (refreshing) {
      form.setFieldsValue({
        activity,
        timeIn,
        timeOut,
        nightshift,
        notes,
      });
      setRefreshing(false);
    }
  }, [refreshing]);

  // main function
  const addActivityEffect = (values) =>
    dispatch({
      type: 'timeSheet/addActivityEffect',
      payload: { ...values, day: moment(cardDay) },
    });

  const onFinish = async (values) => {
    const res = await addActivityEffect(values);
    if (res.statusCode === 200) {
      onRemoveCard(cardIndex);
    }
  };

  const onValuesChange = (changedValues, allValues) => {
    // timeIn & timeOut we selected from TimePicker have dates are today
    // example now is 09/29/2021 - 16:08:20, after we pick a time, the value is 09/29/2021 - 16:08:20 (moment js)
    // so we MUST change the date into the one this AddCard belongs to
    // example this activity is in 08/15/2021
    // result will be 08/15/2021 - 16:08:20 (moment js)
    onEditValue(
      {
        ...allValues,
        timeIn: allValues.timeIn ? addTimeForDate(cardDay, allValues.timeIn) : '',
        timeOut: allValues.timeOut ? addTimeForDate(cardDay, allValues.timeOut) : '',
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
          <Form.Item name="activity" rules={[{ required: true }]}>
            <Select
              placeholder="Activity"
              value={activity || null}
              suffixIcon={<img src={ArrowDown} alt="" />}
            >
              <Option value="A">A</Option>
              <Option value="B">B</Option>
              <Option value="C">C</Option>
              <Option value="D">D</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={3} className={styles.normalCell}>
          <Form.Item name="timeIn" rules={[{ required: true }]}>
            <TimePicker
              value={timeIn}
              format={hourFormat}
              minuteStep={minuteStep}
              suffixIcon={<img src={ClockIcon} alt="" />}
              placeholder="Time in"
            />
          </Form.Item>
        </Col>
        <Col span={3} className={styles.normalCell}>
          <Form.Item name="timeOut" rules={[{ required: true }]}>
            <TimePicker
              value={timeOut}
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

export default connect(({ timeSheet: { myTimesheet = [] } = {} }) => ({ myTimesheet }))(AddCard);
