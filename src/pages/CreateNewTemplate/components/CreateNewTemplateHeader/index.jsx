import React, { PureComponent } from 'react';
import { Link } from 'umi';
import blueBackIcon from './assets/blueBackIcon.svg';

import styles from './index.less';

class CreateNewTemplateHeader extends PureComponent {
  render() {
    return (
      <div className={styles.CreateNewTemplateHeader}>
        <Link
          to={{
            pathname: '/employee-onboarding/settings',
          }}
        >
          <img src={blueBackIcon} alt="back icon" />
        </Link>

        <p>Create New Template</p>
      </div>
    );
  }
}

export default CreateNewTemplateHeader;
