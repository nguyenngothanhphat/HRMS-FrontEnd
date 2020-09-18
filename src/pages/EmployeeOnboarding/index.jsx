import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Tabs, Button } from 'antd';

import OnboardingOverview from './components/OnboardingOverview';
import Settings from './components/Settings';
import CustomFields from './components/CustomFields';

import styles from './index.less';

export default class EmployeeOnboarding extends PureComponent {
  render() {
    const { TabPane } = Tabs;
    return (
      <PageContainer>
        <div className={styles.containerEmployeeOnboarding}>
          <div className={styles.tabs}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Onboarding overview" key="1">
                <OnboardingOverview />
              </TabPane>
              <TabPane tab="Settings" key="2">
                <Settings />
              </TabPane>
              <TabPane tab="Custom field" key="3">
                <CustomFields />
              </TabPane>
            </Tabs>

            <div className={styles.options}>
              <Button className={styles.generate} type="primary">
                Generate Report for onboarding
              </Button>
              <Button className={styles.view} type="primary">
                View Activity log (15)
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }
}
