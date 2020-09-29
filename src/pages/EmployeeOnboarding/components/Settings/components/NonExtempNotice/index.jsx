import React, { PureComponent } from 'react';

import NonExtempNoticeForm from './components/NonExtempNoticeForm';
import styles from './index.less';

class NonExtempNotice extends PureComponent {
  render() {
    return (
      <div className={styles.NonExtempNotice}>
        <div className={styles.NonExtempNotice_title}>Non-Extempt Notice</div>
        <NonExtempNoticeForm />
      </div>
    );
  }
}

export default NonExtempNotice;
