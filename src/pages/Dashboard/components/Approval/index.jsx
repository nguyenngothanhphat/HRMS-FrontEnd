import { Tabs } from 'antd';
import React from 'react';
import { PageContainer } from '@/layouts/layout/src';
import ApprovalPage from './components/ApprovalPage';
import styles from './index.less';

const { TabPane } = Tabs;

const Approval = () => {
  return (
    <PageContainer>
      <div className={styles.containerApproval}>
        <Tabs
          activeKey="approval"
          tabBarExtraContent={
            <div
              className={styles.viewActivityLog}
              // onClick={this.viewActivityLog}
            >
              <span className={styles.title}>View Activity logs (15)</span>
            </div>
          }
        >
          <TabPane tab="Approvals" key="approval">
            <ApprovalPage />
          </TabPane>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Approval;
