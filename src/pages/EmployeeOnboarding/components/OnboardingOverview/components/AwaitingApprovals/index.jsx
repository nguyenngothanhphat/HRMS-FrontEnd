import React, { Component } from 'react';
import { Tabs } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';

import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';
import ApprovedFinalOffers from './components/ApprovedFinalOffers';
import PendingApprovals from './components/PendingApprovals';
import RejectFinalOffers from './components/RejectFinalOffers';

import { rookieList } from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';

import styles from './index.less';

class ProvisionalOffers extends Component {
  render() {
    const { TabPane } = Tabs;

    return (
      <div className={styles.AwaitingApprovals}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="pending aprrovals" key="1">
              <PendingApprovals />
            </TabPane>
            <TabPane tab="approved final offers" key="2">
              <ApprovedFinalOffers />
            </TabPane>
            <TabPane tab="reject final offers" key="3">
              <RejectFinalOffers />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default ProvisionalOffers;
