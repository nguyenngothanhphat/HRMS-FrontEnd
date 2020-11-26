import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import templateIcon from '@/assets/template-icon.svg';
import styles from './index.less';

class Feedback extends PureComponent {
  render() {
    return (
      <div className={styles.feedback}>
        <p className={styles.feedback__title}>Feedback from Exit interview</p>
        <Row gutter={[10, 15]} align="middle" justify="s">
          <Col span={8}>
            <div className={styles.template}>
              <div className={styles.template__content}>
                <img src={templateIcon} alt="template-icon" />
                <span>Feedback Form</span>
              </div>
            </div>
          </Col>
          <Col span={16} className={styles.feedback__text}>
            <span>Conducted by [PSI: 20014] Mokchada Sinha | 22.02.20 | 01:30 PM</span>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Feedback;
