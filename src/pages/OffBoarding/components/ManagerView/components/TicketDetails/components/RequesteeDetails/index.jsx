import { Card, Col, Row } from 'antd';
import React from 'react';
import { Link } from 'umi';
import { getEmployeeName } from '@/utils/offboarding';
import styles from './index.less';

const RequesteeDetails = (props) => {
  const {
    employee: {
      _id = '',
      generalInfo: { employeeId = '' } = {},
      generalInfo = {},
      title: { name: title = '' } = {},
    } = {},
  } = props;

  return (
    <Card title="Requestee details" className={styles.RequesteeDetails}>
      <Row gutter={[24, 16]} className={styles.content}>
        <Col span={6}>Employee ID</Col>
        <Col span={18} className={styles.detailColumn}>
          <span className={styles.fieldValue}>{employeeId}</span>
        </Col>
        <Col span={6}>Employee Name</Col>
        <Col span={18} className={styles.detailColumn}>
          <Link to={`/directory/employee-profile/${_id}`} className={styles.employeeLink}>
            {getEmployeeName(generalInfo)}
          </Link>
        </Col>
        <Col span={6}>Position</Col>
        <Col span={18} className={styles.detailColumn}>
          <span>{title}</span>
        </Col>
      </Row>
    </Card>
  );
};

export default RequesteeDetails;
