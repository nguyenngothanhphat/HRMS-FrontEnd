import { Col, Form, Input, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const EditBillableHeadCountContent = () => {
  const formRef = React.createRef();

  const handleFinish = (values) => {
    console.log('values', values);
  };

  return (
    <div className={styles.EditBillableHeadCountContent}>
      <Form name="basic" ref={formRef} id="myForm" onFinish={handleFinish} initialValues={{}}>
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col span={24}>
            <Form.Item
              label="Initial Billable Head Count"
              name="initialBillableHeadCount"
              labelCol={{ span: 24 }}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="New Billable Head Count"
              name="newBillableHeadCount"
              labelCol={{ span: 24 }}
            >
              <Input placeholder="Enter New Billable Head Count" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Reason for change" name="reason" labelCol={{ span: 24 }}>
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
