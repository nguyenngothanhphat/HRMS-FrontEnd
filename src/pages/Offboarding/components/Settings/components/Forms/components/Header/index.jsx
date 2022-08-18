import React, { PureComponent } from 'react';
import { history } from 'umi';
import CustomBlueButton from '@/components/CustomBlueButton';
import styles from './index.less';

class Header extends PureComponent {
  render() {
    return (
      <div className={styles.Header}>
        <div className={styles.leftPart}>
          <div className={styles.title}>Forms</div>
          <div className={styles.subTitle}>
            You can manage all of your Form templates related to off boarding here. These forms can
            be used for exit interviews and beneficial check.
          </div>
        </div>
        <div className={styles.rightPart}>
          <CustomBlueButton
            onClick={() => history.push('/offboarding/settings/forms/form-detail/add')}
          >
            Create a new form template
          </CustomBlueButton>
        </div>
      </div>
    );
  }
}

export default Header;
