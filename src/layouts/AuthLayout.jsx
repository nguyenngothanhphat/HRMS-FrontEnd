import React from 'react';
import { Layout } from 'antd';
import styles from './AuthLayout.less';

const { Header, Content } = Layout;

class AuthLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <Layout className={styles.root}>
        <Header>
          <div>
            <span>Logo</span>
            <span className={styles.textAppName}>Appname</span>
          </div>
          <div>
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
