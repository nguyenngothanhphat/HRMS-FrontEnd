import React from 'react';
import { connect } from 'umi';
import { Row, Col } from 'antd';
import styles from './index.less';

const Information = (props) => {
  const { data: { legalName = '', title = {}, department = {}, employeeCode = '' } = {} } = props;

  const items = [
    {
      name: 'Employee Name',
      value: <span className={styles.boldText}>{legalName}</span>,
    },
    {
      name: 'Designation',
      value: <span className={styles.boldText}>{title?.name}</span>,
    },
    {
      name: 'Department',
      value: <span className={styles.boldText}>{department?.name}</span>,
    },
    {
      name: 'Employee ID',
      value: <span className={styles.boldText}>{employeeCode}</span>,
    },
    {
      name: 'Location',
      value: <span className={styles.boldText} />,
    },
  ];
  return (
    <div className={styles.Information}>
      <Row gutter={[0, 12]}>
        {items.map((i) => {
          return (
            <Col span={8} className={styles.eachItem}>
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
