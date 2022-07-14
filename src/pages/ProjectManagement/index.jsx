import { Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect, history } from 'umi';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@/layouts/layout/src';
import Projects from './components/Projects';
import styles from './index.less';
import WorkInProgress from '@/components/WorkInProgress';
import { exportRawDataToCSV, goToTop } from '@/utils/utils';

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
    goToTop();
  }, []);

  const exportProjects = async () => {
    const { dispatch, projectListPayload = {} } = props;
    const getListDataExport = await dispatch({
      type: 'projectManagement/fetchProjectToExport',
      payload: {
        ...projectListPayload,
      },
    });
    let data = '';
    if (getListDataExport.statusCode === 200) {
      data = getListDataExport.data;
    }
    exportRawDataToCSV(data, 'projects.csv');
  };

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
          tabBarExtraContent={
            <>
              <p
                style={{
                  marginBottom: '0',
                  marginRight: '32px',
                  color: '#ffa100',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
                onClick={() => exportProjects()}
              >
                <DownloadOutlined /> Export
              </p>
            </>
          }
        >
          {viewProjectListPermission && (
            <TabPane tab="Projects" key="list">
              <Projects />
            </TabPane>
          )}

          {viewProjectSettingPermission && (
            <TabPane tab="Settings" key="settings">
              <div style={{ padding: '24px' }}>
                <WorkInProgress />
              </div>
            </TabPane>
          )}
        </Tabs>
      </PageContainer>
    </div>
  );
};
export default connect(
  ({
    loading,
    user: { currentUser = {}, permissions = {} } = {},
    projectManagement: { projectListPayload = {} },
  }) => ({
    currentUser,
    permissions,
    projectListPayload,
    loading: loading.effects['projectManagement/fetchProjectToExport'],
  }),
)(ProjectManagement);
