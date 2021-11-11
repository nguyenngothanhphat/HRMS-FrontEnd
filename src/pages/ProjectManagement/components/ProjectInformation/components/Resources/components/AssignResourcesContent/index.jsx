import { Col, Form, Input, Row, DatePicker, Tag } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const colors = ['#006BEC', '#FF6CA1', '#6236FF', '#FE5D27'];

const AssignResourcesContent = () => {
  const formRef = React.createRef();

  const tags = ['Design', 'Application Dev', 'Backend Dev', 'Frontend Dev'];
  const getColor = (index) => {
    return colors[index % colors.length];
  };

  const handleFinish = (values) => {
    console.log('values', values);
  };

  return (
    <div className={styles.AssignResourcesContent}>
      <Form name="basic" ref={formRef} id="myForm" onFinish={handleFinish} initialValues={{}}>
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col xs={24} md={12}>
            <Row gutter={[24, 10]}>
              <Col xs={24}>
                <div className={styles.item}>
                  <span className={styles.label}>Project Name:</span>
                  <span className={styles.value}>ABC Website</span>
                </div>
              </Col>
              <Col xs={24}>
                <div className={styles.item}>
                  <span className={styles.label}>Engagement Type:</span>
                  <span className={styles.value}>T&M</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={12}>
            <div className={styles.item}>
              <span className={styles.label}>Tags:</span>
              <div className={styles.tags}>
                {tags.map((t, i) => (
                  <Tag color={getColor(i)}>{t}</Tag>
                ))}
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={[24, 0]} className={styles.belowPart}>
          <Col xs={24}>
            <Form.Item label="Milestone Name" name="milestoneName" labelCol={{ span: 24 }}>
              <Input placeholder="Enter Milestone Name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Start Date" name="startDate" labelCol={{ span: 24 }}>
              <DatePicker />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="End Date*" name="endDate" labelCol={{ span: 24 }}>
              <DatePicker />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Description" name="description" labelCol={{ span: 24 }}>
              <Input.TextArea autoSize={{ minRows: 4 }} />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item>
              <span className={styles.someNotes}>*Tentative End Date</span>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
}))(AssignResourcesContent);
