import { Col, Form, Input, Row, Select, TimePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import ApproveIcon from '@/assets/timeSheet/approve.svg';
import ArrowDown from '@/assets/timeSheet/arrowDown.svg';
import CancelIcon from '@/assets/timeSheet/cancel.svg';
import ClockIcon from '@/assets/timeSheet/clock.svg';
import styles from './index.less';

const hourFormat = 'HH:mm';

const { Option } = Select;
const EditCard = (props) => {
  const [form] = Form.useForm();

  const {
    card: {
      _id = '',
      activity = '',
      timeIn = '',
      timeOut = '',
      nightshift = false,
      // totalHours = '',
      notes = '',
    } = {},
    cardIndex,
    onCancelCard = () => {},
    dispatch,
  } = props;

  // main function
  const updateActivityEffect = (values) => {
    const payload = {
      ...values,
      _id,
      // activity: values.activity || activity,
      // timeIn: values.timeIn || timeIn,
      // timeOut: values.timeOut || timeOut,
      // nightshift: values.nightshift || nightshift,
      // totalHours,
      // notes: values.notes || notes,
    };
    return dispatch({
      type: 'timeSheet/updateActivityEffect',
      payload,
    });
  };
  const onFinish = async (values) => {
    const res = await updateActivityEffect(values);
    if (res.statusCode === 200) {
      onCancelCard();
    }
  };

  // MAIN AREA
  return (
    <Form
      form={form}
      name="editForm"
      autoComplete="off"
      className={styles.EditCard}
      onFinish={onFinish}
      initialValues={{
        activity,
        timeIn: timeIn ? moment(timeIn) : '',
        timeOut: timeOut ? moment(timeOut) : '',
        nightshift,
        notes,
      }}
    >
      <Row gutter={[12, 0]}>
        <Col span={3} className={`${styles.normalCell} ${styles.boldText}`}>
          <Form.Item name="activity" rules={[{ required: true }]}>
            <Select
              // value={activity}
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
              // value={timeIn ? moment(timeIn) : ''}
              format={hourFormat}
              suffixIcon={<img src={ClockIcon} alt="" />}
            />
          </Form.Item>
        </Col>
        <Col span={3} className={styles.normalCell}>
          <Form.Item name="timeOut" rules={[{ required: true }]}>
            <TimePicker
              // value={timeOut ? moment(timeOut) : ''}
              format={hourFormat}
              suffixIcon={<img src={ClockIcon} alt="" />}
            />
          </Form.Item>
        </Col>
        <Col span={3} className={styles.normalCell}>
          <Form.Item name="nightshift" rules={[{ required: true }]}>
            <Select
              // value={nightshift}
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
            <Input.TextArea autoSize={{ minRows: 4, maxRows: 10 }} />
          </Form.Item>
        </Col>
        <Col span={3} className={`${styles.normalCell} ${styles.alignCenter}`}>
          <div className={styles.actionsButton}>
            <button type="submit" htmlType="submit">
              <img type htmlType="submit" src={ApproveIcon} alt="" />{' '}
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

export default connect(({ timeSheet: { myTimesheet = [] } = {} }) => ({ myTimesheet }))(EditCard);
