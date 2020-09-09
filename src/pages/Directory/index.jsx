import React, { PureComponent } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, Button } from 'antd';
import styles from './index.less';
import OrganChart from './components/OrganisationChart';
import DirectoryComponent from './components/Directory';

export default class Directory extends PureComponent {
  operations = (<Button style={styles.viewActivityButton}>View activity logs (15)</Button>);

  render() {
    const { TabPane } = Tabs;
    return (
      <PageContainer>
        <div className={styles.containerDirectory}>
          <Tabs defaultActiveKey="1" className={styles.Tab} tabBarExtraContent={this.operations}>
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
