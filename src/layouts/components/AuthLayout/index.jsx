import { SmileOutlined } from '@ant-design/icons';
import { Avatar, Col, Layout, Row } from 'antd';
import React from 'react';
import { formatMessage, Link } from 'umi';
import AppFooter from '@/components/AppFooter';
import LoginImage from '../../../assets/Intranet_01.png';
import Separator from '../../../assets/login/separator.svg';
import TerralogicImage from '../../../assets/login/terralogic.png';
import TerralogicLogo from '../../../assets/login/terralogic_logo.svg';
import { IS_TERRALOGIC_LOGIN } from '@/utils/login';
import styles from './index.less';

const { Header, Content } = Layout;

const AuthLayout = ({ children }) => {
  const footerItems = () => {
    return [
      {
        // label: 'Insights',
        items: [
          {
            name: 'About Us',
            link: 'https://www.terralogic.com/about-us/',
          },
          {
            name: 'Success Stories',
            link: 'https://www.terralogic.com/success-stories/',
          },
          {
            name: 'Blogs',
            link: 'https://www.terralogic.com/blogs/',
          },
          {
            name: 'Updates',
            link: 'https://www.terralogic.com/updates/',
          },
        ],
      },
      // {
      //   label: 'Information',
      //   items: [
      //     {
      //       name: 'About Us',
      //       link: 'https://www.terralogic.com/about-us/',
      //     },
      //     {
      //       name: 'Contact',
      //       link: 'https://www.terralogic.com/contact-us/',
      //     },
      //     {
      //       name: 'FAQ',
      //       link: '#',
      //     },
      //   ],
      // },
    ];
  };

  if (IS_TERRALOGIC_LOGIN) {
    return (
      <Layout className={styles.AuthLayout2}>
        <Content className={styles.container}>
          <Row gutter={[24, 24]} align="top" className={styles.content} justify="center">
            <Col xs={24} lg={12} xl={7}>
              <div className={styles.header}>
                <div className={styles.logo}>
                  <img src={TerralogicLogo} alt="" />
                </div>
                <p className={styles.bigText}>
                  Driving innovation
                  <br />
                  through <br />
                  new-age technology
                </p>
              </div>
            </Col>
            <Col xs={0} xl={9}>
              <div className={styles.image}>
                <img src={TerralogicImage} alt="" />
              </div>
            </Col>
            <Col xs={24} lg={12} xl={8}>
              <div className={styles.children}>{children}</div>
            </Col>
            <div className={styles.footerContainer}>
              {footerItems().map((x) => (
                <div className={styles.box}>
                  <p className={styles.label}>{x.label}</p>
                  <div className={styles.links}>
                    {x.items.map((y, index) => {
                      return (
                        <span className={styles.item}>
                          <a href={y.link}>{y.name}</a>
                          {index + 1 < x.items.length && (
                            <img src={Separator} alt="" className={styles.separator} />
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Row>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className={styles.AuthLayout1}>
      <Header>
        <div className={styles.leftContent}>
          <Avatar size="large" icon={<SmileOutlined />} />
          <span className={styles.textAppName}>
            {formatMessage({ id: 'layout.authLayout.appName' })}
          </span>
        </div>
        <div className={styles.rightContent}>
          <span>{formatMessage({ id: 'layout.authLayout.newUser' })}</span>
          <Link to="/sign-up" className={styles.textSignUp}>
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
      <AppFooter className={styles.footerLogin} />
    </Layout>
  );
};

export default AuthLayout;
