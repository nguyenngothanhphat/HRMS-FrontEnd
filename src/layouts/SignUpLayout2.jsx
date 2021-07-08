import React from 'react';
import { Row, Col, Layout } from 'antd';
import RightImage from '../../public/assets/images/Intranet_01@3x.png';
import styles from './SignUpLayout2.less';

const { Header, Content } = Layout;

const SignUpLayout2 = (props) => {
  const { children } = props;
  return (
    <div>
      <Layout className={styles.SignUpLayout2}>
        <Header className={styles.header}>
          <div className={styles.logo}>
            <span>HRMS</span>
          </div>
        </Header>
        <Content className={styles.content}>
          <Row>
            <Col className={styles.leftContent} xs={24} lg={12}>
              {children}
            </Col>
            <Col xs={0} lg={12}>
              <div className={styles.rightImage}>
                <img src={RightImage} alt="right-img" />
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  );
};

export default SignUpLayout2;
