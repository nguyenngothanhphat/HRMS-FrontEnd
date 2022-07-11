import React, { PureComponent } from 'react';
import styles from './index.less';
import EditCommentModal from './components/EditComment';
import ViewCommentModal from './components/ViewComment';
import DeleteComment from './components/DeleteComment';

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
            {allowModify && <EditCommentModal dataRow={row} refreshData={refreshData} />}
            <ViewCommentModal dataRow={row} />
            <DeleteComment id={row.employeeId} refreshData={refreshData} />
          </div>
        </div>
      </div>
    );
  }
}
export default CommentOverlay;
