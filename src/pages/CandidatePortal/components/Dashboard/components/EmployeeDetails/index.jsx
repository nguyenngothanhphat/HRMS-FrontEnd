import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import styles from './index.less';

class EmployeeDetails extends PureComponent {
  itemBox = (item, index) => {
    return (
      <Col key={index} xs={12} md={8} className={styles.itemBox}>
        <span className={styles.status}>{item.name}:</span>
        <span className={styles.dateOfJoining}>{item.value}</span>
      </Col>
    );
  };

  render() {
    const {
      data: {
        title: { name: titleName = '' } = {} || {},
        assignTo: {
          generalInfo: { firstName = '', lastName = '', middleName = '' } = {} || {},
        } = {} || {},
        dateOfJoining = '',
        department: { name: departmentName = '' } = {} || {},
        workLocation = {} || {},
        grade = '',
      } = {} || {},
    } = this.props;

    let fullName = `${firstName} ${middleName} ${lastName}`;
    if (!middleName) fullName = `${firstName} ${lastName}`;
    const items = [
      {
        name: 'Designation',
        value: titleName || '-',
      },
      {
        name: 'Hiring Manager',
        value: fullName || '-',
      },
      {
        name: 'Joining Date',
        value: dateOfJoining ? moment(dateOfJoining).format('MM/DD/YYYY') : '-',
      },
      {
        name: 'Department',
        value: departmentName || '-',
      },
      {
        name: 'Grade',
        value: grade || '-',
      },
      {
        name: 'Work Location',
        value: workLocation?.name || '-',
      },
    ];
    return (
      <div className={styles.EmployeeDetails}>
        <div className={styles.header}>
          <span>Employee Details</span>
        </div>
        <Row gutter={['24', '24']} className={styles.content}>
          {items.map((val, index) => this.itemBox(val, index))}
        </Row>
      </div>
    );
  }
}

export default EmployeeDetails;
