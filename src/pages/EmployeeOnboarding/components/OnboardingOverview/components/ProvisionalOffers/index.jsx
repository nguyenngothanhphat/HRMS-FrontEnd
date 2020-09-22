import React, { Component } from 'react';
import { Tabs } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';

import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';
import SentProvisionalOffers from './components/SentProvisionalOffers';
import ReceivedProvisionalOffers from './components/ReceivedProvisionalOffers';

import { rookieList } from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';

import styles from './index.less';

class ProvisionalOffers extends Component {
  render() {
    const { TabPane } = Tabs;

    return (
      <div className={styles.PendingEligibilityChecks}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1">
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
              tab="sent provisional offers"
              key="1"
            >
              {/* <OnboardTable list={rookieList} /> */}
              <SentProvisionalOffers />
            </TabPane>
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="received provisional offers"
              key="2"
            >
              <ReceivedProvisionalOffers />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default ProvisionalOffers;
