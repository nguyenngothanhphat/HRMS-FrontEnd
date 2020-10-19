import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';
// import SentProvisionalOffers from './components/SentProvisionalOffers/index';
// import AcceptedProvisionalOffers from './components/AcceptedProvisionalOffers/index';
// import RenegotiateProvisionalOffers from './components/RenegotiateProvisionalOffers/index';
import Pending from './components/Pending/index';
import EligibleCandidates from './components/EligibleCandidates/index';
import IneligibleCandidates from './components/IneligibleCandidates/index';

import styles from './index.less';

class BackgroundCheck extends PureComponent {
  render() {
    const { TabPane } = Tabs;
    const { backgroundCheck = {} } = this.props;
    const { pending = [], eligibleCandidates = [], ineligibleCandidates = [] } = backgroundCheck;

    return (
      <div className={styles.BackgroundCheck}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1">
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
              tab="pending"
              key="1"
            >
              <Pending list={pending} />
            </TabPane>

            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="eligible candidates"
              key="2"
            >
              <EligibleCandidates list={eligibleCandidates} />
            </TabPane>

            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="ineligible candidates"
              key="3"
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
  const { onboard = {} } = state;
  const { onboardingOverview = {} } = onboard;
  const { backgroundCheck = {} } = onboardingOverview;

  return {
    backgroundCheck,
  };
})(BackgroundCheck);
