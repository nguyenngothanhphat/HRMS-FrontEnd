import React, { PureComponent } from 'react';
import { Layout, Breadcrumb } from 'antd';
import RightContent from '@/components/GlobalHeader/RightContent';
import { Link } from 'umi';
import styles from './AccountSetupLayout.less';

const { Header, Content } = Layout;

class AccountSetup extends PureComponent {
  getBreadcrumbName = () => {
    const { location: { pathname = '' } = {}, route: { routes = [] } = {} } = this.props;
    const formatRoutes = routes.map((item) => {
      const { name = '', path = '' } = item;
      return { name, path };
    });
    const getLengthPatname = pathname.split('/').filter((item) => item).length;
    let size = getLengthPatname;
    if (getLengthPatname === 4) {
      size = 3;
    }
    return formatRoutes.slice(0, size).filter((item) => item.name !== 'Account Setup');
  };

  render() {
    const { children, location: { pathname = '' } = {} } = this.props;
    const routes = this.getBreadcrumbName() || [];
    return (
      <Layout className={styles.root}>
        <Header>
          <Link to="/">
            <img
              src="/assets/images/terralogic-logo.png"
              alt="logo"
              style={{ width: '150px', objectFit: 'contain', marginLeft: '20px' }}
            />
          </Link>
          <RightContent />
        </Header>
        <Content className={styles.content}>
          {routes.length !== 0 && (
            <Breadcrumb separator={false}>
              {routes.map((item) => {
                const { name = '', path = '' } = item;
                return (
                  <Breadcrumb.Item key={name}>
                    <Link to={name === 'Company Profile' ? pathname : path}>{name}</Link>
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
          )}

          {children}
        </Content>
      </Layout>
    );
  }
}
export default AccountSetup;
