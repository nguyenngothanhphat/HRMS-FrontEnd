import { Col, Form, Input, Row, Select, TimePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import ApproveIcon from '@/assets/timeSheet/approve.svg';
import ArrowDown from '@/assets/timeSheet/arrowDown.svg';
import CancelIcon from '@/assets/timeSheet/cancel.svg';
import ClockIcon from '@/assets/timeSheet/clock.svg';
import styles from './index.less';
import { addTimeForDate, hourFormat, minuteStep,activityName } from '@/utils/timeSheet';

const { Option } = Select;
const EditCard = (props) => {
  const [form] = Form.useForm();

  const {
    card: {
      _id = '',
      taskName = '',
      startDate = '',
      endDate = '',
      nightshift = false,
      // totalHours = '',
      notes = '',
    } = {},
    cardIndex,
    cardDay = '',
    onCancelCard = () => {},
    dispatch,
  } = props;

  // main function
  const updateActivityEffect = (values) => {
    // startDate & endDate we selected from TimePicker have dates are today
    // example now is 09/29/2021 - 16:08:20, after we pick a time, the value is 09/29/2021 - 16:08:20 (moment js)
    // so we MUST change the date into the one this AddCard belongs to
    // example this activity is in 08/15/2021
    // result will be 08/15/2021 - 16:08:20 (moment js)

    const payload = {
      ...values,
      _id,
      day: moment(cardDay),
      startDate: values.startDate ? addTimeForDate(cardDay, values.startDate) : '',
      endDate: values.endDate ? addTimeForDate(cardDay, values.endDate) : '',
    };

    return dispatch({
      type: 'timeSheet/updateActivityEffect',
      payload,
    });
  };
  const onFinish = async (values) => {
    const res = await updateActivityEffect(values);
    if (res.code === 200) {
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
        taskName,
        startDate: startDate ? moment(startDate) : '',
        endDate: endDate ? moment(endDate) : '',
        nightshift,
        notes,
      }}
    >
      <Row gutter={[12, 0]}>
        <Col span={3} className={`${styles.normalCell} ${styles.boldText}`}>
          <Form.Item name="taskName" rules={[{ required: true }]}>
            <Select suffixIcon={<img src={ArrowDown} alt="" />}>
              {activityName.map(a => <Option value={a}>{a}</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={3} className={styles.normalCell}>
          <Form.Item name="startDate" rules={[{ required: true }]}>
            <TimePicker
              format={hourFormat}
              minuteStep={minuteStep}
              suffixIcon={<img src={ClockIcon} alt="" />}
            />
          </Form.Item>
        </Col>
        <Col span={3} className={styles.normalCell}>
          <Form.Item name="endDate" rules={[{ required: true }]}>
            <TimePicker
              format={hourFormat}
              minuteStep={minuteStep}
              suffixIcon={<img src={ClockIcon} alt="" />}
            />
          </Form.Item>
        </Col>
        <Col span={3} className={styles.normalCell}>
          <Form.Item name="nightshift" rules={[{ required: true }]}>
            <Select suffixIcon={<img src={ArrowDown} alt="" />}>
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

export default connect(({ timeSheet: { myTimesheet = [] } = {} }) => ({ myTimesheet }))(EditCard);
