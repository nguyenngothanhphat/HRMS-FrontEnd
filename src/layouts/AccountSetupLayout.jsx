import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import RightContent from '@/components/GlobalHeader/RightContent';
import { Link } from 'umi';
import styles from './AccountSetupLayout.less';

const { Header, Content } = Layout;

class AccountSetup extends PureComponent {
  render() {
    const { children } = this.props;
    console.log('props', this.props);
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
          {/* <Breadcrumb separator="|">
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="">Application Center</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="">Application List</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>An Application</Breadcrumb.Item>
          </Breadcrumb> */}
          {children}
        </Content>
      </Layout>
    );
  }
}
export default AccountSetup;
