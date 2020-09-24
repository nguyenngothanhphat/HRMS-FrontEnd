import React, { Component } from 'react';
import { Tabs } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { connect, formatMessage } from 'umi';

import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';
import ApprovedFinalOffers from './components/ApprovedFinalOffers';
import PendingApprovals from './components/PendingApprovals';
import RejectFinalOffers from './components/RejectFinalOffers';

import { rookieList } from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';

import styles from './index.less';

const { TabPane } = Tabs;

class AwaitingApprovals extends Component {
  render() {
    const { awaitingApprovals = {} } = this.props;
    const {
      approvedFinalOffers = [],
      pendingApprovals = [],
      rejectFinalOffer = [],
    } = awaitingApprovals;

    return (
      <div className={styles.AwaitingApprovals}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="pending aprrovals" key="1">
              <PendingApprovals list={pendingApprovals} />
            </TabPane>
            <TabPane tab="approved final offers" key="2">
              <ApprovedFinalOffers list={approvedFinalOffers} />
            </TabPane>
            <TabPane tab="reject final offers" key="3">
              <RejectFinalOffers list={rejectFinalOffer} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

// export default AwaitingApprovals;
export default connect((state) => {
  const { onboard = {} } = state;
  const { onboardingOverview = {} } = onboard;
  const { awaitingApprovals = {} } = onboardingOverview;

  return {
    awaitingApprovals,
  };
})(AwaitingApprovals);
