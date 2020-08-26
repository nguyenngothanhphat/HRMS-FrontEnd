import React, { PureComponent, Suspense } from 'react';
import { Layout } from 'antd';
import styles from './SiderMenu.less';
import PageLoading from '../PageLoading';
import { getDefaultCollapsedSubMenus } from './SiderMenuUtils';

const BaseMenu = React.lazy(() => import('./BaseMenu'));
const { Sider } = Layout;

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
            </Suspense>
          </div>
        </div>
      </Sider>
    );
  }
}
