import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';

import ApprovedFinalOffers from './components/ApprovedFinalOffers/index';
import PendingApprovals from './components/PendingApprovals/index';
import RejectFinalOffers from './components/RejectFinalOffers/index';
import SentForApprovals from './components/SentForApprovals/index';

import styles from './index.less';

const { TabPane } = Tabs;

class AwaitingApprovals extends PureComponent {
  render() {
    const { awaitingApprovals = {} } = this.props;
    const {
      approvedFinalOffers = [],
      pendingApprovals = [],
      sentForApprovals = [],
      approvedOffers = [],
      // rejectFinalOffer = [],
    } = awaitingApprovals;

    return (
      <div className={styles.AwaitingApprovals}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="sent for approval" key="1">
              {/* <PendingApprovals list={pendingApprovals} /> */}
              <SentForApprovals list={sentForApprovals} />
            </TabPane>
            <TabPane tab="approved offers" key="2">
              {/* <ApprovedFinalOffers list={approvedFinalOffers} /> */}
              <ApprovedFinalOffers list={approvedOffers} />
            </TabPane>
            {/* <TabPane tab="reject final offers" key="3">
              <RejectFinalOffers list={rejectFinalOffer} />
            </TabPane> */}
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
