import React, { PureComponent } from 'react';
import { CloseOutlined, LikeFilled, DislikeFilled } from '@ant-design/icons';
import HeartIcon from '@/assets/heartFeedback.svg';
import FileIcon from '@/assets/fileFeedback.svg';

import styles from './index.less';

export default class FeedbackBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      onLikeClick: false,
      onDislikeClick: false,
    };
  }

  onGiveFeedbackClick = () => {
    // eslint-disable-next-line no-alert
    alert('Give feedback');
  };

  onLikeClick = () => {
    this.setState({
      onLikeClick: true,
    });
  };

  onDislikeClick = () => {
    this.setState({
      onDislikeClick: true,
    });
  };

  render() {
    const { onClose = () => {} } = this.props;
    const { onLikeClick, onDislikeClick } = this.state;
    return (
      <div className={styles.FeedbackBar}>
        <div className={styles.container}>
          {onLikeClick ? (
            <div className={styles.leftPart}>
              <img src={HeartIcon} className={styles.heartIcon} alt="heart-icon" />
              <span className={styles.doneTitle}>
                Thank you for your valuable feedback !
                <span>
                  It will help us to cover that extra mile to delivering the best product to you.
                </span>
              </span>
            </div>
          ) : (
            <>
              {onDislikeClick ? (
                <div className={styles.leftPart}>
                  <img src={FileIcon} className={styles.heartIcon} alt="heart-icon" />
                  <span className={styles.failedTitle}>
                    We request to take out sometime to tell us what problem you face
                    <span onClick={this.onGiveFeedbackClick}>Give feedback</span>
                  </span>
                </div>
              ) : (
                <>
                  <div className={styles.leftPart}>
                    <span className={styles.title}>Are you satisfied with our Timeoff app?</span>
                    <div className={styles.likeButton} onClick={this.onLikeClick}>
                      <LikeFilled />
                      <span className={styles.text}>Yes</span>
                    </div>
                    <div className={styles.likeButton} onClick={this.onDislikeClick}>
                      <DislikeFilled />
                      <span className={styles.text}>No</span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          <div className={styles.rightPart} onClick={onClose}>
            <CloseOutlined />
          </div>
        </div>
      </div>
    );
  }
}
