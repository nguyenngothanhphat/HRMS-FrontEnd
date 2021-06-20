import img from '@/assets/sign-up-img.png';
import { Col, Layout, Row } from 'antd';
import React from 'react';
import { Link, formatMessage } from 'umi';
import Footer from '@/components/Footer';
import Avatar from 'antd/lib/avatar/avatar';

import { SmileOutlined } from '@ant-design/icons';
import styles from './SignUpLayout1.less';

const { Header, Content } = Layout;

const SignUpLayout1 = (props) => {
  const { children } = props;

  return (
    <Layout className={styles.rootSignUp}>
      <Header>
        <div className={styles.leftContent}>
          <Avatar size="large" icon={<SmileOutlined />} />
          <span className={styles.textAppName}>
            {formatMessage({ id: 'layout.authLayout.appName' })}
          </span>
        </div>
        <div className={styles.rightContent}>
          <span>Already have an account?</span>
          <Link to="/login" className={styles.textSignUp}>
            Sign in
          </Link>
        </div>
      </Header>

      <Content className={styles.content}>
        <Row className={styles.rootLogin}>
          <Col lg={9} xl={10} className={styles.contentLeft}>
            <div className={styles.contentLeft__image}>
              <img src={img} alt="login" />
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

      <Footer />
    </Layout>
  );
};

export default SignUpLayout1;
