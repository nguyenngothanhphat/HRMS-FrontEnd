import React, { Component } from 'react';
// import { Row, Col } from 'antd';
import PrimaryAdministrator from './components/Primary';

import styles from './index.less';

class Administrator extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.root__top}>
          <PrimaryAdministrator />
        </div>
        <div className={styles.root__bottom} />
      </div>
    );
  }
}

export default Administrator;
