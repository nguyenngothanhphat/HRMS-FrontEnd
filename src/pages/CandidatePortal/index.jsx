import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import ApplicationStatus from './components/ApplicationStatus';
import CompanyProfile from './components/CompanyProfile';
import EmployeeDetails from './components/EmployeeDetails';
import YourActivity from './components/YourActivity';
import PendingTasks from './components/PendingTasks';
import QueryBar from './components/QueryBar';
import WelcomeModal from './components/WelcomeModal';
import styles from './index.less';

class CandidatePortal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openWelcomeModal: true,
    };
  }

  handleWelcomeModal = (value) => {
    this.setState({
      openWelcomeModal: value,
    });
  };

  render() {
    const { openWelcomeModal } = this.state;
    return (
      <div className={styles.CandidatePortal}>
        <p className={styles.CandidatePortal__header}>Candidate Portal Dashboard</p>
        <Row span={24} gutter={[24, 24]} style={{ marginBottom: '24px' }}>
          <Col
            sm={24}
            lg={16}
            gutter={[24, 24]}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <Row span={24} gutter={[24, 24]} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={8} lg={8}>
                <ApplicationStatus />
              </Col>
              <Col xs={24} sm={16} lg={16}>
                <EmployeeDetails />
              </Col>
            </Row>

            <Row span={24} gutter={[24, 24]} style={{ height: '100%' }}>
              <Col xs={24} lg={14}>
                <YourActivity />
              </Col>
              <Col xs={24} lg={10}>
                <PendingTasks />
              </Col>
            </Row>
          </Col>

          <Col sm={24} lg={8}>
            <CompanyProfile />
          </Col>
        </Row>
        <Row span={24} gutter={[24, 24]}>
          <Col span={24}>
            <QueryBar />
          </Col>
        </Row>
        <WelcomeModal visible={openWelcomeModal} onClose={() => this.handleWelcomeModal(false)} />
      </div>
    );
  }
}

export default CandidatePortal;
