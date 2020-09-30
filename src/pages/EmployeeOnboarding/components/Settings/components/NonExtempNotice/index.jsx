import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import NonExtempNoticeForm from './components/NonExtempNoticeForm';
import styles from './index.less';

class NonExtempNotice extends PureComponent {
  render() {
    return (
      <div className={styles.NonExtempNotice}>
        <div className={styles.NonExtempNotice_title}>
          {formatMessage({ id: 'component.nonExtempNotice.title' })}
        </div>
        <NonExtempNoticeForm />
      </div>
    );
  }
}

export default NonExtempNotice;
