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

const ProjectInformation = (props) => {
  const { dispatch, match: { params: { reId = '', tabName = '' } = {} } = {} } = props;

  const fetchProjectByID = () => {
    dispatch({
      type: 'projectDetails/fetchProjectByIdEffect',
      payload: {
        id: reId,
      },
    });
  };

  useEffect(() => {
    fetchProjectByID();
  }, []);

  const listMenu = [
    {
      id: 1,
      name: 'Summary',
      component: <Summary />,
      link: 'summary',
    },
    {
      id: 2,
      name: 'Documents',
      component: <Documents />,
      link: 'documents',
    },
    {
      id: 3,
      name: 'Resources',
      component: <Resources />,
      link: 'resources',
    },
    {
      id: 4,
      name: 'Planning',
      component: <Planning />,
      link: 'planning',
    },
    {
      id: 5,
      name: 'Tracking',
      component: '',
      link: 'tracking',
    },
    {
      id: 6,
      name: 'Reporting',
      component: '',
      link: 'reporting',
    },
    {
      id: 7,
      name: 'Audit Trail',
      component: <AuditTrail />,
      link: 'audit-trail',
    },
  ];

  return (
    <PageContainer>
      <div className={styles.ProjectInformation}>
        <Affix offsetTop={30}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage__text}>Project Information</p>
          </div>
        </Affix>

        <LayoutProjectInformation listMenu={listMenu} reId={reId} tabName={tabName} />
      </div>
    </PageContainer>
  );
};
export default connect(({ user: { currentUser = {}, permissions = [] } = {} }) => ({
  currentUser,
  permissions,
}))(ProjectInformation);
