import { Button } from 'antd';

import React, { Component } from 'react';

import styles from './index.less';

class Regulations extends Component {
  render() {
    return (
      <div className={styles.containerRegulations}>
        <div className={styles.headerre}>
          <div>Categories</div>
          <div>
            <Button>+</Button>
            <span>Add Categories</span>
          </div>
        </div>
      </div>
    );
  }
}
export default Regulations;
