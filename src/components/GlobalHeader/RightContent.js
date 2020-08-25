import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Menu, Icon, Avatar } from 'antd';
// import { isUrl } from '@/utils/utils';
import router from 'umi/router';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
// import SelectLang from '../SelectLang';

// const getIcon = icon => {
//   if (typeof icon === 'string' && isUrl(icon)) {
//     return <img src={icon} alt="icon" />;
//   }

//   if (typeof icon === 'string') {
//     return <Icon type={icon} style={{ fontSize: '18px' }} />;
//   }
//   return icon;
// };

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
        {/* {rightMenuData.map(item => (
          <Menu.Item key={item.originalName}>
            <Link to={item.path}>
              {item.icon ? (
                <span>
                  {getIcon(item.icon)}
                  <span className={styles.txtMenu}>{item.name}</span>
                </span>
              ) : (
                item.name
              )}
            </Link>
          </Menu.Item>
        ))} */}
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
              size={48}
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
              {/* <div className={styles.titleEmployee}>{currentUser.title}</div> */}
            </div>
            <Icon style={{ color: '#3A354E', fontSize: '14px', marginLeft: '10px' }} type="down" />
          </span>
        </HeaderDropdown>
        {/* <SelectLang className={styles.action} /> */}
      </div>
    );
  }
}
