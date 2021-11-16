import { Col, DatePicker, Form, Input, Row } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import styles from './index.less';

const EditEndDateContent = (props) => {
  const { initialValue = '', newValues = {}, onClose = () => {}, onSubmit = () => {} } = props;

  const handleFinish = (values) => {
    onSubmit(
      {
        value: values.newEndDate,
        reason: values.reason,
      },
      'endDate',
    );
    onClose();
  };

  return (
    <div className={styles.EditEndDateContent}>
      <Form
        name="basic"
        id="myForm"
        onFinish={handleFinish}
        initialValues={{
          initialEndDate: initialValue ? moment(initialValue) : null,
          newEndDate: newValues.value || null,
          reason: newValues.reason || null,
        }}
      >
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col span={24}>
            <Form.Item label="Initial End Date" name="initialEndDate" labelCol={{ span: 24 }}>
              <DatePicker
                disabled
                suffixIcon={<img src={CalendarIcon} alt="" className={styles.calendarIcon} />}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="New End Date"
              name="newEndDate"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <DatePicker
                placeholder="Enter End Date"
                suffixIcon={<img src={CalendarIcon} alt="" className={styles.calendarIcon} />}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Reason for change"
              name="reason"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <Input.TextArea placeholder="Enter comments" autoSize={{ minRows: 4 }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
}))(EditEndDateContent);
