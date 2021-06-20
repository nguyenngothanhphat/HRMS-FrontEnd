import React, { PureComponent } from 'react';
import { Layout, Button, Result, Affix } from 'antd';
// import RightContent from '@/components/GlobalHeader/RightContent';
import Authorized from '@/utils/Authorized';
import { getAuthorityFromRouter } from '@/utils/utils';
import { Link } from 'umi';
import Footer from '@/components/Footer';
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
            {/* <img
            src="/assets/images/terralogic-logo.png"
            alt="logo"
            style={{ width: '150px', objectFit: 'contain', marginLeft: '20px' }}
          /> */}
            <Link to="/control-panel" className={styles.logoText}>
              HRMS
            </Link>
            {/* <RightContent /> */}
          </Header>
        </Affix>
        <Authorized authority={authorized.authority} noMatch={noMatch}>
          <Content className={styles.content}>{children}</Content>
        </Authorized>
        <Footer />
      </Layout>
    );
  }
}
export default AccountSetup;
