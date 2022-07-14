import { Col, Row } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { NEW_COMER_CLASS } from '@/utils/candidatePortal';
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

  render() {
    const { loadingFetchCandidate, data = {} } = this.props;

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
              <Col xs={24} className={NEW_COMER_CLASS.APPLICATION_STATUS}>
                <ApplicationStatus loading={loadingFetchCandidate} data={data} />
              </Col>
            </Row>

            <Row span={24} gutter={[24, 24]} style={{ height: '100%' }}>
              <Col xs={24} lg={14} className={NEW_COMER_CLASS.YOUR_ACTIVITY}>
                <YourActivity />
              </Col>
              <Col xs={24} lg={10} className={NEW_COMER_CLASS.PENDING_TASKS}>
                <PendingTasks />
              </Col>
            </Row>
          </Col>

          <Col sm={24} lg={8} className={NEW_COMER_CLASS.COMPANY_PROFILE}>
            <CompanyProfile />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
