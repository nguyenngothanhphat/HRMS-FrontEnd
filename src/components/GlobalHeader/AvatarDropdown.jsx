import { SettingOutlined, UserOutlined, UpOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import { history, connect, formatMessage } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LOGOUT: 'logout',
      VIEWPROFILE: 'viewProfile',
      CHANGEPASSWORD: 'changePassword',
      SETTINGS: 'settings',
    };
  }

  onMenuClick = (event) => {
    const { key } = event;
    const { LOGOUT, VIEWPROFILE, CHANGEPASSWORD, SETTINGS } = this.state;
    if (key === LOGOUT) {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    if (key === VIEWPROFILE) {
      alert('View Profile');

      return;
    }

    if (key === CHANGEPASSWORD) {
      const { currentUser = {} } = this.props;
      console.log('currentUser', currentUser);
      history.push('/change-password');

      return;
    }

    if (key === SETTINGS) {
      alert('Settings');

      return;
    }

    history.push(`/account/${key}`);
  };

  render() {
    const { currentUser = {}, menu = false } = this.props;
    const {
      name = '',
      generalInfo: { avatar = '' } = {},
      compensation: { tittle: { name: title = '' } = {} } = {},
    } = currentUser;
    const { LOGOUT, VIEWPROFILE, CHANGEPASSWORD, SETTINGS } = this.state;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <div className={styles.viewProfile}>
          <div className={styles.viewProfileAvatar}>
            {avatar ? (
              <Avatar size="medium" className={styles.avatar} src={avatar} alt="avatar" />
            ) : (
              <Avatar
                size="medium"
                className={styles.avatar}
                icon={<UserOutlined />}
                alt="default-avatar"
              />
            )}
          </div>
          <div className={styles.viewProfileInfo}>
            <span>{name}</span>
            <br />
            <span>{title}</span>
            <br />
            <span>PIS-2400</span>
          </div>
        </div>
        <UpOutlined className={styles.menuItemIcon} />
        <Menu.Item
          key={VIEWPROFILE}
          className={`${styles.menuItemLink} ${styles.menuItemViewProfile}`}
        >
          {formatMessage({ id: 'component.globalHeader.avatarDropdown.view-profile' })}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key={CHANGEPASSWORD} className={styles.menuItemLink}>
          {formatMessage({ id: 'component.globalHeader.avatarDropdown.change-password' })}
        </Menu.Item>
        <Menu.Item key={SETTINGS} className={styles.menuItemLink}>
          {formatMessage({ id: 'component.globalHeader.avatarDropdown.settings' })}
        </Menu.Item>
        <Menu.Divider />
        <Menu.ItemGroup>
          <span className={styles.sessionLogin}>
            {formatMessage({ id: 'component.globalHeader.avatarDropdown.session-login' })}: 11:30
          </span>
          <Menu.Item key={LOGOUT} className={styles.menuItemLogout}>
            {formatMessage({ id: 'component.globalHeader.avatarDropdown.logout' })}
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    );
    return currentUser && name ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size={44} className={styles.avatar} src={avatar} alt="avatar" />
          <span className={`${styles.name} anticon`} style={{ color: '#707177' }}>
            {name}
          </span>
        </span>
      </HeaderDropdown>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
