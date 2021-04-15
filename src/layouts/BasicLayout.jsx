/* eslint-disable react/jsx-props-no-spreading */
/**
 * Ant Design Pro v4 use `@/layouts/layout/src` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import React, { useEffect, useState } from 'react';
import RightContent from '@/components/GlobalHeader/RightContent';
import Authorized from '@/utils/Authorized';
import { getAuthorityFromRouter } from '@/utils/utils';
import { Button, Result, Affix, Tooltip, Switch } from 'antd';
import { UserSwitchOutlined } from '@ant-design/icons';
import { connect, Link, useIntl, Redirect, useHistory } from 'umi';
import { getCurrentCompany, setAuthority } from '@/utils/authority';
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
    currentUser,
    companies = {},
  } = props;
  /**
   * init variables
   */

  const [isCheck, setIsCheck] = useState(false);
  const history = useHistory();

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
      <Link to="/">
        <img
          src={logoUrl || logo}
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
    );
  };

  useEffect(() => {
    let authority = JSON.parse(localStorage.getItem('antd-pro-authority'));
    authority = authority.filter(
      (item) => item === 'owner' || item === 'admin' || item === 'employee',
    );

    authority.forEach((item) => {
      if (item.includes('owner')) {
        setIsCheck(false);
      } else if (item === 'admin') {
        setIsCheck(false);
      } else {
        setIsCheck(true);
      }
    });
  }, [setIsCheck]);

  function buttonSwitch() {
    let checkAuth = false;
    const { signInRole = [] } = currentUser;

    const formatRole = signInRole.map((role) => role.toLowerCase());
    formatRole.map((item) => {
      if (item.includes('owner') || item.includes('admin') || item.includes('employee')) {
        checkAuth = true;
      }
      return checkAuth;
    });

    const handleSwitch = () => {
      let isOwner = false;
      let newAuthority = [];
      const authority = JSON.parse(localStorage.getItem('antd-pro-authority'));

      formatRole.map((item) => {
        if (item.includes('owner')) {
          isOwner = true;
        }
        return isOwner;
      });

      // if press Switch button is ON
      if (isCheck) {
        if (isOwner) {
          const arr = authority.filter((item) => item !== 'employee');
          newAuthority = ['owner', ...arr];
        } else {
          const arr = authority.filter((item) => item !== 'employee');
          newAuthority = ['admin', ...arr];
        }
      } else {
        // else: OFF
        const arr = authority.filter((item) => item !== 'owner' && item !== 'admin');
        newAuthority = ['employee', ...arr];
      }
      setAuthority(newAuthority);
      setIsCheck(!isCheck);
      newAuthority = [];

      history.push('/dashboard');
    };

    return (
      <>
        {checkAuth ? (
          <Affix className={styles.footerButton}>
            <Tooltip title={isCheck ? 'Switch Owner|Admin' : 'Switch Employee'}>
              <Switch
                checked={isCheck}
                checkedChildren={<UserSwitchOutlined />}
                onClick={handleSwitch}
              />
            </Tooltip>
          </Affix>
        ) : null}
      </>
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
        footerRender={buttonSwitch}
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
  companies: user.companiesOfUser,
}))(BasicLayout);
