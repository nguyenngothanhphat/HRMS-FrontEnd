import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import styles from './index.less';

export default class Footer extends PureComponent {
  render() {
    return (
      <div className={styles.Footer}>
        <div>{formatMessage({ id: 'footer.div1' })}</div>
        <div>{formatMessage({ id: 'footer.div2' })}</div>
      </div>
    );
  }
}
