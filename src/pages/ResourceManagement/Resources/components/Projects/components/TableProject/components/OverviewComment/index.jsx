import React, { PureComponent } from 'react';
import styles from './index.less';
import EditComment from './components/EditComment';
import ViewComment from './components/ViewComment';

class OverviewComment extends PureComponent {
  render() {
    const { row, fetchProjectList } = this.props;
    return (
      <div className={styles.OverviewComment}>
        <div className={styles.comment}>
          {row.comment && row.comment.length > 50 ? `${row.comment.slice(0, 60)} ...` : row.comment}
        </div>
        <div className={styles.showEditComment}>
          <EditComment dataRow={row} fetchProjectList={fetchProjectList} />
          <ViewComment dataRow={row} />
        </div>
      </div>
    );
  }
}
export default OverviewComment;
