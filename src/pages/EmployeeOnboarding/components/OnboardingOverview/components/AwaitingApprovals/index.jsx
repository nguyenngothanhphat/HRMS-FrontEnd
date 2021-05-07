import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';

import { PROCESS_STATUS } from '@/models/onboard';
import ApprovedFinalOffers from './components/ApprovedFinalOffers/index';
import SentForApprovals from './components/SentForApprovals/index';

import styles from './index.less';

const { TabPane } = Tabs;

class AwaitingApprovals extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { SENT_FOR_APPROVAL } = PROCESS_STATUS;

    if (dispatch) {
      this.fetchAwaitingApprovals(SENT_FOR_APPROVAL);
    }
  }

  fetchAwaitingApprovals = (status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: status,
      },
    });
  };

  onChangeTab = (key) => {
    const { SENT_FOR_APPROVAL, APPROVED_OFFERS } = PROCESS_STATUS;
    if (key === '1') {
      this.fetchAwaitingApprovals(SENT_FOR_APPROVAL);
    } else if (key === '2') {
      this.fetchAwaitingApprovals(APPROVED_OFFERS);
    }
  };

  render() {
    const { awaitingApprovals = {} } = this.props;
    const {
      sentForApprovals = [],
      approvedOffers = [],
      // rejectFinalOffer = [],
    } = awaitingApprovals;

    return (
      <div className={styles.AwaitingApprovals}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1" onChange={this.onChangeTab}>
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
