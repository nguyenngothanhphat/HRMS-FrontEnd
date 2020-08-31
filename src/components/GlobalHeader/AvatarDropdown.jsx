import { LogoutOutlined, SettingOutlined, UserOutlined, UpOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import { history, connect } from 'umi';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  onMenuClick = (event) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    if (key === 'viewProfile') {
      const { dispatch } = this.props;
      alert('View Profile');

      return;
    }

    if (key === 'changePassword') {
      const { dispatch } = this.props;
      alert('Change Password');

      return;
    }

    if (key === 'settings') {
      const { dispatch } = this.props;
      alert('Settings');

      return;
    }


    history.push(`/account/${key}`);
  };

  render() {
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
      menu = false,
    } = this.props;
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
            {currentUser.avatar ? (
              <Avatar
                size="medium"
                className={styles.avatar}
                src={currentUser.avatar}
                alt="avatar"
              />
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
            <span>{currentUser.name}</span>
            <br />
            <span>Senior HR</span>
            <br />
            <span>PIS-2400</span>
          </div>
        </div>
        <UpOutlined className={styles.menuItemIcon} />
        <Menu.Item key="viewProfile" className={`${styles.menuItemLink} ${styles.menuItemViewProfile}`}>
          {/* {formatMessage({ id: 'component.globalHeader.avatarDropdown.view-profile' })} */}
          View Profile
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="changePassword" className={styles.menuItemLink}>
          Change password
        </Menu.Item>
        <Menu.Item key="settings" className={styles.menuItemLink}>
          Settings
        </Menu.Item>
        <Menu.Divider />
        <Menu.ItemGroup>
          <span className={styles.sessionLogin}>Session login: 11:30</span>
          <Menu.Item key="logout" className={styles.menuItemLogout}>
            Logout
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    );
    return currentUser && currentUser.name ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
          <span className={`${styles.name} anticon`}>{currentUser.name}</span>
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
