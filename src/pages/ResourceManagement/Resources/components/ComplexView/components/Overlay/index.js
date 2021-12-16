import React, { PureComponent } from 'react';
import styles from './index.less';
import EditCommentModal from './components/EditComment';
import ViewCommentModal from './components/ViewComment';

class CommentOverlay extends PureComponent {
  render() {
    const { row, line, refreshData, allowModify = false } = this.props;
    return (
      <div className={styles.CommentOverlay}>
        <span className={styles.comment} style={{ WebkitLineClamp: line }}>
          {row.comment}
        </span>
        <div className={styles.mask}>
          <div className={styles.buttonContainer}>
            {allowModify && (
              // <span className={styles.showEditComment}>
              <EditCommentModal dataRow={row} refreshData={refreshData} />
              // </span>
            )}
            {/* <span className={styles.showViewComment}> */}
            <ViewCommentModal dataRow={row} />
            {/* </span> */}
          </div>
        </div>
      </div>
    );
  }
}
export default CommentOverlay;
