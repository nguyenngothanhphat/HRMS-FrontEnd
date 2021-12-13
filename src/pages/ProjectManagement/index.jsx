import { Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import Projects from './components/Projects';
import styles from './index.less';

const { TabPane } = Tabs;

// PRD
// https://docs.google.com/document/d/1RQ66VdevjGUHB3-4_VDU-DIPF0HCbcfKzKJevEwooLc/edit

const ProjectManagement = (props) => {
  const {
    match: { params: { tabName = '' } = {} },
    permissions = {},
  } = props;

  // permissions
  const viewProjectListPermission = permissions.viewProjectListTab !== -1;
  const viewProjectSettingPermission = permissions.viewProjectSettingTab !== -1;

  useEffect(() => {
    if (!tabName) {
      history.replace(`/project-management/list`);
    }
  }, []);

  if (!tabName) return '';
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
          {viewProjectListPermission && (
            <TabPane tab="Projects" key="list">
              <Projects />
            </TabPane>
          )}

          {viewProjectSettingPermission && (
            <TabPane tab="Settings" key="settings">
              Setting Pages
            </TabPane>
          )}
        </Tabs>
      </PageContainer>
    </div>
  );
};
export default connect(({ user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
}))(ProjectManagement);
