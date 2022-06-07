import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { Input } from 'antd';
import styles from './index.less';

const { TextArea } = Input;

export default class ListComment extends PureComponent {
  render() {
    const { data = [] } = this.props;
    const listComment = data.filter((item) => item.content !== '');
    return (
      <Fragment>
        {listComment.length > 0 && (
          <div className={styles.root}>
            {listComment.map((item) => {
              const { updatedAt = '', content = '' } = item;
              return (
                <div className={styles.itemComment}>
                  <div className={styles.itemComment__viewInfo}>
                    <div className={styles.itemComment__viewInfo__title}>
                      Reporting Manger’s comment
                    </div>
                    <div className={styles.itemComment__viewInfo__date}>
                      {updatedAt && moment(updatedAt).format('DD.MM.YY | h:mm A')}
                    </div>
                  </div>
                  <TextArea className={styles.itemComment__content} value={content} disabled />
                </div>
              );
            })}
          </div>
        )}
      </Fragment>
    );
  }
}
