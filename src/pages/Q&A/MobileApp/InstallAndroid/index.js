import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import s from './index.less';

class InstallAndorid extends PureComponent {
  render() {
    return (
      <Row className={s.containerView}>
        <Col span={24} className={s.contentView}>
          <div>
            <p className={s.textContent}>
              Expenso Mobile App, Android version is published on Google Play Store and it could be
              accessed via url below:
            </p>
            <p className={s.textContent}>
              <a href="https://play.google.com/store/apps/details?id=com.paxinimi.expenso">
                https://play.google.com/store/apps/details?id=com.paxinimi.expenso
              </a>
            </p>
            <p className={s.textContent}>
              Opening url by the Android device to have the app installed.
            </p>
          </div>
        </Col>
      </Row>
    );
  }
}

export default InstallAndorid;
