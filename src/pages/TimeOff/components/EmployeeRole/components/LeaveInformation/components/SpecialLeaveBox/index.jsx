import React, { PureComponent } from 'react';
import { Col } from 'antd';
import styles from './index.less';

export default class SpecialLeaveBox extends PureComponent {
  render() {
    const { title = '', shorten = '', color = '#000', days = 0 } = this.props;
    return (
      <Col className={styles.SpecialLeaveBox} span={8}>
        <p className={styles.title}>
          {title} <span> ({shorten})</span>
        </p>
        <div
          style={{
            color,
          }}
          className={styles.days}
        >
          <span className={styles.activeDays}>{`0${days}`.slice(-2)}</span>
          <span> days</span>
        </div>
      </Col>
    );
  }
}
