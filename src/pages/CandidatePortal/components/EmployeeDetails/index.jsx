import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
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
    const {
      data: {
        title: { name: titleName = '' } = {} || {},
        assignTo: {
          generalInfo: { firstName = '', lastName = '', middleName = '' } = {} || {},
        } = {} || {},
        dateOfJoining = '',
        department: { name: departmentName = '' } = {} || {},
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
        value: dateOfJoining ? moment(dateOfJoining).format('DD.MM.YY') : '-',
      },
      {
        name: 'Department',
        value: departmentName || '-',
      },
      {
        name: 'Grade',
        value: '-',
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
