import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import styles from './index.less';

export default class BasicInformationHeader extends PureComponent {
  render() {
    return (
      <div className={styles.basicInformationHeader}>
        <p className={styles.basicInformationHeader__title}>
          {formatMessage({ id: 'component.basicInformation.title' })}
        </p>
        {/* <p className={styles.basicInformationHeader__subtitle}>
          {formatMessage({ id: 'component.basicInformation.subtitle' })}
        </p> */}
      </div>
    );
  }
}
