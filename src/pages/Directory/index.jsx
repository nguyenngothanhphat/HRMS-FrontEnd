import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Tabs } from 'antd';
import styles from './index.less';
import OrganChart from './components/OrganisationChart';
import DirectoryComponent from './components/Directory';

export default class Directory extends PureComponent {
  render() {
    const { TabPane } = Tabs;
    return (
      <PageContainer>
        <div className={styles.containerDirectory}>
          <Tabs defaultActiveKey="1" className={styles.Tab}>
            <TabPane tab="Directory" key="1">
              <DirectoryComponent />
            </TabPane>
            <TabPane tab="Organisation Chart" key="2">
              <OrganChart />
            </TabPane>
          </Tabs>
        </div>
      </PageContainer>
    );
  }
}
