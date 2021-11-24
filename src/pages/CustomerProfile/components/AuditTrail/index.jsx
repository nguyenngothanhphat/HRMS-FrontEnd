// export default AuditTrail;
import { Card } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import CommonTable from '../CommonTable';
import styles from './index.less';

const AuditTrail = (props) => {
  const { dispatch, auditTrail = [], loadingFetch = false, reId = '' } = props;

  const fetchAuditTrailList = () => {
    dispatch({
      type: 'customerProfile/fetchAuditTrail',
      payload: {
        id: reId,
      },
    });
  };

  useEffect(() => {
    fetchAuditTrailList();
  }, []);

  const getActionInfo = (record) => {
    const { changes = '' } = record;
    return changes ? ` - ${changes}` : '';
  };

  const getColumns = () => {
    const columns = [
      {
        title: 'Time',
        dataIndex: 'timeTaken',
        key: 'timeTaken',
        render: (timeTaken) => {
          return (
            <span>
              {timeTaken ? moment(timeTaken).locale('en').format('MM-DD-YYYY HH:mm:ss') : '-'}
            </span>
          );
        },
      },
      {
        title: 'User',
        dataIndex: 'user',
        key: 'user',
        render: (user) => <span className={styles.clickableTag}>{user}</span>,
      },
      {
        title: 'Changes',
        dataIndex: 'action',
        key: 'action',
        render: (action, row) => {
          return (
            <span>
              {action}
              <span className={styles.clickableTag}>{getActionInfo(row)}</span>
            </span>
          );
        },
      },
    ];
    return columns;
  };

  return (
    <div className={styles.AuditTrail}>
      <Card title="Audit Trail">
        <div className={styles.tableContainer}>
          <CommonTable list={auditTrail} columns={getColumns()} loading={loadingFetch} />
        </div>
      </Card>
    </div>
  );
};
export default connect(({ customerProfile: { auditTrail = [] } = {}, loading }) => ({
  auditTrail,
  loadingFetch: loading.effects['customerProfile/fetchAuditTrail'],
}))(AuditTrail);
