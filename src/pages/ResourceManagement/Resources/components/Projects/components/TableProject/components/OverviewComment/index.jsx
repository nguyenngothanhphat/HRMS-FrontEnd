import React, { PureComponent } from 'react';
import styles from './index.less';
import EditComment from './components/EditComment';
import ViewComment from './components/ViewComment';

class OverviewComment extends PureComponent {
  render() {
    const { row, line, fetchProjectList } = this.props;
    return (
      <div className={styles.OverviewComment}>
        <span className={styles.comment} style={{ WebkitLineClamp: line }}>
          {row.comment}
        </span>
        <div className={styles.showEditComment}>
          <EditComment dataRow={row} fetchProjectList={fetchProjectList} />
          <ViewComment dataRow={row} />
        </div>
      </div>
    );
  }
}
export default OverviewComment;
