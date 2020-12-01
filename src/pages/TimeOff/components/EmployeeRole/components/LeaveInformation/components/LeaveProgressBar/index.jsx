import React, { PureComponent } from 'react';
import styles from './index.less';

export default class LeaveProgressBar extends PureComponent {
  renderProgressBar = () => {
    const { stepNumber = 0, limitNumber = 0, color = '#000' } = this.props;

    return (
      <div className={styles.renderProgressBar}>
        {Array.from(Array(stepNumber), (_, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundColor: color,
              }}
              className={styles.activeColor}
            />
          );
        })}
        {Array.from(Array(limitNumber - stepNumber), (_, index) => {
          return (
            <div
              style={{
                backgroundColor: color,
              }}
              key={index}
              className={styles.inactiveColor}
            />
          );
        })}
      </div>
    );
  };

  render() {
    const {
      title = '',
      shorten = '',
      stepNumber = 0,
      limitNumber = 0,
      color = '#000',
      moreContent = '',
    } = this.props;
    return (
      <div className={styles.LeaveProgressBar}>
        <div className={styles.LeaveProgressBar__above}>
          <p className={styles.title}>
            {title}
            <span
              style={{
                color,
              }}
              className={styles.title__shorten}
            >
              {' '}
              ({shorten})
            </span>
          </p>
          <p className={styles.progress}>
            <span
              style={{
                color,
              }}
              className={styles.stepNumber}
            >
              {`0${stepNumber}`.slice(-2)}
            </span>
            <span className={styles.limitNumber}>/{`0${limitNumber}`.slice(-2)}</span>
          </p>
        </div>
        <div className={styles.LeaveProgressBar__below}>
          {this.renderProgressBar()}
          {moreContent !== '' && <span className={styles.moreContent}>{moreContent}</span>}
        </div>
      </div>
    );
  }
}
