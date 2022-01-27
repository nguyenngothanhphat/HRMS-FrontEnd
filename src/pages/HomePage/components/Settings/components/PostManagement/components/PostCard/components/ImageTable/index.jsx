import React from 'react';
import { connect } from 'umi';
import CommonTable from '../CommonTable';
import styles from './index.less';

const AnnouncementTable = (props) => {
  const { loading = false } = props;

  const getColumns = () => {
    const columns = [
      {
        title: 'Time',
        dataIndex: 'timeTaken',
        key: 'timeTaken',
      },
      {
        title: 'User',
        dataIndex: 'user',
        key: 'user',
      },
      {
        title: 'Changes',
        dataIndex: 'action',
        key: 'action',
      },
    ];
    return columns;
  };

  return (
    <div className={styles.AnnouncementTable}>
      <CommonTable list={[]} loading={loading} columns={getColumns()} />
    </div>
  );
};
export default connect(() => ({}))(AnnouncementTable);
