import { Affix } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import LayoutProjectInformation from '@/components/LayoutProjectInformation';
import Summary from './components/Summary';
import Documents from './components/Documents';
import Planning from './components/Planning';
import Resources from './components/Resources';
import AuditTrail from './components/AuditTrail';
import styles from './index.less';
import WorkInProgress from '@/components/WorkInProgress';

const ProjectInformation = (props) => {
  const {
    dispatch,
    match: { params: { reId = '', tabName = '' } = {} } = {},
    projectDetail: { projectName = '' } = {},
    loadingFetchProjectById = false,
    permissions = {},
  } = props;

  // permissions
  const modifyProjectPermission = permissions.modifyProject !== -1;

  const fetchProjectByID = async () => {
    dispatch({
      type: 'projectDetails/fetchProjectByIdEffect',
      payload: {
        projectId: reId,
      },
    });
  };

  useEffect(() => {
    fetchProjectByID();
    return () => {
      dispatch({
        type: 'projectDetails/clearState',
      });
    };
  }, []);

  const listMenu = [
    {
      id: 1,
      name: 'Summary',
      component: <Summary allowModify={modifyProjectPermission} />,
      link: 'summary',
    },
    {
      id: 2,
      name: 'Documents',
      component: <Documents allowModify={modifyProjectPermission} />,
      link: 'documents',
    },
    {
      id: 3,
      name: 'Resources',
      component: <Resources allowModify={modifyProjectPermission} />,
      link: 'resources',
    },
    {
      id: 4,
      name: 'Planning',
      component: <Planning allowModify={modifyProjectPermission} />,
      link: 'planning',
    },
    {
      id: 5,
      name: 'Tracking',
      component: <WorkInProgress />,
      link: 'tracking',
    },
    {
      id: 6,
      name: 'Reporting',
      component: <WorkInProgress />,
      link: 'reporting',
    },
    {
      id: 7,
      name: 'Audit Trail',
      component: <AuditTrail allowModify={modifyProjectPermission} />,
      link: 'audit-trail',
    },
  ];

  return (
    <PageContainer>
      <div className={styles.ProjectInformation}>
        <Affix offsetTop={42}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage__text}>{projectName || 'View Project'}</p>
          </div>
        </Affix>

        <LayoutProjectInformation
          listMenu={listMenu}
          reId={reId}
          tabName={tabName}
          loading={loadingFetchProjectById}
        />
      </div>
    </PageContainer>
  );
};
export default connect(
  ({ loading, user: { permissions = {} }, projectDetails: { projectDetail = {} } }) => ({
    projectDetail,
    permissions,
    loadingFetchProjectById: loading.effects['projectDetails/fetchProjectByIdEffect'],
  }),
)(ProjectInformation);
