import React, { PureComponent } from 'react';
import { Link } from 'umi';
import blueBackIcon from './assets/blueBackIcon.svg';

import styles from './index.less';

class TemplateDetailsHeader extends PureComponent {
  render() {
    return (
      <div className={styles.TemplateDetailsHeader}>
        <Link
          to={{
            pathname: '/offboarding/settings/documents-templates',
          }}
        >
          <img src={blueBackIcon} alt="back icon" />
        </Link>

        <p>Offer letter template [PC Technician]</p>
      </div>
    );
  }
}

export default TemplateDetailsHeader;
