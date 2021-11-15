import { Col, DatePicker, Form, Input, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import styles from './index.less';

const EditEndDateContent = () => {
  const formRef = React.createRef();

  const handleFinish = (values) => {
    console.log('values', values);
  };

  return (
    <div className={styles.EditEndDateContent}>
      <Form name="basic" ref={formRef} id="myForm" onFinish={handleFinish} initialValues={{}}>
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col span={24}>
            <Form.Item label="Initial End Date" name="initialEndDate" labelCol={{ span: 24 }}>
              <DatePicker
                suffixIcon={<img src={CalendarIcon} alt="" className={styles.calendarIcon} />}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="New End Date" name="newEndDate" labelCol={{ span: 24 }}>
              <DatePicker
                placeholder="Enter End Date"
                suffixIcon={<img src={CalendarIcon} alt="" className={styles.calendarIcon} />}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Reason for change" name="reason" labelCol={{ span: 24 }}>
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
