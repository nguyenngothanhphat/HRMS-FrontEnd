import { Col, DatePicker, Form, Input, Row } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import styles from './index.less';
import { disabledEndDate } from '@/utils/projectManagement';

const EditEndDateContent = (props) => {
  const {
    initialValue = '',
    newValues = {},
    onClose = () => {},
    onSubmit = () => {},
    addProjectHistory = () => {},
    fetchProjectHistory = () => {},
    projectId = '',
    startDate = '',
    employee: { _id: employeeId = '' } = {},
  } = props;

  const handleFinish = async (values) => {
    onSubmit(
      {
        value: values.newEndDate,
        reason: values.reason,
      },
      'endDate',
    );
    const res = await addProjectHistory({
      updatedBy: employeeId,
      comments: values.reason,
      description: 'End date changed',
      projectId,
    });
    if (res.statusCode === 200) {
      fetchProjectHistory();
    }
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
                disabledDate={(currentDate) => disabledEndDate(currentDate, startDate)}
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
