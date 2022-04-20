import React, { PureComponent } from 'react';
import { Col, Progress } from 'antd';
import styles from './index.less';
import { addZeroToNumber } from '@/utils/timeOff';

export default class SpecialLeaveBox extends PureComponent {
  renderCircle = (days, color) => {
    return (
      <span className={styles.smallCircle} style={{ color }}>
        <span className={styles.dayNumber}>{addZeroToNumber(Math.round(days * 100) / 100)}</span>
        <span className={styles.dayText}>days</span>
      </span>
    );
  };

  render() {
    const { title = '', shortType = '', days = 0, color = '#000' } = this.props;
    return (
      <Col className={styles.SpecialLeaveBox} span={24}>
        <span className={styles.title}>
          {title} <span> {shortType !== '' && `(${shortType})`}</span>
        </span>
        <div className={styles.daysBox}>
          <Progress
            type="circle"
            percent={100}
            width={50}
            strokeColor={color}
            strokeWidth={2}
            format={() => this.renderCircle(days, color)}
          />
        </div>
      </Col>
    );
  }
}
