import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import avtDefault from '@/assets/avtDefault.jpg';
import { Avatar, Button } from 'antd';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import ItemCompany from './components/ItemCompany';
import s from './index.less';

@connect(({ user: { currentUser = {}, currentUser: { manageTenant = [] } = {} } = {} }) => ({
  currentUser,
  manageTenant,
}))
class AccountSetup extends Component {
  componentDidMount() {
    const { dispatch, currentUser: { email = '' } = {} } = this.props;
    dispatch({
      type: 'user/fetchUserMapByEmail',
      payload: {
        email,
      },
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

  renderCompanies = () => {
    const { manageTenant = [] } = this.props;

    const companies = [];
    manageTenant.forEach((eachTenant) => {
      const { company = [], tenant = '' } = eachTenant;
      company.forEach((comp) => {
        companies.push({ company: comp, tenant });
      });
    });

    return companies.map((comp) => {
      const { company = {}, tenant = '' } = comp;
      return <ItemCompany company={company} tenantId={tenant} />;
    });
  };

  render() {
    const { currentUser: { generalInfo: { avatar = '' } = {}, email = '' } = {} } = this.props;
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
          {this.renderCompanies()}
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
