/* eslint-disable react/jsx-props-no-spreading */
/**
 * Ant Design Pro v4 use `@/layouts/layout/src` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import { Button, Result } from 'antd';
import classnames from 'classnames';
import React from 'react';
import { connect, Link, Redirect, useIntl } from 'umi';
import AppFooter from '@/components/AppFooter';
import Feedback from '@/components/Feedback';
import RightContent from '@/components/GlobalHeader/components/RightContent';
import { getCurrentCompany } from '@/utils/authority';
import Authorized from '@/utils/Authorized';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../../../assets/logo.svg';
import ProLayout from '../../layout/src';
import styles from './index.less';

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

const HR_MANAGER = 'HR-MANAGER';
const HR_EMPLOYEE = 'HR';
const MANAGER = 'MANAGER';

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

  // const [openMenu, setOpenMenu] = useState(false);

  /**
   * init variables
   */

  const getCurrentLogo = () => {
    const currentCompanyId = getCurrentCompany();
    const currentComp = companies.find((cp) => cp._id === currentCompanyId);
    return currentComp?.logoUrl;
  };

  const getCurrentName = () => {
    const currentCompanyId = getCurrentCompany();
    const currentComp = companies.find((cp) => cp._id === currentCompanyId);
    return currentComp?.name;
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
    const logoUrl = getCurrentLogo();
    const currentName = getCurrentName();
    return (
      <div className={styles.rootLogo}>
        <div className={styles.logoSection}>
          {/* <Button className={styles.logoSection__button}>
           <img alt="icon-menu" src={iconMenu} />
        </Button> */}
          {logoUrl || logoCompany ? (
            <Link to="/">
              <img
                src={logoCompany || logoUrl || logo}
                alt="logo"
                onError={(e) => {
                  e.target.src = logo;
                }}
              />
            </Link>
          ) : null}
        </div>
        <Link to="/">
          <div className={styles.currentName}>{currentName}</div>
        </Link>
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

  const handleClickMenu = (path) => {
    const { roles = [] } = currentUser;
    const checkRoleHrAndManager =
      roles.includes(HR_MANAGER) || roles.includes(HR_EMPLOYEE) || roles.includes(MANAGER);

    if (path === '/offboarding' && checkRoleHrAndManager) {
      localStorage.setItem('initViewOffboarding', false);
    }
  };

  return (
    <>
      <div
        className={classnames(`${styles.root}`, classNameBreadCrumb, {
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

            return (
              <Link onClick={() => handleClickMenu(menuItemProps.path)} to={menuItemProps.path}>
                {defaultDom}
              </Link>
            );
          }}
          breadcrumbLayoutRender={(routers = []) => {
            let listPath = routers;
            const home = formatMessage({
              id: 'menu.home',
            });

            if (!listPath.some((x) => x.breadcrumbName === home)) {
              listPath = [
                {
                  path: '/',
                  breadcrumbName: home,
                },
                ...listPath,
              ];
            }
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
          // eslint-disable-next-line react/jsx-no-bind
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
      <Feedback />
      <AppFooter />
    </>
  );
};

export default connect(({ settings, user, companiesManagement: { logoCompany = '' } = {} }) => ({
  // collapsed: global.collapsed,
  settings,
  currentUser: user.currentUser,
  companies: user.companiesOfUser,
  logoCompany,
}))(BasicLayout);
