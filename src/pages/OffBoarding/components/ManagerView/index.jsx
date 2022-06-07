import { Tabs } from 'antd';
import React from 'react';
import { history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import TeamRequest from './components/TeamRequest';
import styles from './index.less';

const TABS = {
  MY: 'my',
  TEAM: 'team',
};

const { TabPane } = Tabs;

const ManagerView = (props) => {
  const { tabName = '' } = props;
  return (
    <div className={styles.ManagerView}>
      <PageContainer>
        <Tabs
          activeKey={tabName || TABS.TEAM}
          //   tabBarExtraContent={options()}
          onChange={(key) => {
            history.push(`/offboarding/${key}`);
          }}
          destroyInactiveTabPane
        >
          <TabPane tab="Team Request" key={TABS.TEAM}>
            <TeamRequest />
          </TabPane>
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default ManagerView;
