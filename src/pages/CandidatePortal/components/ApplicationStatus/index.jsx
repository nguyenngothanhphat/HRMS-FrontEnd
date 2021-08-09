import React, { PureComponent } from 'react';
import BackgroundImage from '../../../../../public/assets/images/twoManTalking.svg';
import styles from './index.less';

class ApplicationStatus extends PureComponent {
  render() {
    return (
      <div className={styles.ApplicationStatus}>
        <div className={styles.header}>
          <span>Application Status</span>
        </div>
        <div className={styles.content}>
          <span className={styles.status}>Joined</span>
          <span className={styles.dateOfJoining}>May 17th 2021</span>
        </div>
        <div className={styles.backgroundImage}>
          <img src={BackgroundImage} alt="vector" />
        </div>
      </div>
    );
  }
}

export default ApplicationStatus;
