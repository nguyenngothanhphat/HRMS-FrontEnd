import { Card, Col, Row } from 'antd';
import moment from 'moment';
import React from 'react';
import { Link } from 'umi';
import { dateFormat, getEmployeeName } from '@/utils/offboarding';
import styles from './index.less';

const RequesteeDetails = ({ item = {} }) => {
  const {
    employee: {
      generalInfoInfo: { employeeId = '', userId = '' } = {},
      generalInfoInfo = {},
      titleInfo: { name: title = '' } = {},
      departmentInfo: { name: department = '' } = {},
      joinDate = '',
      managerInfo: { generalInfo: managerGeneralInfo = {} } = {},
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
    {
      label: 'Department',
      value: department,
    },
    {
      label: 'Date of Joining',
      value: joinDate ? moment(joinDate).format(dateFormat) : '',
    },
    {
      label: 'Reporting Manager',
      value: (
        <Link
          to={`/directory/employee-profile/${managerGeneralInfo?.userId}`}
          className={styles.employeeLink}
        >
          {getEmployeeName(managerGeneralInfo)}
        </Link>
      ),
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
