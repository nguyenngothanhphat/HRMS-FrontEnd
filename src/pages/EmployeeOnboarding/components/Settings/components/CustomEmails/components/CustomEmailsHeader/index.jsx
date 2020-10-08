import React, { PureComponent } from 'react';
// import { formatMessage } from 'umi';
import styles from './index.less';

class CustomEmailsHeader extends PureComponent {
  render() {
    return (
      <div className={styles.CustomEmailsHeader}>
        <div className={styles.title}>Custom emails</div>
        <div className={styles.subTitle}>
          Cras gravida bibendum dolor eu varius. Morbi fermentum velit nisl, eget vehicula lorem
          sodales eget. Donec quis volutpat orci. Sed ipsum felis, tristique id egestas et,
          convallis ac velit.
        </div>
      </div>
    );
  }
}

export default CustomEmailsHeader;
