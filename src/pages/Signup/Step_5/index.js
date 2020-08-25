import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import { Row, Col, Icon } from 'antd';
import SignUpBtn from '../components/Button';
import styles from './index.less';

class Step05 extends React.Component {
  onDone = () => {
    router.push('/login');
  };

  renderDetail = (item, index) => {
    return (
      <div key={index} className={styles.signup_step_5_detail}>
        <ul>
          <li>
            <Icon type="check" />
          </li>
          <li>
            <p className={styles.signup_step_5_text}>{item}</p>
          </li>
        </ul>
      </div>
    );
  };

  render() {
    const { email = '' } = this.props;

    const content = [
      `${formatMessage({ id: 'signup.step_05.content.detail_1' })}`,
      `${formatMessage({ id: 'signup.step_05.content.detail_2' })}`,
      `${formatMessage({ id: 'signup.step_05.content.detail_3' })}`,
      `${formatMessage({ id: 'signup.step_05.content.detail_4' })}`,
      `${formatMessage({ id: 'signup.step_05.content.detail_5' })}`,
      `${formatMessage({ id: 'signup.step_05.content.detail_6' })}`,
    ];

    return (
      <Row style={{ maxWidth: '500px' }} className={styles.signup_step_5_component}>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <div className={styles.signup_step_5_header}>
                <h1>{formatMessage({ id: 'signup.step_05.title' })}</h1>
                <p>{formatMessage({ id: 'signup.step_05.description' })}</p>
              </div>
            </Col>
            <Col span={24}>
              <div className={styles.signup_step_5_text} style={{ marginBottom: '7px' }}>
                {formatMessage({ id: 'signup.step_05.content.title' })}
              </div>
              <div>{content.map((item, index) => this.renderDetail(item, index))}</div>
              <div className={styles.signup_step_5_text} style={{ marginTop: '15px' }}>
                {formatMessage({ id: 'signup.step_05.content.account_detail' })}
              </div>
              <div className={`${styles.signup_step_5_text} ${styles.signup_step_5_email}`}>
                {email}
              </div>
              <div className={styles.signup_step_5_text} style={{ marginBottom: '30px' }}>
                {formatMessage({ id: 'signup.step_05.instruction' })}
              </div>
            </Col>
            <Col span={24}>
              <SignUpBtn
                size="large"
                type="primary"
                onClick={this.onDone}
                title={formatMessage({ id: 'signup.button.done' })}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default Step05;
