import { Col, Select, Form, Input, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import CustomTag from '../../../CustomTag';
import styles from './index.less';

const { Option } = Select;
const colors = ['#006BEC', '#FF6CA1', '#6236FF', '#FE5D27'];

const AddResourceTypeContent = () => {
  const formRef = React.createRef();

  const tags = ['Design', 'Application Dev', 'Backend Dev', 'Frontend Dev'];
  const getColor = (index) => {
    return colors[index % colors.length];
  };

  const handleFinish = (values) => {
    console.log('values', values);
  };

  return (
    <div className={styles.AddResourceTypeContent}>
      <Form name="basic" ref={formRef} id="myForm" onFinish={handleFinish} initialValues={{}}>
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col xs={24} md={7}>
            <div className={styles.item}>
              <span className={styles.label}>Project Name:</span>
              <span className={styles.value}>ABC Website</span>
            </div>
          </Col>
          <Col xs={24} md={7}>
            <div className={styles.item}>
              <span className={styles.label}>Engagement Type:</span>
              <span className={styles.value}>T&M</span>
            </div>
          </Col>

          <Col xs={24} md={10}>
            <div className={styles.item}>
              <span className={styles.label}>Tags:</span>
              <div className={styles.tags}>
                {tags.map((t, i) => (
                  <CustomTag color={getColor(i)}>{t}</CustomTag>
                ))}
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={[24, 0]} className={styles.belowPart}>
          <Col xs={24} md={12}>
            <Form.Item label="Division" name="division" labelCol={{ span: 24 }}>
              <Input placeholder="Enter Division" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Resource Type" name="Resource Type" labelCol={{ span: 24 }}>
              <Select placeholder="Select Resource Type">
                {[].map((x) => (
                  <Option value={x}>{x}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="No. of Resources" name="noOfResources" labelCol={{ span: 24 }}>
              <Input placeholder="Enter No. of Resources" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Billing Status" name="billingStatus" labelCol={{ span: 24 }}>
              <Select placeholder="Select Billing Status">
                {[].map((x) => (
                  <Option value={x}>{x}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Estimated effort" name="estimatedEffort" labelCol={{ span: 24 }}>
              <Input addonAfter={<span>month/resource</span>} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Technologies Used" name="technologies" labelCol={{ span: 24 }}>
              <Select mode="multiple" placeholder="Select Technologies Used">
                {['React', 'Java'].map((x) => (
                  <Option value={x}>{x}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Comments/Notes" name="description" labelCol={{ span: 24 }}>
              <Input.TextArea placeholder="Add comments/notes" autoSize={{ minRows: 4 }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
}))(AddResourceTypeContent);
