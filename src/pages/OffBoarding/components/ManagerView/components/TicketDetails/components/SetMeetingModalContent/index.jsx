import { Col, DatePicker, Form, Row } from 'antd';
import React from 'react';
import CustomEmployeeTag from '@/components/CustomEmployeeTag';
import CustomTimeRangeSelector from '@/components/CustomTimeRangeSelector';
import { dateFormat, getEmployeeName } from '@/utils/offboarding';
import styles from './index.less';

const SetMeetingModalContent = ({ employee = {} }) => {
  const [form] = Form.useForm();
  const { generalInfo = {}, title = {} } = employee || {};

  return (
    <div className={styles.SetMeetingModalContent}>
      <div className={styles.employeeName}>
        <p>Employee Name</p>
        <CustomEmployeeTag
          name={getEmployeeName(generalInfo)}
          title={title?.name}
          avatar={generalInfo?.avatar}
          userId={generalInfo?.userId}
        />
      </div>
      <Form layout="vertical" name="basic" form={form} id="myForm" preserve={false}>
        <Row align="middle" gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
              <DatePicker format={dateFormat} placeholder="Select the date" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="time" label="Time" rules={[{ required: true }]}>
              <CustomTimeRangeSelector minuteStep={60} placeholder="Select the time" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SetMeetingModalContent;
