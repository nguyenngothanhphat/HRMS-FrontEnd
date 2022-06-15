import { Col, Row } from 'antd';
import React, { PureComponent } from 'react';
import Joyride from 'react-joyride';
import { connect } from 'umi';
import { NEW_COMER_STEPS } from '@/utils/candidatePortal';
import { getIsFirstLogin, setIsFirstLogin } from '@/utils/authority';
import CompanyProfile from './components/CompanyProfile';
import ApplicationStatus from './components/NewApplicationStatus';
import PendingTasks from './components/PendingTasks';
import YourActivity from './components/YourActivity';
import styles from './index.less';

@connect(
  ({
    candidatePortal: { localStep, data, tempData } = {},
    user: { currentUser: { candidate = '' } = {} } = {},
    loading,
  }) => ({
    localStep,
    data,
    tempData,
    candidate,
    loadingFetchCandidate: loading.effects['candidatePortal/fetchCandidateById'],
  }),
)
class Dashboard extends PureComponent {
  componentDidUpdate = async (prevProps) => {
    const { dispatch, data: { processStatus = '' } = {} || {} } = this.props;
    if (processStatus !== prevProps.data.processStatus) {
      dispatch({
        type: 'candidatePortal/refreshPendingTasks',
      });
    }
  };

  handleJoyrideCallback = (data) => {
    const { status } = data;
    if (status === 'finished') {
      setIsFirstLogin(false);
    }
  };

  render() {
    const { loadingFetchCandidate, data = {} } = this.props;
    const isFirstLogin = getIsFirstLogin();

    return (
      <div className={styles.Dashboard}>
        <Row span={24} gutter={[24, 24]} style={{ marginBottom: '24px' }}>
          <Col
            sm={24}
            lg={16}
            gutter={[24, 24]}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <Row span={24} gutter={[24, 24]} style={{ marginBottom: '24px' }}>
              <Col xs={24} className="applicationStatus">
                <ApplicationStatus loading={loadingFetchCandidate} data={data} />
              </Col>
            </Row>

            <Row span={24} gutter={[24, 24]} style={{ height: '100%' }}>
              <Col xs={24} lg={14} className="yourActivity">
                <YourActivity />
              </Col>
              <Col xs={24} lg={10} className="pendingTasks">
                <PendingTasks />
              </Col>
            </Row>
          </Col>

          <Col sm={24} lg={8} className="companyProfile">
            <CompanyProfile />
          </Col>
        </Row>
        <Joyride
          steps={NEW_COMER_STEPS}
          continuous
          showProgress
          showSkipButton
          run={isFirstLogin}
          callback={this.handleJoyrideCallback}
          close
          styles={{
            options: {
              primaryColor: '#ffa100',
              width: 300,
              zIndex: 2023,
            },
          }}
        />
      </div>
    );
  }
}

export default Dashboard;
