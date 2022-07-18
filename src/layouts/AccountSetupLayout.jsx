import { Affix, Button, Layout, Result } from 'antd';
import React, { PureComponent } from 'react';
import { Link } from 'umi';
import AppFooter from '@/components/AppFooter';
import Authorized from '@/utils/Authorized';
import { getAuthorityFromRouter } from '@/utils/utils';
import styles from './AccountSetupLayout.less';

const { Header, Content } = Layout;

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

class AccountSetup extends PureComponent {
  render() {
    const {
      children,
      location = {
        pathname: '/',
      },
      route: { routes } = {},
    } = this.props;
    const authorized = getAuthorityFromRouter(routes, location.pathname || '/') || {
      authority: undefined,
    };
    return (
      <Layout className={styles.root}>
        <Affix>
          <Header>
            <Link to="/control-panel" className={styles.logoText}>
              HRMS
            </Link>
          </Header>
        </Affix>
        <Authorized authority={authorized.authority} noMatch={noMatch}>
          <Content className={styles.content}>{children}</Content>
        </Authorized>
        <AppFooter />
      </Layout>
    );
  }
}
export default AccountSetup;
