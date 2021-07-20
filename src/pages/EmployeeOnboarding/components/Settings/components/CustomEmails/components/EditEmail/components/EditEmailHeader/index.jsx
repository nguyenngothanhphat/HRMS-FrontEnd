import React, { PureComponent } from 'react';
import { Link, formatMessage } from 'umi';
import blueBackIcon from './assets/blueBackIcon.svg';

import styles from './index.less';

class EditEmailHeader extends PureComponent {
  render() {
    return (
      <div className={styles.EditEmailHeader}>
        <Link
          to={{
            pathname: '/employee-onboarding/settings',
            state: { settingsDisplayComponent: true },
          }}
        >
          <img src={blueBackIcon} alt="back icon" />
        </Link>

        <p>{formatMessage({ id: 'component.editEmailHeader.title' })}</p>
      </div>
    );
  }
}

export default EditEmailHeader;
