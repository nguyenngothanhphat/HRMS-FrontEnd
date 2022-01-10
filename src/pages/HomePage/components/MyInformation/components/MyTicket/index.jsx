import React, { useEffect } from 'react';
import { connect } from 'umi';
import CommonTab from '@/pages/Dashboard/components/ActivityLog/components/CommonTab';
import styles from './index.less';
import EmptyComponent from '@/components/Empty';

const statusTickets = ['New', 'Assigned', 'In Progress', 'Client Pending'];

const ActivityLog = (props) => {
  const { dispatch, employee: { _id = '' } = {}, listMyTicket = [], status = '' } = props;

  // USE EFFECT
  useEffect(() => {
    dispatch({
      type: 'dashboard/fetchListTicket',
    });
  }, []);
  useEffect(() => {
    dispatch({
      type: 'dashboard/fetchListMyTicket',
    });
  }, [status]);

  const listMyTicketNew =
    listMyTicket.length > 0
      ? listMyTicket.filter((val) => {
          return val.employee_raise === _id;
        })
      : [];
  const dataMyTickets = listMyTicketNew.filter((element) => statusTickets.includes(element.status));

  // MAIN
  return (
    <div
      className={styles.ActivityLog}
      style={
        dataMyTickets.length === 0
          ? {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }
          : null
      }
    >
      {dataMyTickets.length === 0 ? (
        <EmptyComponent />
      ) : (
        <CommonTab type="3" data={dataMyTickets} />
      )}
    </div>
  );
};

export default connect(
  ({
    dashboard: { listTicket = [], listMyTicket = {}, status = '' } = {},
    loading,
    user: { permissions = {}, currentUser: { employee = {} } } = {},
  }) => ({
    status,
    listTicket,
    listMyTicket,
    permissions,
    employee,
    loadingFetchListTicket: loading.effects['dashboard/fetchListTicket'],
    loadingFetchListMyTicket: loading.effects['dashboard/fetchListMyTicket'],
  }),
)(ActivityLog);
