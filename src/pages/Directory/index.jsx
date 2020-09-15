import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Tabs } from 'antd';
import { formatMessage } from 'umi';
import styles from './index.less';
import OrganChart from './components/OrganisationChart';
import DirectoryComponent from './components/Directory';

export default class Directory extends PureComponent {
  operations = () => {
    return (
      <div className={styles.viewActivityBox}>
        <div className={styles.viewActivityBoxBackGround} />
        <div className={styles.viewActivityButton}>
          {formatMessage({ id: 'pages.directory.viewActivityLog' })} (15)
        </div>
      </div>
    );
  };

  render() {
    const { TabPane } = Tabs;
    return (
      <PageContainer>
        <div className={styles.containerDirectory}>
          <Tabs defaultActiveKey="1" className={styles.Tab} tabBarExtraContent={this.operations()}>
            <TabPane tab={formatMessage({ id: 'pages.directory.directoryTab' })} key="1">
              <DirectoryComponent />
            </TabPane>
            <TabPane tab={formatMessage({ id: 'pages.directory.organisationChartTab' })} key="2">
              <OrganChart />
            </TabPane>
          </Tabs>
        </div>
      </PageContainer>
    );
  }
}
