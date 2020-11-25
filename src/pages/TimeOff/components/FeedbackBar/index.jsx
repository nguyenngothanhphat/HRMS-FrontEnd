import React, { PureComponent } from 'react';
import { LikeOutlined, DislikeOutlined, CloseOutlined } from '@ant-design/icons';
import styles from './index.less';

export default class FeedbackBar extends PureComponent {
  onLikeClick = () => {
    // eslint-disable-next-line no-alert
    alert('Clicked');
  };

  render() {
    const { onClose = () => {} } = this.props;
    return (
      <div className={styles.FeedbackBar}>
        <div className={styles.container}>
          <div className={styles.leftPart}>
            <span className={styles.title}>Are you satisfied with our Timeoff app?</span>
            <div className={styles.likeButton} onClick={this.onLikeClick}>
              <LikeOutlined />
              <span className={styles.text}>Yes</span>
            </div>
            <div className={styles.likeButton} onClick={this.onLikeClick}>
              <DislikeOutlined />
              <span className={styles.text}>No</span>
            </div>
          </div>
          <div className={styles.rightPart} onClick={onClose}>
            <CloseOutlined />
          </div>
        </div>
      </div>
    );
  }
}
