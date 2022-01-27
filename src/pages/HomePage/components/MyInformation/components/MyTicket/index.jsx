import React from 'react';
import { connect } from 'umi';
import EmptyComponent from '@/components/Empty';
import CommonTab from '@/pages/Dashboard/components/ActivityLog/components/CommonTab';
import styles from './index.less';

const ActivityLog = (props) => {
  const { data = [] } = props;

  // MAIN
  return (
    <div
      className={styles.ActivityLog}
      style={
        data.length === 0
          ? {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }
          : null
      }
    >
      {data.length === 0 ? <EmptyComponent /> : <CommonTab type="3" data={data} noBackground />}
    </div>
  );
};

export default connect(() => ({}))(ActivityLog);
