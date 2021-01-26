/* eslint-disable react/jsx-props-no-spreading */
/**
 * Ant Design Pro v4 use `@/layouts/layout/src` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import React from 'react';
import RightContent from '@/components/GlobalHeader/RightContent';
import Authorized from '@/utils/Authorized';
import { getAuthorityFromRouter } from '@/utils/utils';
import { Button, Result } from 'antd';
import { connect, Link, useIntl } from 'umi';
import classnames from 'classnames';
import logo from '../assets/logo.svg';
import styles from './BasicLayout.less';
import ProLayout from './layout/src';

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
    route: { routes } = {},
  } = props;
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
  };

  const _renderLogo = (
    <Link to="/">
      <img
        src="/assets/images/terralogic-logo.png"
        alt="logo"
        style={{ width: '120px', objectFit: 'contain', marginBottom: '4px' }}
      />
    </Link>
  );

  const authorized = getAuthorityFromRouter(routes, location.pathname || '/') || {
    authority: undefined,
  };
  const { formatMessage } = useIntl();

  const { pathname } = window.location;
  const classNameBreadCrumb =
    pathname === '/dashboard' || pathname === '/search-result'
      ? styles.breadCrumbA
      : styles.breadCrumbB;

  return (
    <div
      className={classnames(styles.root, classNameBreadCrumb, {
        [styles.hiddenBreadCrumb]: pathname === '/dashboard',
      })}
    >
      <ProLayout
        logo={logo}
        headerHeight={76}
        formatMessage={formatMessage}
        onCollapse={handleMenuCollapse}
        headerTitleRender={() => <div style={{ display: 'none' }} />}
        headerContentRender={() => _renderLogo}
        menuHeaderRender={false}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || !menuItemProps.path) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        // breadcrumbRender={(routers = []) => {
        //   console.log(routers);
        //   let listPath = [
        //     {
        //       path: '/',
        //       breadcrumbName: formatMessage({
        //         id: 'menu.home',
        //       }),
        //     },
        //     ...routers,
        //   ];
        //   if (routers.length > 0) {
        //     const [firstPath] = routers;
        //     const { breadcrumbName = '' } = firstPath;
        //     if (breadcrumbName === 'Dashboard' || breadcrumbName === 'Search Result')
        //       listPath = [
        //         {
        //           path: '/',
        //           breadcrumbName,
        //         },
        //       ];
        //   }
        //   return listPath;
        // }}
        menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent />}
        collapsedButtonRender={false}
        disableMobile
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
