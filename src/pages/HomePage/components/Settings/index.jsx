import { Affix } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import LayoutHomePageSettings from '@/components/LayoutHomePageSettings';
import PostManagement from './components/PostManagement';
import QuickLinkManagement from './components/QuickLinkManagement';
import styles from './index.less';

const Settings = (props) => {
  const { match: { params: { reId = '', tabName = '' } = {} } = {} } = props;
  const listMenu = [
    {
      id: 1,
      name: 'Post Management',
      component: <PostManagement />,
      link: 'post-management',
    },
    {
      id: 2,
      name: 'Quick Link Management',
      component: <QuickLinkManagement />,
      link: 'quick-link-management',
    },
  ];
  return (
    <PageContainer>
      <div className={styles.Settings}>
        <Affix offsetTop={42}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage__text}>Settings</p>
          </div>
        </Affix>

        <LayoutHomePageSettings listMenu={listMenu} reId={reId} tabName={tabName} />
      </div>
    </PageContainer>
  );
};

export default connect(({ user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
}))(Settings);
