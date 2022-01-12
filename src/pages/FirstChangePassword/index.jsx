import React, { PureComponent } from 'react';
import { connect } from 'umi';
import ChangePasswordBox from '@/components/ChangePasswordBox';
import styles from './index.less';

@connect(({ loading }) => ({
  loading: loading.effects['changePassword/updatePassword'],
}))
class FirstChangePassword extends PureComponent {
  handleLogout = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'login/logout',
      });
    }
  };

  onFinish = async (values) => {
    const { dispatch } = this.props;
    const payload = {
      oldPassword: values.currentPassword,
      newPassword: values.newPassword,
    };
    const res = await dispatch({
      type: 'changePassword/updatePassword',
      payload,
      isFirstLogin: true,
    });
    if (res?.statusCode === 200) {
      setTimeout(() => {
        this.handleLogout();
      }, 1000);
    }
  };

  render() {
    return (
      <div className={styles.FirstChangePassword}>
        <ChangePasswordBox showOption onFinish={this.onFinish} />
      </div>
    );
  }
}
export default FirstChangePassword;
