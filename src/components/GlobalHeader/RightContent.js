import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Menu, Icon, Avatar } from 'antd';
import router from 'umi/router';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {
  change = () => {
    router.push('/profile');
  };

  render() {
    const {
      currentUser = {},
      onMenuClick,
      theme,
      //  rightMenuData = []
    } = this.props;
    const { fullName } = currentUser;
    const rightMenu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item onClick={this.change} className={styles.profile}>
          <h3 className={styles.fullName}>{fullName}</h3>
          {currentUser.title ? <p className={styles.title}>{currentUser.title}</p> : null}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        <HeaderDropdown overlay={rightMenu}>
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar
              size={35}
              className={styles.avatar}
              style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
              src={currentUser.avatarUrl}
            >
              {fullName && fullName[0]}
            </Avatar>
            <div>
              <div className={styles.name}>{fullName}</div>
              {currentUser.title ? (
                <div className={styles.titleEmployee}>{currentUser.title}</div>
              ) : null}
            </div>
            <Icon style={{ color: '#fff', fontSize: '14px', marginLeft: '10px' }} type="down" />
          </span>
        </HeaderDropdown>
      </div>
    );
  }
}
