import { Col, Row } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
// import ApplicationStatus from './components/ApplicationStatus';
import ApplicationStatus from './components/NewApplicationStatus';
import CompanyProfile from './components/CompanyProfile';
// import EmployeeDetails from './components/EmployeeDetails';
import styles from './index.less';
import PendingTasks from './components/PendingTasks';
import YourActivity from './components/YourActivity';

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
              <Col xs={24}>
                <ApplicationStatus loading={loadingFetchCandidate} data={data} />
              </Col>
              {/* <Col xs={24} sm={16} lg={16}>
                <EmployeeDetails loading={loadingFetchCandidate} data={data} />
              </Col> */}
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
        {/* <Row span={24} gutter={[24, 24]}>
          <Col span={24}>
            <QueryBar />
          </Col>
        </Row> */}
      </div>
    );
  }
}

export default Dashboard;
