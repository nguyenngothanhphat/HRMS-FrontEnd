import React, { PureComponent } from 'react';
import { Progress } from 'antd';
import styles from './index.less';

export default class LeaveProgressBar extends PureComponent {
  renderCircle = (color) => {
    const { type: { remainingTotalMessage = '', taken = 0, total = 0 } = {} } = this.props;
    return (
      <span
        className={styles.smallCircle}
        style={{
          fontSize: (total - taken) % 1 !== 0 || total % 1 !== 0 ? 10 : 12,
        }}
      >
        <span style={{ color, fontWeight: 'bold' }}>{remainingTotalMessage}</span>
      </span>
    );
  };

  render() {
    const { type: { remainingMessage = '', taken = 0, total = 0, name = '' } = {}, color = '' } =
      this.props;
    return (
      <div className={styles.LeaveProgressBar}>
        <div className={styles.LeaveProgressBar__above}>
          <span className={styles.title}>{name}</span>
          <span className={styles.progress}>
            <span className={styles.stepNumber}>Remaining: {remainingMessage}</span>
          </span>
        </div>
        <div className={styles.LeaveProgressBar__below}>
          <div className={styles.renderProgressBar}>
            <Progress
              type="circle"
              percent={((total - taken) * 100) / total}
              width={52}
              strokeColor={color}
              trailColor="#d6dce0"
              format={() => this.renderCircle(color)}
            />
          </div>
        </div>
      </div>
    );
  }
}
