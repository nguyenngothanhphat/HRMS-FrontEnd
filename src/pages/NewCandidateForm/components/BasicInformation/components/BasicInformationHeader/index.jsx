import React, { PureComponent } from 'react';
import styles from './index.less';

export default class BasicInformationHeader extends PureComponent {
  render() {
    return (
      <div className={styles.basicInformationHeader}>
        <p className={styles.basicInformationHeader__title}>Basic Information </p>
        <p className={styles.basicInformationHeader__subtitle}>
          Information of the new joinee goes here
        </p>
      </div>
    );
  }
}
