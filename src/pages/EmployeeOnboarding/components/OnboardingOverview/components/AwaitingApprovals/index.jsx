import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';

import { PROCESS_STATUS } from '@/models/onboard';
import ApprovedFinalOffers from './components/ApprovedFinalOffers/index';
import SentForApprovals from './components/SentForApprovals/index';
import AllTab from './components/AllTab';

import styles from './index.less';

const { TabPane } = Tabs;

class AwaitingApprovals extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { SENT_FOR_APPROVAL, APPROVED_OFFERS } = PROCESS_STATUS;

    if (dispatch) {
      this.fetchAwaitingApprovalsAll([SENT_FOR_APPROVAL, APPROVED_OFFERS]);
    }
  }

  fetchAwaitingApprovalsAll = (status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboard/fetchOnboardListAll',
      payload: {
        processStatus: status,
      },
    });
  };

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
      this.fetchAwaitingApprovalsAll([SENT_FOR_APPROVAL, APPROVED_OFFERS]);
    } else if (key === '2') {
      this.fetchAwaitingApprovals(SENT_FOR_APPROVAL);
    } else {
      this.fetchAwaitingApprovals(APPROVED_OFFERS);
    }
  };

  render() {
    const { awaitingApprovals = {}, dataAll, loadingAll } = this.props;
    const {
      sentForApprovals = [],
      approvedOffers = [],
      // rejectFinalOffer = [],
    } = awaitingApprovals;

    return (
      <div className={styles.AwaitingApprovals}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1" onChange={this.onChangeTab}>
            <TabPane tab="all" key="1">
              <AllTab list={dataAll} loading={loadingAll} />
            </TabPane>
            <TabPane tab="sent for approval" key="2">
              {/* <PendingApprovals list={pendingApprovals} /> */}
              <SentForApprovals list={sentForApprovals} />
            </TabPane>
            <TabPane tab="approved offers" key="3">
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
  const { onboard = {}, loading } = state;
  const { onboardingOverview = {} } = onboard;
  const { awaitingApprovals = {}, dataAll = [] } = onboardingOverview;

  return {
    awaitingApprovals,
    dataAll,
    loadingAll: loading.effects['onboard/fetchOnboardListAll'],
  };
})(AwaitingApprovals);
