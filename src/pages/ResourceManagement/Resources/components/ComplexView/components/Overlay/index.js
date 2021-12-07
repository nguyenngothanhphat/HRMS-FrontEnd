import React, { PureComponent } from 'react';
import styles from './index.less';
import EditCommentModal from './components/EditComment';
import ViewCommentModal from './components/ViewComment';

class CommentOverlay extends PureComponent {
  render() {
    const { row, line, refreshData } = this.props;
    return (
      <div className={styles.CommentOverlay}>
        <span className={styles.comment} style={{ WebkitLineClamp: line }}>
          {row.comment}
        </span>
        {/* <div id={`${row.employeeId}`} className={styles.overlay}>
          <button className={styles.buttonContainer} type="button">
            <img src={listEditCommentButton} alt="" className={styles.image} />
          </button>
        </div> */}
        <span className={styles.showEditComment}>
          <EditCommentModal dataRow={row} refreshData={refreshData} />
        </span>
        <span className={styles.showViewComment}>
          <ViewCommentModal dataRow={row} />
        </span>
      </div>
    );
  }
}
export default CommentOverlay;
