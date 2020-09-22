/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-no-undef */
import React, { Component } from 'react';
import { Tabs } from 'antd';
import { formatMessage } from 'umi';
import ReceivedSubmittedDocuments from './components/ReceivedSubmittedDocuments';
import SentEligibilityForms from './components/SentEligibilityForms';

import styles from './index.less';

class PendingEligibilityChecks extends Component {
  render() {
    const { TabPane } = Tabs;

    return (
      <div className={styles.PendingEligibilityChecks}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
              key="1"
            >
              <SentEligibilityForms />
            </TabPane>
            <TabPane
              tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              key="2"
            >
              <ReceivedSubmittedDocuments />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default PendingEligibilityChecks;
