/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { Link, useIntl, connect } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getAuthorityFromRouter } from '@/utils/utils';
import { MenuOutlined } from '@ant-design/icons';
import logo from '../assets/logo.svg';
import styles from './BasicLayout.less';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/login">Go Login</Link>
      </Button>
    }
  />
);

/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList) =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null);
  });

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    collapsed,
    route: { routes } = {},
  } = props;
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload: !payload,
      });
    }
  }; // get children authority
  const _renderTitleHeader = (
    <div className={styles.titleHeader}>
      <div onClick={() => handleMenuCollapse(collapsed)} className={styles.buttonToggle}>
        <MenuOutlined style={{ fontSize: '20px' }} />
      </div>
      <img
        className={styles.titleHeader__logo}
        src="https://pritythings.co.uk/uploads/logo/logo_5f2892008249a.png"
        alt="img-logo"
      />
    </div>
  );

  const authorized = getAuthorityFromRouter(routes, location.pathname || '/') || {
    authority: undefined,
  };
  const { formatMessage } = useIntl();

  const styleMenu = !collapsed ? styles.menuOpen : styles.menuOff;

  return (
    <div className={styleMenu}>
      <ProLayout
        logo={logo}
        formatMessage={formatMessage}
        onCollapse={handleMenuCollapse}
        headerTitleRender={() => <div style={{ display: 'none' }} />}
        headerContentRender={() => _renderTitleHeader}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || !menuItemProps.path) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
            }),
          },
          ...routers,
        ]}
        menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent />}
        // menuRender={() => <div style={{ marginTop: '50px' }}>aaxax</div>}
        collapsedButtonRender={false}
        {...props}
        {...settings}
      >
        <Authorized authority={authorized.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
    </div>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
