import React from 'react';
import { connect } from 'umi';
import { Row, Col } from 'antd';
import styles from './index.less';

const Information = (props) => {
  const {
    data: {
      legalName = '',
      title = {},
      department = {},
      employeeCode = '',
      location: { state = '', countryName = '' } = {},
    } = {},
  } = props;

  const items = [
    {
      name: 'Employee Name',
      value: <span className={styles.boldText}>{legalName}</span>,
      span: 8,
    },
    {
      name: 'Designation',
      value: <span className={styles.boldText}>{title?.name}</span>,
      span: 8,
    },
    {
      name: 'Department',
      value: <span className={styles.boldText}>{department?.name}</span>,
      span: 8,
    },
    {
      name: 'Employee ID',
      value: <span className={styles.boldText}>{employeeCode}</span>,
      span: 8,
    },
    {
      name: 'Location',
      value: (
        <span className={styles.boldText}>
          {state}, {countryName}
        </span>
      ),
      span: 16,
    },
  ];
  return (
    <div className={styles.Information}>
      <Row gutter={[12, 12]} align="top">
        {items.map((i) => {
          return (
            <Col span={i.span} className={styles.eachItem}>
              <span className={styles.label}>{i.name}:</span>
              <span className={styles.value}>{i.value}</span>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

// export default DateSwitcher;
export default connect(() => ({}))(Information);
