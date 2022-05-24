import { Col, Progress } from 'antd';
import React, { PureComponent } from 'react';
import styles from './index.less';

export default class SpecialLeaveBox extends PureComponent {
  renderCircle = (days, color) => {
    return (
      <span className={styles.smallCircle} style={{ color }}>
        <span className={styles.dayNumber}>{days}</span>
        {days !== 'N/A' && <span className={styles.dayText}>days</span>}
      </span>
    );
  };

  render() {
    const { type: { remainingMessage = '', name = '' } = {}, color = '#000' } = this.props;
    return (
      <Col className={styles.SpecialLeaveBox} span={24}>
        <span className={styles.title}>{name}</span>

        <div className={styles.daysBox}>
          <Progress
            type="circle"
            percent={100}
            width={52}
            strokeColor={color}
            strokeWidth={2}
            format={() => this.renderCircle(remainingMessage, color)}
          />
        </div>
      </Col>
    );
  }
}
