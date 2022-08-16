import { Progress } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const LeaveInformation = ({ overview }) => {
  const renderCircleProgress = () => (
    <div className={styles.circleProgress}>
      <span className={styles.percentValue}>{overview?.remaining || 0}</span>
      <p className={styles.remainingText}>Remaining</p>
    </div>
  );

  return (
    <div className={styles.LeaveInformation}>
      <div className={styles.totalLeaveBalance}>
        <span className={styles.title}>Total Leave Balance</span>
        <div className={styles.leaveBalanceBox}>
          <Progress
            type="circle"
            strokeColor="#FFA100"
            trailColor="#EAE7E3"
            percent={overview.total ? (overview.remaining / overview.total) * 100 : 0}
            format={renderCircleProgress}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(({ timeOff: { yourTimeOffTypes: { overview = {} } = {} } = {} }) => ({
  overview,
}))(LeaveInformation);
