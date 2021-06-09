/* eslint-disable react/jsx-props-no-spreading */
/**
 * Ant Design Pro v4 use `@/layouts/layout/src` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import RightContent from '@/components/GlobalHeader/RightContent';
// import { getCurrentCompany, getSwitchRoleAbility } from '@/utils/authority';
import { getCurrentCompany } from '@/utils/authority';
import Authorized from '@/utils/Authorized';
import { getAuthorityFromRouter } from '@/utils/utils';
// import { UserOutlined, UserSwitchOutlined } from '@ant-design/icons';
// import { Affix, Button, notification, Result, Spin, Switch, Tooltip } from 'antd';
import { Button, Result } from 'antd';
import classnames from 'classnames';
// import React, { useEffect, useState } from 'react';
import React from 'react';
import { connect, Link, Redirect, useIntl } from 'umi';
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
    companies = {},
    logoCompany,
  } = props;

  /**
   * init variables
   */

  const getCurrentLogo = () => {
    const currentCompanyId = getCurrentCompany();
    const currentComp = companies.find((cp) => cp._id === currentCompanyId);
    return currentComp?.logoUrl;
  };

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload: !payload,
      });
    }
  };

  const _renderLogo = () => {
    // const checkRole = (roleName) => {
    //   const { signInRole = [] } = currentUser;
    //   const formatRole = signInRole.map((role) => role.toLowerCase());
    //   if (formatRole.includes(roleName)) return true;
    //   return false;
    // };

    // const isOwner = checkRole('owner');
    // const isAdmin = checkRole('admin');

    const logoUrl = getCurrentLogo();
    return (
      <>
        {logoUrl || logoCompany ? (
          <Link to="/">
            <img
              src={logoCompany || logoUrl || logo}
              alt="logo"
              style={{
                objectFit: 'contain',
                marginBottom: '4px',
                height: '100%',
                padding: '12px 0',
                // marginLeft: '-9px',
              }}
            />
          </Link>
        ) : null}
      </>
    );
  };

  const renderFooter = () => {
    return (
      <div className={styles.footerFlex}>
        <div>© 2019 Paxanimi Inc</div>
        <div>Version 1.3.0</div>
      </div>
    );
  };

  function rightContent() {
    // const { pathname } = window.location;
    return (
      <div className={styles.rightContent}>
        <RightContent />
        {/* {pathname === '/dashboard' ? null : buttonSwitch()} */}
      </div>
    );
  }

  const authorized = getAuthorityFromRouter(routes, location.pathname || '/') || {
    authority: undefined,
  };
  const { formatMessage } = useIntl();

  const { pathname } = window.location;
  const classNameBreadCrumb = pathname === '/dashboard' ? styles.breadCrumbA : styles.breadCrumbB;

  if (currentUser?.firstCreated) {
    return <Redirect to="/control-panel" />;
  }

  return (
    <>
      <div
        className={classnames(styles.root, classNameBreadCrumb, {
          [styles.hiddenBreadCrumb]: pathname === '/dashboard',
        })}
      >
        <ProLayout
          logo={getCurrentLogo() || logo}
          headerHeight={76}
          formatMessage={formatMessage}
          onCollapse={handleMenuCollapse}
          headerTitleRender={() => <div style={{ display: 'none' }} />}
          headerContentRender={() => _renderLogo()}
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
                breadcrumbName: formatMessage({
                  id: 'menu.home',
                }),
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
          // footerRender={pathname === '/dashboard' ? null : buttonSwitch}
          menuDataRender={menuDataRender}
          rightContentRender={rightContent}
          collapsedButtonRender={false}
          disableMobile
          {...props}
          {...settings}
          footerRender={() => renderFooter()}
        >
          <Authorized authority={authorized.authority} noMatch={noMatch}>
            {children}
          </Authorized>
        </ProLayout>
        {/* <Footer className={styles.footerLogin}>
          <div className={styles.footerFlex}>
            <div>© 2019 Paxanimi Inc</div>
            <div>Version 1.3.0</div>
          </div>
        </Footer> */}
      </div>
    </>
  );
};

export default connect(
  ({ global, settings, user, companiesManagement: { logoCompany = '' } = {} }) => ({
    collapsed: global.collapsed,
    settings,
    currentUser: user.currentUser,
    companies: user.companiesOfUser,
    logoCompany,
  }),
)(BasicLayout);
