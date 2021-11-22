import { Col, Form, Input, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const EditBufferHeadCountContent = (props) => {
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
        value: values.newBufferHeadCount,
        reason: values.reason,
      },
      'buffer',
    );
    const res = await addProjectHistory({
      updatedBy: employeeId,
      comments: values.reason,
      description: 'Buffer Head Count changed',
      projectId,
    });
    if (res.statusCode === 200) {
      fetchProjectHistory();
    }
    onClose();
  };

  return (
    <div className={styles.EditBufferHeadCountContent}>
      <Form
        name="basic"
        ref={formRef}
        id="myForm"
        onFinish={handleFinish}
        initialValues={{
          initialBufferHeadCount: initialValue || null,
          newBufferHeadCount: newValues.value || null,
          reason: newValues.reason || null,
        }}
      >
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col span={24}>
            <Form.Item
              label="Initial Buffer Head Count"
              name="initialBufferHeadCount"
              labelCol={{ span: 24 }}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="New Buffer Head Count"
              name="newBufferHeadCount"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <Input placeholder="Enter New Buffer Head Count" />
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
}))(EditBufferHeadCountContent);
