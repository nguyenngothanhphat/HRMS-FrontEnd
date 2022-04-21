import { Card, Col, Form, Row, Select } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { FORM_ITEM_NAME } from '@/utils/timeOff';
import styles from './index.less';

const { Option } = Select;

const EmploymentType = (props) => {
  const { timeOff: { employeeTypeList = [] } = {} } = props;
  return (
    <Card title="Employment Type" className={styles.EmploymentType}>
      <Row gutter={[24, 24]} align="top">
        <Col sm={10}>
          <span className={styles.label}>
            Select all the employee types eligible for this leave type
          </span>
        </Col>
        <Col sm={10}>
          <Form.Item
            name={FORM_ITEM_NAME.EMPLOYEE_TYPE}
            rules={[{ required: true, message: 'Required field!' }]}
          >
            <Select showSearch showArrow mode="multiple" placeholder="Select the Employment Type">
              {employeeTypeList.map((x) => (
                <Option value={x._id}>{x.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col sm={4} />
      </Row>
    </Card>
  );
};
export default connect(({ timeOff }) => ({ timeOff }))(EmploymentType);
