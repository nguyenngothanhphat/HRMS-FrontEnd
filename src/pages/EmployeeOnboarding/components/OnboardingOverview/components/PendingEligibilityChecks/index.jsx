/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-no-undef */
import React, { Component } from 'react';
import { Tabs } from 'antd';
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
            <TabPane tab="Sent Eligibility forms " key="1">
              <SentEligibilityForms />
            </TabPane>
            <TabPane tab="Received Submitted Documents" key="2">
              <ReceivedSubmittedDocuments />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default PendingEligibilityChecks;
