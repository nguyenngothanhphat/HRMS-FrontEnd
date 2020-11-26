import React, { PureComponent } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import DislikeIcon from '@/assets/dislike.svg';
import LikeIcon from '@/assets/like.svg';

import styles from './index.less';

export default class FeedbackBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      onLikeClick: false,
    };
  }

  onLikeClick = () => {
    this.setState({
      onLikeClick: true,
    });
  };

  render() {
    const { onClose = () => {} } = this.props;
    const { onLikeClick } = this.state;
    return (
      <div className={styles.FeedbackBar}>
        <div className={styles.container}>
          {onLikeClick ? (
            <div className={styles.leftPart}>
              <span className={styles.title}>Thank you for your feedback!</span>
            </div>
          ) : (
            <div className={styles.leftPart}>
              <span className={styles.title}>Are you satisfied with our Timeoff app?</span>
              <div className={styles.likeButton} onClick={this.onLikeClick}>
                <img src={LikeIcon} alt="like-feedback" />
                <span className={styles.text}>Yes</span>
              </div>
              <div className={styles.likeButton} onClick={this.onLikeClick}>
                <img src={DislikeIcon} alt="like-feedback" />
                <span className={styles.text}>No</span>
              </div>
            </div>
          )}

          <div className={styles.rightPart} onClick={onClose}>
            <CloseOutlined />
          </div>
        </div>
      </div>
    );
  }
}
