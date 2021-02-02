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
import { connect, Link, useIntl, Redirect } from 'umi';
import classnames from 'classnames';
import { get } from 'lodash';
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
    currentUser,
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

  console.log('routers', routes);

  const authorized = getAuthorityFromRouter(routes, location.pathname || '/') || {
    authority: undefined,
  };
  const { formatMessage } = useIntl();

  const { pathname } = window.location;
  const classNameBreadCrumb = pathname === '/dashboard' ? styles.breadCrumbA : styles.breadCrumbB;

  if (currentUser?.firstCreated) {
    return <Redirect to="/account-setup" />;
  }

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
        breadcrumbLayoutRender={(routers = []) => {
          let listPath = routers;
          listPath = [
            {
              path: '/',
              breadcrumbName: formatMessage, // return listPath;
            },
            ...listPath,
          ];
          if (listPath.length > 0) {
            const [firstPath] = listPath;
            const { breadcrumbName = '' } = firstPath;
            if (breadcrumbName === 'Dashboard')
              listPath = [
                {
                  path: '/',
                  breadcrumbName,
                },
              ];
          }
          return listPath;
        }}
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

export default connect(({ global, settings, user }) => ({
  collapsed: global.collapsed,
  settings,
  currentUser: user.currentUser,
}))(BasicLayout);
