import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import styles from './index.less';

class ApplicationStatus extends PureComponent {
  itemBox = (item, index) => {
    return (
      <Col key={index} xs={12} md={8} lg={6} className={styles.itemBox}>
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
        firstName: candidateFirstName = '',
        middleName: candidateMiddleName = '',
        lastName: candidateLastName = '',
        ticketID = '',
      } = {} || {},
    } = this.props;

    let candidateFullName = `${candidateFirstName} ${candidateMiddleName} ${candidateLastName}`;
    if (!candidateMiddleName) candidateFullName = `${candidateFirstName} ${candidateLastName}`;

    let managerFullName = `${firstName} ${middleName} ${lastName}`;
    if (!middleName) managerFullName = `${firstName} ${lastName}`;

    const items = [
      {
        name: 'Name',
        value: candidateFullName || '-',
      },
      {
        name: 'Designation',
        value: titleName || '-',
      },
      {
        name: 'Hiring Manager',
        value: managerFullName || '-',
      },
      {
        name: 'Joining Date',
        value: dateOfJoining ? moment(dateOfJoining).format('DD.MM.YY') : '-',
      },
      {
        name: 'Candidate ID',
        value: ticketID || '-',
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
        name: 'Location',
        value: workLocation?.name || '-',
      },
    ];
    return (
      <div className={styles.ApplicationStatus}>
        <div className={styles.header}>
          <span>Application Status</span>
          <span className={styles.status}>Onboarding</span>
        </div>
        <Row gutter={[24, 10]} className={styles.content}>
          {items.map((val, index) => this.itemBox(val, index))}
        </Row>
      </div>
    );
  }
}

export default ApplicationStatus;
