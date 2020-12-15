import React, { PureComponent } from 'react';
import { Progress } from 'antd';
import FileIcon from '@/assets/fileFeedback.svg';
import styles from './index.less';

class Document extends PureComponent {
  render() {
    const { name = '', onClick = () => {}, percent = 0 } = this.props;
    return (
      <div className={styles.Document} onClick={onClick}>
        <div className={styles.left}>
          <img src={FileIcon} alt="file" />
          <span className={styles.fileName}>{name}</span>
        </div>
        <div className={styles.right}>
          <div>
            <Progress type="circle" percent={percent} width={30} strokeWidth={10} />
          </div>
        </div>
      </div>
    );
  }
}

export default Document;
