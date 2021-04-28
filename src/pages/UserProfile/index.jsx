import React, { Component } from 'react';
import { Affix, Skeleton } from 'antd';

import { PageContainer } from '@/layouts/layout/src';
import { getCurrentTenant, getCurrentCompany } from '@/utils/authority';

import styles from './index.less';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const tenant = getCurrentTenant();
    const company = getCurrentCompany();

    return (
      <PageContainer>
        <div className={styles.containerUserProfile}>
          <Affix offsetTop={42}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>User Profile</p>
            </div>
          </Affix>
          {tenant && company ? (
            <div>User profile</div>
          ) : (
            <div style={{ padding: '24px' }}>
              <Skeleton />
            </div>
          )}
        </div>
      </PageContainer>
    );
  }
}

export default UserProfile;
