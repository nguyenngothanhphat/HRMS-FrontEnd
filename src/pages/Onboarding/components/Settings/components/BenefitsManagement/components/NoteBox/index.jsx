import React, { Component } from 'react';
import NodeIcon from '@/assets/lightning.svg';

import styles from './index.less';

class NoteBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.benefitNote}>
        <div className={styles.headerNote}>
          <img alt="note" src={NodeIcon} />
          <div className={styles.headerNote__text}>Note</div>
        </div>
        <div className={styles.headerNote__content}>
          The candidate must upload all required documents. And, <span>the HR must approve</span>{' '}
          the documents and mark candidate as eligible.
        </div>
        <div className={styles.headerNote__bottom}>
          Post this approval, the remaining processes will open for onboarding.
        </div>
      </div>
    );
  }
}

export default NoteBox;
