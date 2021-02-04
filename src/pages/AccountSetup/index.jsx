import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import avtDefault from '@/assets/avtDefault.jpg';
import { Avatar, Button } from 'antd';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import ItemCompany from './components/ItemCompany';
import s from './index.less';

@connect(({ user: { currentUser = {} } = {} }) => ({
  currentUser,
}))
class AccountSetup extends Component {
  componentDidMount() {
    // fetch list company
  }

  handleLogout = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'login/logout',
      });
    }
  };

  render() {
    const {
      currentUser: { generalInfo: { avatar = '' } = {}, company = {}, email = '' } = {},
    } = this.props;
    return (
      <div className={s.root}>
        <div style={{ width: '629px' }}>
          <div className={s.blockUserLogin}>
            <div className={s.blockUserLogin__avt}>
              <Avatar size={56} icon={<UserOutlined />} src={avatar || avtDefault} />
            </div>
            <div className={s.blockUserLogin__info}>
              <p>
                You are logged in as <span className={s.blockUserLogin__info__email}>{email}</span>
              </p>
              <p style={{ marginTop: '8px' }}>You have administrative privileges.</p>
            </div>
            <div className={s.blockUserLogin__action}>
              <SettingOutlined className={s.blockUserLogin__action__icon} />
              <LogoutOutlined
                onClick={this.handleLogout}
                className={s.blockUserLogin__action__icon}
                style={{ marginLeft: '24px' }}
              />
            </div>
          </div>
          <ItemCompany company={company} />
          <Button
            className={s.btnAddNew}
            onClick={() => history.push('/account-setup/add-company')}
          >
            Add new company
          </Button>
        </div>
      </div>
    );
  }
}

export default AccountSetup;
