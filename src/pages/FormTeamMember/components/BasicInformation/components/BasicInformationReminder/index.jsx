import React, { PureComponent } from 'react';
import styles from './index.less';

export default class BasicInformationReminder extends PureComponent {
  render() {
    return (
      <div className={styles.basicInformationReminder}>
        <div className={styles.reminderWrapper}>
          <div className={styles.reminderWrapper__header}>
            <div className={styles.reminderWrapper__header__icon}>
              <p>!</p>
            </div>
            <div className={styles.reminderWrapper__header__title}>
              <p>Reminder</p>
            </div>
          </div>
          <div className={styles.reminderWrapper__content}>
            <p>
              This will be used to login to Terralogic portal once the candidate is confirmed as an
              employee. This field cannot be viewed by the candidate yet.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
