import React, { PureComponent } from 'react';
import styles from './index.less';
import EditComment from './components/EditComment';
import ViewComment from './components/ViewComment';

class OverviewComment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { row, line } = this.props;
    return (
      <span className={styles.OverviewComment}>
        <span className={styles.comment} style={{ WebkitLineClamp: line }}>
          {row.comment}
        </span>
        <span className={styles.showEditComment}>
          <EditComment dataRow={row} />
        </span>
        <span className={styles.showViewComment}>
          <ViewComment dataRow={row} />
        </span>
      </span>
    );
  }
}
export default OverviewComment;
