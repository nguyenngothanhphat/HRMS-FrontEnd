import React, { PureComponent } from 'react';
import styles from './index.less';
import listEditCommentButton from '@/assets/resourceManagement/list-edit-comment.svg';

class CommentOverlay extends PureComponent {
  render() {
    const { row, line } = this.props;
    return (
      <div className={styles.Overlay}>
        <span className={styles.comment} style={{ WebkitLineClamp: line }}>
          {row.comment}
        </span>
        <div id={`${row.employeeId}`} className={styles.overlay}>
          <button className={styles.buttonContainer} type="button">
            <img src={listEditCommentButton} alt="" className={styles.image} />
          </button>
        </div>
      </div>
    );
  }
}
export default CommentOverlay;
