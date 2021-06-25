import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';
// import SentProvisionalOffers from './components/SentProvisionalOffers/index';
// import AcceptedProvisionalOffers from './components/AcceptedProvisionalOffers/index';
// import RenegotiateProvisionalOffers from './components/RenegotiateProvisionalOffers/index';
import { PROCESS_STATUS } from '@/models/onboard';
import Pending from './components/Pending/index';
import EligibleCandidates from './components/EligibleCandidates/index';
import IneligibleCandidates from './components/IneligibleCandidates/index';
import AllTab from './components/AllTab';

import styles from './index.less';

class BackgroundCheck extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { PENDING, INELIGIBLE_CANDIDATES, ELIGIBLE_CANDIDATES } = PROCESS_STATUS;

    if (dispatch) {
      this.fetchBackgroundCheckAll([PENDING, ELIGIBLE_CANDIDATES, INELIGIBLE_CANDIDATES]);
    }
  }

  fetchBackgroundCheckAll = (status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboard/fetchOnboardListAll',
      payload: {
        processStatus: status,
      },
    });
  };

  fetchBackgroundCheck = (status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: status,
      },
    });
  };

  onChangeTab = (key) => {
    const { PENDING, ELIGIBLE_CANDIDATES, INELIGIBLE_CANDIDATES } = PROCESS_STATUS;
    if (key === '1') {
      this.fetchBackgroundCheckAll([PENDING, ELIGIBLE_CANDIDATES, INELIGIBLE_CANDIDATES]);
    } else if (key === '2') {
      this.fetchBackgroundCheck(PENDING);
    } else if (key === '3') {
      this.fetchBackgroundCheck(ELIGIBLE_CANDIDATES);
    } else {
      this.fetchBackgroundCheck(INELIGIBLE_CANDIDATES);
    }
  };

  render() {
    const { TabPane } = Tabs;
    const { backgroundCheck = {}, dataAll, loadingAll } = this.props;
    const { pending = [], eligibleCandidates = [], ineligibleCandidates = [] } = backgroundCheck;

    return (
      <div className={styles.BackgroundCheck}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1" onChange={this.onChangeTab}>
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
              tab="all"
              key="1"
            >
              <AllTab list={dataAll} loading={loadingAll} />
            </TabPane>

            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
              tab="pending"
              key="2"
            >
              <Pending list={pending} />
            </TabPane>

            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="eligible candidates"
              key="3"
            >
              <EligibleCandidates list={eligibleCandidates} />
            </TabPane>

            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="ineligible candidates"
              key="4"
            >
              <IneligibleCandidates list={ineligibleCandidates} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

// export default ProvisionalOffers;
export default connect((state) => {
  const { onboard = {}, loading } = state;
  const { onboardingOverview = {} } = onboard;
  const { backgroundCheck = {}, dataAll = [] } = onboardingOverview;

  return {
    backgroundCheck,
    dataAll,
    loadingAll: loading.effects['onboard/fetchOnboardListAll'],
  };
})(BackgroundCheck);
