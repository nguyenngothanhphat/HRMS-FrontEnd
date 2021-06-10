import React, { useEffect } from 'react';
import { Layout, Avatar, Row, Col } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { formatMessage, useSelector, useHistory, Link } from 'umi';
import Footer from '@/components/Footer';
import styles from './AuthLayout.less';
import LoginImage from '../assets/Intranet_01.png';

const { Header, Content } = Layout;

const AuthLayout = ({ children }) => {
  const currentUser = useSelector(({ user }) => user.currentUser);
  const history = useHistory();
  useEffect(() => {
    if (currentUser?._id) history.push('/dashboard');
  }, [currentUser]);

  return (
    <Layout className={styles.root}>
      <Header>
        <div className={styles.leftContent}>
          <Avatar size="large" icon={<SmileOutlined />} />
          <span className={styles.textAppName}>
            {formatMessage({ id: 'layout.authLayout.appName' })}
          </span>
        </div>
        <div className={styles.rightContent}>
          <span>{formatMessage({ id: 'layout.authLayout.newUser' })}</span>
          <Link to="/signup" className={styles.textSignUp}>
            {formatMessage({ id: 'layout.authLayout.signUp' })}
          </Link>
        </div>
      </Header>
      <Content className={styles.content}>
        <Row className={styles.rootLogin}>
          <Col lg={9} xl={10} className={styles.contentLeft}>
            <div className={styles.contentLeft__image}>
              <img src={LoginImage} alt="login" />
            </div>
            <p className={styles.contentLeft__text1}>
              {formatMessage({ id: 'layout.authLayout.contentLeft.text1.1' })} <br />
              {formatMessage({ id: 'layout.authLayout.contentLeft.text1.2' })}
            </p>
            <p className={styles.contentLeft__text2}>
              {formatMessage({ id: 'layout.authLayout.contentLeft.text2' })}
            </p>
          </Col>
          <Col xs={24} sm={24} md={24} lg={15} xl={14} className={styles.contentRight}>
            {children}
          </Col>
        </Row>
      </Content>
      <Footer className={styles.footerLogin}>
        <div className={styles.footerFlex}>
          <div>© 2021 Paxanimi Inc</div>
          <div>Version 1.3.0</div>
        </div>
      </Footer>
    </Layout>
  );
};

export default AuthLayout;
