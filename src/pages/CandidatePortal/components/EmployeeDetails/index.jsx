import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

class EmployeeDetails extends PureComponent {
  itemBox = (item) => {
    return (
      <Col span={8} className={styles.itemBox}>
        <span className={styles.status}>{item.name}:</span>
        <span className={styles.dateOfJoining}>{item.value}</span>
      </Col>
    );
  };

  render() {
    const items = [
      {
        name: 'Designation',
        value: 'Associate Sr. UX Designer',
      },
      {
        name: 'Hiring Manager',
        value: 'John Doe',
      },
      {
        name: 'Joining Date',
        value: '12 Aug 2021',
      },
      {
        name: 'Department',
        value: 'UX Department',
      },
      {
        name: 'Grade',
        value: '8',
      },
    ];
    return (
      <div className={styles.EmployeeDetails}>
        <div className={styles.header}>
          <span>Employee Details</span>
        </div>
        <Row gutter={['24', '24']} className={styles.content}>
          {items.map((val) => this.itemBox(val))}
        </Row>
      </div>
    );
  }
}

export default EmployeeDetails;
