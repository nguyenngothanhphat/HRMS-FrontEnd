import React, { PureComponent } from 'react';
import { Link } from 'umi';
import blueBackIcon from './assets/blueBackIcon.svg';

import styles from './index.less';

class EmailReminderHeader extends PureComponent {
  render() {
    return (
      <div className={styles.EmailReminderHeader}>
        <Link
          to={{
            pathname: '/employee-onboarding',
            state: { defaultActiveKey: '2' },
          }}
        >
          <img src={blueBackIcon} alt="back icon" />
        </Link>

        <p>Create a custom email remainder</p>
      </div>
    );
  }
}

export default EmailReminderHeader;
