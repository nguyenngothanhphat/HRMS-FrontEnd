import React, { PureComponent } from 'react';
import { Link, formatMessage } from 'umi';
import blueBackIcon from './assets/blueBackIcon.svg';

import styles from './index.less';

class EmailReminderHeader extends PureComponent {
  render() {
    return (
      <div className={styles.EmailReminderHeader}>
        <Link
          to={{
            pathname: '/offboarding/settings/custom-emails',
            state: { settingsDisplayComponent: true },
          }}
        >
          <img src={blueBackIcon} alt="back icon" />
        </Link>

        <p>{formatMessage({ id: 'component.emailReminderHeader.title' })}</p>
      </div>
    );
  }
}

export default EmailReminderHeader;
