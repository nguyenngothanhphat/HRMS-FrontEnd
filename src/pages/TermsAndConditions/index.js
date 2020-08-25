import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Row, Col } from 'antd';
import s from './index.less';

class Login extends PureComponent {
  render() {
    return (
      <Row className={s.containerView}>
        <Col span={24} className={s.titleView}>
          <FormattedMessage id="signin.policy" />
        </Col>
        <Col span={24} className={s.contentView}>
          <div>
            <p className={s.textContent}>
              By accessing or using our website located at https://expenso.paxanimi.ai in any way or
              downloading, installing or using our mobile or desktop applications (the “Apps”) that
              links to this Agreement (collectively, the “Services”) provided by Paxanimi
              Technologies Private Limited or any of its affiliates or associate companies or
              subsidiaries or clicking on a button or taking similar action to signify your
              affirmative acceptance of this Agreement, or completing the Expenso account
              registration process, you hereby represent that:
            </p>
            <p className={s.textContent}>
              (i) You have read, understood, and agree to be bound by this Agreement and any future
              amendments and additions to this Agreement as published from time to time on our
              Websites.
            </p>
            <p className={s.textContent}>
              (ii) You are 18 years of age and eligible to form a binding contract with Fyle.
            </p>
            <p className={s.textContent}>
              (iii) You have the authority to enter into the Agreement personally and, if
              applicable, on behalf of any company, organization, or other legal entity you have
              named as the user during the Fyle account registration process and to bind that
              company, organization, or entity to the Agreement.
            </p>
            <p className={s.textContent}>
              Services provided by Paxanimi shall be included but not limited to technology
              platforms such as App, Website, Plug-ins, the Fyle chrome extension or any other
              software supplied by Paxanimi to provide expense management solutions that automates
              all your expense tracking processes and workflows.
            </p>
            <p className={s.textContent}>
              The terms “you,” “user” and “users” refer to all individuals and other persons who
              access or use our services, including, without limitation, any companies,
              organizations, or other legal entities that register accounts or otherwise access or
              use the services through their respective employees, agents or representatives. Except
              as otherwise provided herein, IF YOU DO NOT AGREE TO BE BOUND BY THE AGREEMENT, YOU
              MAY NOT ACCESS OR USE THE WEBSITE, THE SERVICES, OR THE APPLICATIONS.
            </p>
          </div>
        </Col>
      </Row>
    );
  }
}

export default Login;
