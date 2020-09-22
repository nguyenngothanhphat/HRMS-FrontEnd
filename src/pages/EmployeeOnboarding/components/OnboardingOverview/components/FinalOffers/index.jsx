import React, { Component } from 'react';
import { Tabs } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';

import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';
import SentFinalOffers from './components/SentFinalOffers';
import AcceptedFinalOffers from './components/AcceptedFinalOffers';

import { rookieList } from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';

import styles from './index.less';

class FinalOffers extends Component {
  render() {
    const { TabPane } = Tabs;

    return (
      <div className={styles.FinalOffers}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1">
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
              tab="sent final offers"
              key="1"
            >
              {/* <OnboardTable list={rookieList} /> */}
              <SentFinalOffers />
            </TabPane>
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="accepted final offers"
              key="2"
            >
              <AcceptedFinalOffers />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default FinalOffers;
