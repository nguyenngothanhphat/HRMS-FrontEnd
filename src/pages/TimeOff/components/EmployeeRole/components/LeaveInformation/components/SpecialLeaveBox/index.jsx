import React, { PureComponent } from 'react';
import { Col } from 'antd';
import styles from './index.less';

export default class SpecialLeaveBox extends PureComponent {
  render() {
    const { title = '', shortType = '', days = 0 } = this.props;
    return (
      <Col className={styles.SpecialLeaveBox} span={24}>
        <div className={styles.daysBox}>
          <div className={styles.days}>
            <span className={styles.activeDays}>{`0${days}`.slice(-2)}</span>
            <span className={styles.daysText}>Days</span>
          </div>
          <div className={styles.circleBackground} />
        </div>
        <p className={styles.title}>
          <p>
            {title} <span> {shortType !== '' && `(${shortType})`}</span>
          </p>
        </p>
      </Col>
    );
  }
}
