import React, { Component } from 'react';
import { Affix, Skeleton } from 'antd';
import { connect } from 'umi';

import { getCurrentTenant, getCurrentCompany } from '@/utils/authority';
import { PageContainer } from '@/layouts/layout/src';
import ViewProfile from './View';
import EditProfile from './Edit';
import UserProfileLayout from '../../components/LayoutUserProfile';

import styles from './index.less';

@connect(({ user: { currentUser = {} } = {} }) => ({
  currentUser,
}))
class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
    };
  }

  handleClickEdit = (value) => {
    this.setState({
      isEdit: value,
    });
  };

  render() {
    const { isEdit } = this.state;
    const { currentUser = {} } = this.props;
    const tenant = getCurrentTenant();
    const company = getCurrentCompany();

    return (
      <PageContainer>
        <div className={styles.containerUserProfile}>
          <Affix offsetTop={30}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>User Profile</p>
            </div>
          </Affix>
          {tenant && company ? (
            <UserProfileLayout>
              {isEdit ? (
                <EditProfile handleCancel={this.handleClickEdit} currentUser={currentUser} />
              ) : (
                <ViewProfile handleClickEdit={this.handleClickEdit} currentUser={currentUser} />
              )}
            </UserProfileLayout>
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
