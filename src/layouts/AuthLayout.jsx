import React from 'react';
import { Layout, Avatar } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import styles from './AuthLayout.less';

const { Header, Content } = Layout;

class AuthLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <Layout className={styles.root}>
        <Header>
          <div className={styles.leftContent}>
            <Avatar size="large" icon={<SmileOutlined />} />
            <span className={styles.textAppName}>Appname</span>
          </div>
          <div className={styles.rightContent}>
            <span>New User?</span>
            <span className={styles.textSignUp} onClick={() => alert('Sign Up')}>
              SIGN UP
            </span>
          </div>
        </Header>
        <Content>{children}</Content>
      </Layout>
    );
  }
}

export default AuthLayout;
