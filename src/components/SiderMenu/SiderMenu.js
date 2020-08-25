import React, { PureComponent, Suspense } from 'react';
import { Layout, Menu } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './SiderMenu.less';
import PageLoading from '../PageLoading';
import { getDefaultCollapsedSubMenus } from './SiderMenuUtils';

const BaseMenu = React.lazy(() => import('./BaseMenu'));
// const BottomMenu = React.lazy(() => import('./BottomMenu'));
const { Sider } = Layout;
const VERSION_WEB = '1.3.0';

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname, openKeys } = state;
    if (openKeys.length === 0 || props.location.pathname !== pathname) {
      return {
        pathname: props.location.pathname,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  onMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
    }
  };

  handleLogout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/logout',
    });
  };

  render() {
    const { collapsed, flatMenuKeys, width } = this.props;
    const { openKeys } = this.state;
    const defaultProps = collapsed ? {} : { openKeys };
    // const baseLogo = collapsed ? logoSmall : logo;
    const theme = 'dark';
    return (
      <Sider
        trigger={null}
        collapsible
        collapsedWidth={0}
        width={width}
        theme={theme}
        className={styles.sider}
      >
        <div className={styles.content}>
          <div>
            <Suspense fallback={<PageLoading />}>
              <BaseMenu
                {...this.props}
                mode="inline"
                handleOpenChange={this.handleOpenChange}
                onOpenChange={this.handleOpenChange}
                className={styles.baseMenuStyle}
                flatMenuKeys={flatMenuKeys}
                theme={theme}
                // inlineCollapsed
                {...defaultProps}
              />
              <div className={styles.line} />
              {/* <BottomMenu
                {...this.props}
                mode="inline"
                handleOpenChange={this.handleOpenChange}
                onOpenChange={this.handleOpenChange}
                className={styles.baseMenuStyle}
                flatMenuKeys={flatMenuKeys}
                theme={theme}
                // inlineCollapsed
                {...defaultProps}
              /> */}
              <Menu
                selectedKeys={[]}
                onClick={this.onMenuClick}
                mode="inline"
                theme={theme}
                // inlineCollapsed
                className={styles.baseMenuStyle}
              >
                {/* <Menu.Item key="Notifications">
                  <span>
                    <img
                      src="/assets/new-imgs/notification.svg"
                      alt="icon"
                      className={styles.icon}
                    />
                    <span className={styles.txtMenu}>Notifications</span>
                  </span>
                </Menu.Item> */}
                {/* <Menu.Item key="logout">
                  <span>
                    <img src="/assets/new-imgs/logout.svg" alt="icon" className={styles.icon} />
                    <span className={styles.txtMenu}>
                      {formatMessage({ id: 'menu.account.logout' })}
                    </span>
                  </span>
                </Menu.Item> */}
              </Menu>
            </Suspense>
          </div>
          <div className={styles.viewVersion}>
            <span className={styles.version}>
              {formatMessage({ id: 'common.version' })} {VERSION_WEB}
            </span>
          </div>
        </div>
      </Sider>
    );
  }
}
