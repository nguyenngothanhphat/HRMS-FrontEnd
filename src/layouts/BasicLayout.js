import React, { Suspense } from 'react';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import { formatMessage } from 'umi-plugin-react/locale';
import PageLoading from '@/components/PageLoading';
import SiderMenu from '@/components/SiderMenu';
import logoSmall from '../assets/logo-small.png';
import Header from './Header';
import Context from './MenuContext';

import styles from './BasicLayout.less';

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    // dispatch({ type: 'currency/fetch' });
    // dispatch({ type: 'exchangeRate/fetchSupport' });
    // dispatch({ type: 'setting/fetch' });
    document.addEventListener('click', this.handleClick);
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });
    this.handleMenuCollapse(false);
    dispatch({ type: 'currency/fetch' });
  }

  componentWillUnmount() {
    // important
    document.removeEventListener('click', this.handleClick);
  }

  // componentDidUpdate(preProps) {
  //   // After changing to phone mode,
  //   // if collapsed is true, you need to click twice to display
  //   const { collapsed, isMobile } = this.props;
  //   if (isMobile && !preProps.isMobile && !collapsed) {
  //     this.handleMenuCollapse(false);
  //   }
  // }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  getRouterAuthority = (pathname, routeData) => {
    let routeAuthority = ['noAuthority'];
    const getAuthority = (key, routes) => {
      routes.map(route => {
        if (route.path && pathToRegexp(route.path).test(key)) {
          routeAuthority = route.authority;
        } else if (route.routes) {
          routeAuthority = getAuthority(key, route.routes);
        }
        return route;
      });
      return routeAuthority;
    };
    return getAuthority(pathname, routeData);
  };

  getPageTitle = (pathname, breadcrumbNameMap, title) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);

    if (!currRouterData) {
      return title;
    }
    const pageName = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });

    return `${pageName} - ${title}`;
  };

  handleClick = event => {
    const { target } = event;
    const { collapsed, onClickMenu } = this.props;
    this.handleMenuOnclick(false);
    if (!this.wrapperRef.current.contains(target) && collapsed && !onClickMenu) {
      this.handleMenuCollapse(false);
    }
  };

  handleMenuOnclick = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/save',
      payload: { onClickMenu: value },
    });
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  render() {
    const {
      children,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      fetching,
      companyName,
    } = this.props;

    const logo = '/assets/new-imgs/new-logo.png';
    const layout = (
      <Layout>
        <Header
          menuData={menuData}
          handleMenuCollapse={this.handleMenuCollapse}
          logo={logo}
          logoSmall={logoSmall}
          title={formatMessage({ id: 'common.reimbursable' })}
          isMobile={isMobile}
          {...this.props}
        />
        <Layout
          style={{
            minHeight: '100vh',
            position: 'relative',
          }}
        >
          <div
            ref={this.wrapperRef}
            style={{ minHeight: '100vh', position: 'relative', display: 'flex' }}
          >
            <SiderMenu
              logo={logo}
              logoSmall={logoSmall}
              wrapperRef={this.wrapperRef}
              onCollapse={this.handleMenuCollapse}
              menuData={menuData}
              isMobile={isMobile}
              handleMenuOnclick={this.handleMenuOnclick}
              {...this.props}
            />
          </div>
          <Content className={styles.content}>
            <div className={styles.contentChildren}>{children}</div>
          </Content>
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        {!fetching && (
          <div>
            <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap, companyName)}>
              <ContainerQuery query={query}>
                {params => (
                  <Context.Provider value={this.getContext()}>
                    <div className={classNames(params)}>{layout}</div>
                  </Context.Provider>
                )}
              </ContainerQuery>
            </DocumentTitle>
            <Suspense fallback={<PageLoading style={{ minHeight: '100vh' }} />} />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default connect(
  ({
    global: { collapsed, onClickMenu = false },
    menu,
    user: { currentUser: { company: { name: companyName = '' } = {} } = {} },
  }) => ({
    collapsed,
    companyName,
    onClickMenu,
    ...menu,
  })
)(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
