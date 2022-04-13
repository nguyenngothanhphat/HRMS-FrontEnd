import { Card, Col, Form, Row, Select } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;

const EmploymentType = () => {
  return (
    <Card title="Employment Type" className={styles.EmploymentType}>
      <Row gutter={[24, 24]}>
        <Col sm={8}>
          <span className={styles.label}>
            Select all the employee types eligible for this leave type
          </span>
        </Col>
        <Col sm={12}>
          <Form.Item>
            <Select showSearch showArrow mode="multiple" placeholder="Select the Employment Type">
              <Option value="Full Time Employee">Full Time Employee</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col sm={4} />
      </Row>
    </Card>
  );
};
export default connect(() => ({}))(EmploymentType);
