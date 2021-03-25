import React, { Component } from 'react';
// import { Row, Col } from 'antd';
import AdditionalAdminstrator from './components/Additional';
import PrimaryAdminstrator from './components/Primary';

import styles from './index.less';

class Adminstrator extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.root__top}>
          <PrimaryAdminstrator />
        </div>
        <div className={styles.root__bottom}>
          <AdditionalAdminstrator />
        </div>
      </div>
    );
  }
}

export default Adminstrator;
