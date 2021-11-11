import { Affix } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import LayoutProjectInformation from '@/components/LayoutProjectInformation';
import Summary from './components/Summary';
import Documents from './components/Documents';
import styles from './index.less';

const ProjectInformation = (props) => {
  const { match: { params: { reId = '', tabName = '' } = {} } = {} } = props;
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
      name: 'Planning',
      component: '',
      link: 'planning',
    },
    {
      id: 4,
      name: 'Tracking',
      component: '',
      link: 'tracking',
    },
    {
      id: 5,
      name: 'Reporting',
      component: '',
      link: 'reporting',
    },
    {
      id: 6,
      name: 'Audit Trail',
      component: '',
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
