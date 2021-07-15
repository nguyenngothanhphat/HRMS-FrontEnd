// /* eslint-disable react/prefer-stateless-function */
// /* eslint-disable react/jsx-no-undef */
import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';

import ReceivedSubmittedDocuments from './components/ReceivedSubmittedDocuments/index';
import SentEligibilityForms from './components/SentEligibilityForms/index';

import styles from './index.less';

const { TabPane } = Tabs;

class PendingEligibilityChecks extends PureComponent {
  render() {
    const { pendingEligibilityChecks = {} } = this.props;
    const { sentEligibilityForms = [], receivedSubmittedDocuments = [] } = pendingEligibilityChecks;
    // console.log(sentEligibilityForms);
    // console.log(receivedSubmittedDocuments);
    return (
      <div className={styles.PendingEligibilityChecks}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1">
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
              tab="sent eligibility forms"
              key="1"
            >
              <SentEligibilityForms list={sentEligibilityForms} />
            </TabPane>
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="received submitted documents"
              key="2"
            >
              <ReceivedSubmittedDocuments list={receivedSubmittedDocuments} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

// export default FinalOffers;
export default connect((state) => {
  const { onboard = {} } = state;
  const { onboardingOverview = {} } = onboard;
  const { pendingEligibilityChecks = {}, total = '' } = onboardingOverview;

  return {
    pendingEligibilityChecks,
  };
})(PendingEligibilityChecks);
