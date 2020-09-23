import React, { PureComponent } from 'react';

import blueBackIcon from './assets/blueBackIcon.svg';

import styles from './index.less';

class TemplateDetailsHeader extends PureComponent {
  render() {
    return (
      <div className={styles.TemplateDetailsHeader}>
        <img src={blueBackIcon} alt="back icon" />
        <p>Offer letter template [PC Technician]</p>
      </div>
    );
  }
}

export default TemplateDetailsHeader;
