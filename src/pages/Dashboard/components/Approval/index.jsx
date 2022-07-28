import { Tabs } from 'antd';
import React from 'react';
import CustomBlueButton from '@/components/CustomBlueButton';
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
              <CustomBlueButton>View activity logs</CustomBlueButton>
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
