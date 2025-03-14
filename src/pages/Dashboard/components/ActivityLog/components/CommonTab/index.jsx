/* eslint-disable react/jsx-props-no-spreading */
import { Row, Spin } from 'antd';
import React from 'react';
import { connect } from 'umi';
import Empty from '@/components/Empty';
import Icon from '@/assets/timeOffTableEmptyIcon.svg';
import NotificationTag from '../NotificationTag';
import PendingApprovalTag from '../PendingApprovalTag';
import TicketTag from '../TicketTag';
import styles from './index.less';
import NotificationMessageTag from '../NotificationMessageTag';

const CommonTab = (props) => {
  const {
    isInModal = false,
    type: typeProp = '1',
    data = [],
    noBackground = false,
    refreshData = () => {},
    loadingReject = false,
    loadingApprove = false,
    loadingFetchTimesheet = false,
    loadingFetchTimeoff = false,
  } = props;

  const renderTagByType = (type) => {
    switch (type) {
      case '1': {
        return data.map((item, i) => {
          return <PendingApprovalTag item={item} refreshData={refreshData} key={`${i + 1}`} />;
        });
      }
      case '2': {
        return data.map((item, i) => {
          return <NotificationTag item={item} key={`${i + 1}`} />;
        });
      }
      case '3': {
        return data.map((item, i) => {
          return <TicketTag item={item} key={`${i + 1}`} />;
        });
      }
      case '4': {
        return data.map((item, i) => {
          return <NotificationMessageTag item={item} key={`${i + 1}`} {...props} />;
        });
      }
      default:
        return null;
    }
  };

  const getCss = () => {
    if (isInModal && noBackground) return { background: '#fff', maxHeight: '600px' };
    if (isInModal) return { maxHeight: '600px' };
    if (noBackground) return { background: '#fff' };
    return {};
  };

  if (data.length === 0) return <Empty image={Icon} />;
  return (
    <div className={styles.CommonTab} style={getCss()}>
      <Spin
        spinning={loadingReject || loadingFetchTimeoff || loadingApprove || loadingFetchTimesheet}
      >
        <Row gutter={[16, 16]}>{renderTagByType(typeProp)}</Row>
      </Spin>
    </div>
  );
};

export default connect(({ loading }) => ({
  loadingReject: loading.effects['dashboard/rejectRequest'],
  loadingApprove: loading.effects['dashboard/approveRequest'],
  loadingFetchTimeoff: loading.effects['dashboard/fetchLeaveRequests'],
  loadingFetchTimesheet: loading.effects['dashboard/fetchListTimeSheetTicket'],
}))(CommonTab);
