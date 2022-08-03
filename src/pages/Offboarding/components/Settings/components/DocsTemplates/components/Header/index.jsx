import React, { PureComponent } from 'react';
import CustomBlueButton from '@/components/CustomBlueButton';
import styles from './index.less';

class Header extends PureComponent {
  render() {
    return (
      <div className={styles.Header}>
        <div className={styles.leftPart}>
          <div className={styles.title}>Document & Templates</div>
          <div className={styles.subTitle}>
            You can manage all of your documents & templates related to off boarding here. The app
            can generate and send your company’s relieving & experience letters.
          </div>
        </div>
        <div className={styles.rightPart}>
          <CustomBlueButton>Create New Templates</CustomBlueButton>
        </div>
      </div>
    );
  }
}

export default Header;
