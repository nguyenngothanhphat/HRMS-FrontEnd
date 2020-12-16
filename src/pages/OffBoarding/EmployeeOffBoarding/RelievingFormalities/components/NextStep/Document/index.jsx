import React, { PureComponent } from 'react';
import { Progress } from 'antd';
import FileIcon from '@/assets/fileVectorIcon.svg';
import DoneCheckIcon from '@/assets/doneCheckIcon.svg';
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
            {percent === 100 && <img src={DoneCheckIcon} alt="done" />}
            {percent !== 0 && percent !== 100 && (
              <Progress
                type="circle"
                percent={percent}
                width={30}
                strokeWidth={12}
                strokeColor="#ffa100"
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Document;
