import React from 'react';
import windowSize from 'react-window-size';
import { Row, Col, Layout } from 'antd';
import s from './SignupLayout.less';

const { Content, Footer } = Layout;
const VERSION_WEB = '1.3.0';

class SignupLayout extends React.PureComponent {
  render() {
    const { windowWidth } = this.props;
    const { children } = this.props;
    const isMobile = windowWidth < 575;
    const isleft = windowWidth < 276;
    return (
      <Layout className={s.container}>
        <Content>
          <Row>
            {!isMobile && (
              <Col sm={12} className={s.loginLeft}>
                <div span={24} className={s.logo}>
                  <img className={s.image} src="/assets/img/new-logo.png" alt="logo" />
                  <span className={s.title}>Expenso</span>
                </div>
                <div className={s.logindata}>
                  <img
                    src="/assets/img/ExpensoImage.svg"
                    alt="Background"
                    className={s.backgroundImage}
                  />
                </div>
              </Col>
            )}
            <Col sm={12} className={!isleft ? s.loginRight : s.LoginChange}>
              <div>{children}</div>
            </Col>
          </Row>
        </Content>
        <Footer className={s.footer}>
          <Row type="flex" justify="space-between">
            <Col className={s.ml150}>© 2019 Paxanimi Inc</Col>
            <Col className={s.mr150}>Version {VERSION_WEB}</Col>
          </Row>
        </Footer>
      </Layout>
    );
  }
}

export default windowSize(SignupLayout);
