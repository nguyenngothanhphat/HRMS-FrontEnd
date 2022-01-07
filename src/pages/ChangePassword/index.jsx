/* eslint-disable compat/compat */
import { Affix } from 'antd';
import React, { Component } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import ChangePasswordBox from '@/components/ChangePasswordBox';
import styles from './index.less';

@connect(() => ({}))
class ChangePassword extends Component {
  onFinish = (values) => {
    const { dispatch } = this.props;
    const payload = {
      oldPassword: values.currentPassword,
      newPassword: values.newPassword,
    };
    dispatch({
      type: 'changePassword/updatePassword',
      payload,
    });
  };

  render() {
    return (
      <PageContainer>
        <Affix offsetTop={42}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage_text}>Change Password</p>
          </div>
        </Affix>
        <div className={styles.ChangePassword}>
          <ChangePasswordBox onFinish={this.onFinish} />
        </div>
      </PageContainer>
    );
  }
}

export default ChangePassword;
