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
import { Button, Result, Affix, Tooltip, Switch, notification } from 'antd';
import { UserSwitchOutlined, UserOutlined } from '@ant-design/icons';
import { connect, Link, useIntl, Redirect, useHistory } from 'umi';
import { getCurrentCompany, setAuthority } from '@/utils/authority';
import classnames from 'classnames';
import { checkPermissions } from '@/utils/permissions';
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
  const [loading, setLoading] = useState(false);
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
    setLoading(false);
  }, [setIsCheck, setLoading]);

  function buttonSwitch() {
    let checkAdmin = false;
    const { signInRole = [], permissionEmployee = [], permissionAdmin = [] } = currentUser;

    const formatRole = signInRole.map((role) => role.toLowerCase());
    formatRole.map((item) => {
      if (item.includes('admin')) {
        checkAdmin = true;
      }
      return checkAdmin;
    });

    const handleSwitch = async () => {
      let isSwitch = false;
      let newAuthority = [];

      // if press Switch button is ON
      if (isCheck) {
        newAuthority = [...permissionAdmin];
        if (checkAdmin) {
          newAuthority = ['admin', ...newAuthority];
          notification.success({ message: 'Switch to Admin successfully' });
          isSwitch = false;
        }
      } else {
        // else: OFF
        const newPermissionEmployee =
          permissionEmployee.length > 0 ? [...permissionEmployee] : [...permissionAdmin];
        newAuthority = ['employee', ...newPermissionEmployee];
        notification.success({ message: 'Switch to Employee successfully' });
        isSwitch = true;
      }
      setAuthority(newAuthority);
      setIsCheck(!isCheck);
      setLoading(true);

      await dispatch({
        type: 'user/fetchCurrent',
        isSwitchingRole: isSwitch,
      });

      await dispatch({
        type: 'user/save',
        payload: {
          permissions: {
            ...checkPermissions(newAuthority, isCheck),
          },
        },
      });

      // history.push('/dashboard');
      window.location.reload();
    };

    return (
      <>
        {checkAdmin ? (
          <Affix className={styles.btnSwitch}>
            <Tooltip title={isCheck ? 'Switch Owner|Admin' : 'Switch Employee'}>
              <Switch
                checked={isCheck}
                checkedChildren={<UserSwitchOutlined />}
                unCheckedChildren={<UserOutlined />}
                onClick={handleSwitch}
                loading={loading}
              />
            </Tooltip>
          </Affix>
        ) : null}
      </>
    );
  }

  function rightContent() {
    const { pathname } = window.location;
    return (
      <div className={styles.rightContent}>
        <RightContent />
        {pathname === '/dashboard' ? null : buttonSwitch()}
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
