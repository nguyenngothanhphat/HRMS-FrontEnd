import { Button } from 'antd';
import React, { PureComponent } from 'react';
import styles from './index.less';

export default class ApplyRequest extends PureComponent {
  render() {
    const { title = '', describe = '', type = 2, buttonText = 'Button', onClick = {} } = this.props;
    return (
      <div
        className={
          type === 1 ? styles.ApplyRequest__hasBackground : styles.ApplyRequest__noBackground
        }
      >
        <div className={styles.abovePart}>
          <span className={styles.title}>{title}</span>
          <div className={type === 1 ? styles.describe1 : styles.describe}>
            <p>{describe}</p>
          </div>
        </div>
        <Button onClick={onClick}>{buttonText}</Button>
      </div>
    );
  }
}
