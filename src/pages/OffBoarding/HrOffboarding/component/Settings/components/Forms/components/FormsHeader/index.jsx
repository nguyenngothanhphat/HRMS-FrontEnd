import React, { PureComponent } from 'react';
import { history } from 'umi';
import styles from './index.less';

class FormsHeader extends PureComponent {
  render() {
    return (
      <div className={styles.FormsHeader}>
        <div className={styles.leftPart}>
          <div className={styles.title}>Forms</div>
          <div className={styles.subTitle}>
            You can manage all of your Form templates related to off boarding here. These forms can
            be used for exit interviews and beneficial check.
          </div>
        </div>
        <div className={styles.rightPart}>
          <div
            onClick={() => history.push('/offboarding/settings/forms/add')}
            className={styles.addButton}
          >
            <span>Create a new form template</span>
          </div>
        </div>
      </div>
    );
  }
}

export default FormsHeader;
