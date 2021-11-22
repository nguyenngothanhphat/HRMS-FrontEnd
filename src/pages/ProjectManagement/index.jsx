import { Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import Projects from './components/Projects';
import styles from './index.less';

const { TabPane } = Tabs;

const ProjectManagement = (props) => {
  const {
    match: { params: { tabName = '' } = {} },
  } = props;

  useEffect(() => {
    if (!tabName) {
      history.replace(`/project-management/list`);
    }
  }, [tabName]);

  return (
    <div className={styles.ProjectManagement}>
      <PageContainer>
        <Tabs
          activeKey={tabName || 'list'}
          onChange={(key) => {
            history.push(`/project-management/${key}`);
          }}
          destroyInactiveTabPane
        >
          <TabPane tab="Projects" key="list">
            <Projects />
          </TabPane>

          <TabPane tab="Settings" key="settings">
            Setting Pages
          </TabPane>
        </Tabs>
      </PageContainer>
    </div>
  );
};
export default connect(({ user: { currentUser = {}, permissions = [] } = {} }) => ({
  currentUser,
  permissions,
}))(ProjectManagement);
