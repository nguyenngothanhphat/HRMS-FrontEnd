import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import avtDefault from '@/assets/avtDefault.jpg';
import { Avatar, Button } from 'antd';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import ItemCompany from './components/ItemCompany';
import s from './index.less';

@connect(({ user: { currentUser = {}, companiesOfUser = [] } = {} }) => ({
  currentUser,
  companiesOfUser,
}))
class AccountSetup extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCompanyOfUser',
    });
  }

  handleLogout = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'login/logout',
      });
    }
  };

  renderCompanies = (isOwner, isAdmin) => {
    const { companiesOfUser = [] } = this.props;

    return companiesOfUser.map((comp) => {
      return <ItemCompany company={comp} isOwner={isOwner} isAdmin={isAdmin} />;
    });
  };

  checkRole = (roleName) => {
    const { currentUser: { signInRole = [] } = {} } = this.props;
    const formatRole = signInRole.map((role) => role.toLowerCase());
    if (formatRole.includes(roleName)) return true;
    return false;
  };

  render() {
    const { currentUser: { avatar = '', email = '' } = {} } = this.props;
    const isOwner = this.checkRole('owner');
    const isAdmin = this.checkRole('admin');

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
              {(isOwner || isAdmin) && (
                <p style={{ marginTop: '8px' }}>You have administrative privileges.</p>
              )}
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

          {/* RENDER COMPANIES */}
          {this.renderCompanies(isOwner, isAdmin)}

          {(isOwner || isAdmin) && (
            <Button
              className={s.btnAddNew}
              onClick={() => history.push('/account-setup/add-company')}
            >
              Add new company
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default AccountSetup;
