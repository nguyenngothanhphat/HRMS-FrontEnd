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
        <div className={styles.headerNode}>
          <img alt="note" src={NodeIcon} />
          <div className={styles.headerNode__text}>Note</div>
        </div>
      </div>
    );
  }
}

export default NoteBox;
