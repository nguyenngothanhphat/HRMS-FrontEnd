import React, { PureComponent } from 'react';
import moment from 'moment';
import BackgroundImage from '../../../../../public/assets/images/twoManTalking.svg';
import styles from './index.less';

class ApplicationStatus extends PureComponent {
  render() {
    const { data: { dateOfJoining = '' } = {} || {} } = this.props;
    return (
      <div className={styles.ApplicationStatus}>
        <div className={styles.header}>
          <span>Application Status</span>
        </div>
        <div className={styles.content}>
          <span className={styles.status}>Joined</span>
          <span className={styles.dateOfJoining}>
            {dateOfJoining ? moment(dateOfJoining).format('DD.MM.YY') : ''}
          </span>
        </div>
        <div className={styles.backgroundImage}>
          <img src={BackgroundImage} alt="vector" />
        </div>
      </div>
    );
  }
}

export default ApplicationStatus;
