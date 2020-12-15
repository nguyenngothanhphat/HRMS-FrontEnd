import React, { PureComponent } from 'react';
import styles from './index.less';

export default class NextStep extends PureComponent {
  render() {
    return (
      <div className={styles.NextStep}>
        <div className={styles.abovePart}>
          <span className={styles.title}>Next steps....</span>
        </div>
        <div className={styles.stepBoxes}>
          <div className={styles.eachBox}>
            <div className={styles.indexNumber}>
              <span>1</span>
            </div>
            <p className={styles.content1}>
              You will soon be receiving an exit interview package. Do go through the check list and
              submit it before the exit interview
            </p>
          </div>
          <div className={styles.divider} />
          <div className={styles.eachBox}>
            <div className={styles.indexNumber}>
              <span>2</span>
            </div>
            <p className={styles.content2}>
              The HR will soon send an invitation for your final exit interview.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
