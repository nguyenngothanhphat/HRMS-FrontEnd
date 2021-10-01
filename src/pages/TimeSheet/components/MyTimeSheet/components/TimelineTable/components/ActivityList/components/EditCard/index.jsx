import { Col, Form, Input, Row, Select, TimePicker } from 'antd';
import moment from 'moment';
import React from 'react';
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
    dispatch,
  } = props;

  // main function
  const updateActivityEffect = (values) => {
    const payload = {
      ...values,
      id,
      startTime: moment(values.startTime).format(hourFormatAPI),
      endTime: moment(values.endTime).format(hourFormatAPI),
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
            />
          </Form.Item>
        </Col>
        <Col span={END_TIME} className={styles.normalCell}>
          <Form.Item name="endTime" rules={[{ required: true }]}>
            <TimePicker
              format={hourFormat}
              minuteStep={minuteStep}
              suffixIcon={<img src={ClockIcon} alt="" />}
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

export default connect(({ timeSheet: { myTimesheet = [] } = {} }) => ({ myTimesheet }))(EditCard);
