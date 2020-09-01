import React from 'react';
import { Layout, Avatar, Row, Col } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { Redirect } from 'umi';
import { getToken } from '@/utils/token';
import styles from './AuthLayout.less';

const { Header, Content } = Layout;

class AuthLayout extends React.PureComponent {
  render() {
    const token = getToken();
    if (token) {
      return <Redirect to="/" />;
    }
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
            <span className={styles.textSignUp}>SIGN UP</span>
          </div>
        </Header>
        <Content>
          <Row className={styles.rootLogin}>
            <Col md={7} lg={9} xl={10} className={styles.contentLeft}>
              <p className={styles.contentLeft__text1}>
                Spending too much time on HR, not your business? We can fix that.
              </p>
              <p className={styles.contentLeft__text2}>
                Streamline onboarding, benefits, payroll, PTO, and more with our simple, intuitive
                platform.
              </p>
            </Col>
            <Col xs={24} sm={24} md={17} lg={15} xl={14} className={styles.contentRight}>
              {children}
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}

export default AuthLayout;
