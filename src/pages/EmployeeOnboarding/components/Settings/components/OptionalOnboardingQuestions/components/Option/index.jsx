import React, { Component } from 'react';
import { Checkbox } from 'antd';

import styles from './index.less';

class Option extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className={styles.Option}>
        <Checkbox
          value="A"
          style={{
            lineHeight: '32px',
          }}
        >
          A
        </Checkbox>
      </div>
    );
  }
}

export default Option;
