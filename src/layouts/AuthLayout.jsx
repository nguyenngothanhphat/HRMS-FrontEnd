import React from 'react';
import { Layout, Avatar, Row, Col } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { Redirect } from 'umi';
import { getToken } from '@/utils/token';
import styles from './AuthLayout.less';
import LoginImage from '../assets/Intranet_01.png';

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
            <span className={styles.textSignUp}>Sign up</span>
          </div>
        </Header>
        <Content className={styles.content}>
          <Row className={styles.rootLogin}>
            <Col lg={9} xl={10} className={styles.contentLeft}>
              <div className={styles.contentLeft__image}>
                <img src={LoginImage} alt="login" />
              </div>
              <p className={styles.contentLeft__text1}>
                Spending too much time on HR, not your business? <br />
                We can fix that.
              </p>
              <p className={styles.contentLeft__text2}>
                Streamline onboarding, benefits, payroll, PTO, and more with our simple, intuitive
                platform.
              </p>
            </Col>
            <Col xs={24} sm={24} md={24} lg={15} xl={14} className={styles.contentRight}>
              {children}
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}

export default AuthLayout;
