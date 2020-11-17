import React, { PureComponent } from 'react';
import moment from 'moment';
import { Input } from 'antd';
import styles from './index.less';

const { TextArea } = Input;

export default class ListComment extends PureComponent {
  render() {
    const { data = [] } = this.props;
    return (
      <div className={styles.root}>
        {data.map((item) => {
          const { title = '', content = '' } = item;
          return (
            <div className={styles.itemComment}>
              <div className={styles.itemComment__viewInfo}>
                <div className={styles.itemComment__viewInfo__title}>{title}</div>
                <div className={styles.itemComment__viewInfo__date}>
                  {moment().format('DD.MM.YY | h:mm A')}
                </div>
              </div>
              <TextArea className={styles.itemComment__content} value={content} disabled />
            </div>
          );
        })}
      </div>
    );
  }
}
