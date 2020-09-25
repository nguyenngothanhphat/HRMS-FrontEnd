import React, {useState, useEffect} from 'react';
import { Link } from 'umi';
import { Layout, Row, Col, InputNumber, Button } from 'antd';

import gmail from '@/assets/gmail-icon.png';
import outlook from '@/assets/outlook-icon.png';

const { Header, Content } = Layout;

import img from '@/assets/sign-up-img.png';

import styles from './SignUpLayout1.less';

const SignUpLayout1 = (props) => {
  const { children } = props;

  const 

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
            <div className={styles.rightWrapper}>
              <h2>Check your mail for the code.</h2>

              <p className={styles.mail}>
                We have sent a 6-digit code to<Link to="/">siddhartha@lollypop.design.</Link>
              </p>

              <p className={styles.codeDescription}>Enter the security code</p>

              <div className={styles.code}>
                <InputNumber className={styles.input} min={1} max={9} />
                <InputNumber className={styles.input} min={1} max={9} />
                <InputNumber className={styles.input} min={1} max={9} />
                <InputNumber className={styles.input} min={1} max={9} />
                <InputNumber className={styles.input} min={1} max={9} />
                <InputNumber className={styles.input} min={1} max={9} />
              </div>

              <div className={styles.send}>
                <p>
                  Did not receive the code? <Link to="/">Send again</Link>{' '}
                </p>
              </div>

              <div className={styles.btnContainer}>
                <Button>
                  <div className={styles.btn}>
                    <img src={gmail} />
                    <span>open gmail</span>
                  </div>
                </Button>

                <Button>
                  <div className={styles.btn}>
                    <img src={outlook} />
                    <span>open outlook</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default SignUpLayout1;
