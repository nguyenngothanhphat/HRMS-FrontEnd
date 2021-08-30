import React, { PureComponent } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';

import styles from './index.less';

export default class BasicInformationReminder extends PureComponent {
  onClickClose = () => {
    const { onClickClose = () => {} } = this.props;
    onClickClose();
  };

  render() {
    return (
      <div className={styles.basicInformationReminder}>
        <div className={styles.reminderWrapper}>
          <CloseOutlined className={styles.reminderWrapper__close} onClick={this.onClickClose} />
          <div className={styles.reminderWrapper__header}>
            <div className={styles.reminderWrapper__header__icon}>
              <p>!</p>
            </div>
            <div className={styles.reminderWrapper__header__title}>
              <p>{formatMessage({ id: 'component.reminder.title' })}</p>
            </div>
          </div>
          <div className={styles.reminderWrapper__content}>
            <p>{formatMessage({ id: 'component.reminder.content' })}</p>
          </div>
        </div>
      </div>
    );
  }
}
