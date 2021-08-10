import React, { PureComponent } from 'react';
import { Button } from 'antd';
import styles from './index.less';

class QueryBar extends PureComponent {
  render() {
    return (
      <div className={styles.QueryBar}>
        <span className={styles.text}>
          Have queries? Send it to us and we’ll get back to you as soon as we can.
        </span>
        <Button type="primary">Send</Button>
      </div>
    );
  }
}

export default QueryBar;
