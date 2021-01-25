import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Menu, Spin } from 'antd';
import React from 'react';
import { connect, formatMessage, history } from 'umi';
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
    const { currentUser } = this.props;
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
      history.push(`/employees/employee-profile/${currentUser.employee._id}`);

      return;
    }

    if (key === CHANGEPASSWORD) {
      history.push('/change-password');

      return;
    }

    if (key === SETTINGS) {
      // eslint-disable-next-line no-alert
      alert('Settings');

      return;
    }

    history.push(`/account/${key}`);
  };

  render() {
    const { currentUser = {} } = this.props;
    const {
      name = '',
      generalInfo: { avatar = '', employeeId = '' } = {},
      title = {},
    } = currentUser;
    const { LOGOUT, VIEWPROFILE, CHANGEPASSWORD, SETTINGS } = this.state;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <div className={styles.viewProfile}>
          <div className={styles.viewProfileAvatar}>
            <Avatar size={50} className={styles.avatar} icon={<UserOutlined />} src={avatar} />
          </div>
          <div className={styles.viewProfileInfo}>
            <p>{name}</p>
            {employeeId && (
              <p>
                {title.name} - {employeeId}
              </p>
            )}
          </div>
        </div>
        <Menu.Item key={VIEWPROFILE} className={styles.menuItemViewProfile}>
          <Button className={styles.buttonLink}>
            {formatMessage({ id: 'component.globalHeader.avatarDropdown.view-profile' })}
          </Button>
        </Menu.Item>
        <Menu.Divider className={styles.firstDivider} />
        <Menu.Item key={CHANGEPASSWORD} className={styles.menuItemLink}>
          {formatMessage({ id: 'component.globalHeader.avatarDropdown.change-password' })}
        </Menu.Item>
        <Menu.Item key={SETTINGS} className={styles.menuItemLink}>
          {formatMessage({ id: 'component.globalHeader.avatarDropdown.settings' })}
        </Menu.Item>
        <Menu.Divider className={styles.secondDivider} />
        <Menu.ItemGroup className={styles.groupMenuItem}>
          <Menu.Item key={LOGOUT} className={styles.menuItemLogout}>
            {formatMessage({ id: 'component.globalHeader.avatarDropdown.logout' })}
          </Menu.Item>
          <Menu.Item className={styles.sessionLogin}>
            {formatMessage({ id: 'component.globalHeader.avatarDropdown.session-login' })}: 11:30
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    );
    return currentUser && name ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size={44} icon={<UserOutlined />} className={styles.avatar} src={avatar} />
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
