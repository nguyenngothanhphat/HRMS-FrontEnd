import { Col, Form, Input, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const EditBillableHeadCountContent = (props) => {
  const {
    initialValue = '',
    newValues = {},
    onClose = () => {},
    onSubmit = () => {},
    addProjectHistory = () => {},
    fetchProjectHistory = () => {},
    projectId = '',
    employee: { _id: employeeId = '' } = {},
  } = props;
  const formRef = React.createRef();

  const handleFinish = async (values) => {
    onSubmit(
      {
        value: values.newBillableHeadCount,
        reason: values.reason,
      },
      'billable',
    );
    const res = await addProjectHistory({
      updatedBy: employeeId,
      comments: values.reason,
      description: 'Billable Head Count changed',
      projectId,
    });
    if (res.statusCode === 200) {
      fetchProjectHistory();
    }
    onClose();
  };

  return (
    <div className={styles.EditBillableHeadCountContent}>
      <Form
        name="basic"
        ref={formRef}
        id="myForm"
        onFinish={handleFinish}
        initialValues={{
          initialBillableHeadCount: initialValue || null,
          newBillableHeadCount: newValues.value || null,
          reason: newValues.reason || null,
        }}
      >
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col span={24}>
            <Form.Item
              label="Initial Billable Head Count"
              name="initialBillableHeadCount"
              labelCol={{ span: 24 }}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="New Billable Head Count"
              name="newBillableHeadCount"
              labelCol={{ span: 24 }}
              rules={[
                { required: true, message: 'Required field!' },
                {
                  pattern: /^[0-9]*([.][0-9]{1})?$/,
                  message: 'Value must be a number or float number',
                },
              ]}
            >
              <Input placeholder="Enter New Billable Head Count" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Reason for change"
              name="reason"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <Input.TextArea placeholder="Enter Comments" autoSize={{ minRows: 4 }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
}))(EditBillableHeadCountContent);
