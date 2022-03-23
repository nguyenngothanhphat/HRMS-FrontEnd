import React, { PureComponent } from 'react';
import { Progress } from 'antd';
import styles from './index.less';
import { addZeroToNumber } from '@/utils/timeOff';

export default class LeaveProgressBar extends PureComponent {
  renderCircle = (stepNumber, limitNumber, color) => {
    return (
      <span className={styles.smallCircle}>
        <span style={{ color, fontWeight: 'bold' }}>{stepNumber}</span>/
        {addZeroToNumber(limitNumber)}
      </span>
    );
  };

  renderProgressBar = () => {
    const { color = '', stepNumber = 0, limitNumber = 0 } = this.props;
    const remaining = (stepNumber / limitNumber) * 100;
    return (
      <div className={styles.renderProgressBar}>
        <Progress
          type="circle"
          percent={remaining}
          width={50}
          strokeColor={color}
          trailColor="#d6dce0"
          format={() => this.renderCircle(stepNumber, limitNumber, color)}
        />
      </div>
    );
  };

  render() {
    const { title = '', shortType = '', stepNumber = 0 } = this.props;
    return (
      <div className={styles.LeaveProgressBar}>
        <div className={styles.LeaveProgressBar__above}>
          <span className={styles.title}>
            {title}
            <span className={styles.title__shorten}> {shortType && `(${shortType})`}</span>
          </span>
          <span className={styles.progress}>
            <span className={styles.stepNumber}>Remaining: {stepNumber}</span>
            {/* <span className={styles.limitNumber}>/{`0${limitNumber}`.slice(-2)}</span> */}
          </span>
        </div>
        <div className={styles.LeaveProgressBar__below}>{this.renderProgressBar()}</div>
      </div>
    );
  }
}
