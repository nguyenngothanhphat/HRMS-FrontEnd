import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import ApplicationStatus from './components/ApplicationStatus';
import CompanyProfile from './components/CompanyProfile';
import EmployeeDetails from './components/EmployeeDetails';
import YourActivity from './components/YourActivity';
import PendingTasks from './components/PendingTasks';
import QueryBar from './components/QueryBar';
import styles from './index.less';

class CandidatePortal extends PureComponent {
  render() {
    return (
      <div className={styles.CandidatePortal}>
        <span className={styles.CandidatePortal__header}>Candidate Portal Dashboard</span>
        <Row span={24} gutter={['24', '24']}>
          <Col span={16}>
            <Row span={24} gutter={['24', '24']}>
              <Col span={8}>
                <ApplicationStatus />
              </Col>
              <Col span={16}>
                <EmployeeDetails />
              </Col>
            </Row>
            <Row span={24} gutter={['24', '24']} style={{ marginTop: '24px' }}>
              <Col span={14}>
                <YourActivity />
              </Col>
              <Col span={10}>
                <PendingTasks />
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <CompanyProfile />
          </Col>
        </Row>
        <Row span={24} gutter={['24', '24']}>
          <Col span={24}>
            <QueryBar />
          </Col>
        </Row>
      </div>
    );
  }
}

export default CandidatePortal;
