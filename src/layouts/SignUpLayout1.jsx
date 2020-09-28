import React, { useState, useEffect } from 'react';
import { Link } from 'umi';
import { Layout, Row, Col, InputNumber, Button } from 'antd';

import SignUp2 from '@/pages/SignUp2';

import gmail from '@/assets/gmail-icon.png';
import outlook from '@/assets/outlook-icon.png';
import img from '@/assets/sign-up-img.png';

import styles from './SignUpLayout1.less';

const { Header, Content } = Layout;

const SignUpLayout1 = (props) => {
  const { children } = props;

  return (
    <Layout className={styles.root}>
      <Header>
        <div className={styles.header}>
          <div className={styles.logo}>
            <span>Logo</span>
          </div>

          <div className={styles.ask}>
            <span>Already have an account?</span>
            <Link to="/signin">sign in</Link>
          </div>
        </div>
      </Header>
      <Content>
        <div className={styles.main}>
          <div className={styles.leftContent}>
            <div className={styles.leftWrapper}>
              <div className={styles.imgContainer}>
                <img src={img} alt="sign up" />
              </div>

              <div className={styles.description}>
                <h1>Spending too much time on HR, not your business? We can fix that.</h1>
                <p>
                  Streamline onboarding, benefits, payroll, PTO, and more with our simple, intuitive
                  platform.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.rightContent}>
            <SignUp2 />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default SignUpLayout1;
