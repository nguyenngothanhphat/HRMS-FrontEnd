import { Card, Col, Row } from 'antd';
import React from 'react';
import { Link } from 'umi';
import { getEmployeeName } from '@/utils/offboarding';
import styles from './index.less';

const RequesteeDetails = ({ item = {} }) => {
  const {
    employee: {
      generalInfoInfo: { employeeId = '', userId = '' } = {},
      generalInfoInfo = {},
      titleInfo: { name: title = '' } = {},
    } = {},
  } = item;

  const items = [
    {
      label: 'Employee ID',
      value: employeeId,
    },
    {
      label: 'Employee Name',
      value: (
        <Link to={`/directory/employee-profile/${userId}`} className={styles.employeeLink}>
          {getEmployeeName(generalInfoInfo)}
        </Link>
      ),
    },
    {
      label: 'Position',
      value: title,
    },
  ];

  return (
    <Card title="Requestee details" className={styles.RequesteeDetails}>
      <Row gutter={[24, 16]} className={styles.content}>
        {items.map((x) => (
          <>
            <Col span={6}>{x.label}</Col>
            <Col span={18} className={styles.detailColumn}>
              <span className={styles.fieldValue}>{x.value}</span>
            </Col>
          </>
        ))}
      </Row>
    </Card>
  );
};

export default RequesteeDetails;
