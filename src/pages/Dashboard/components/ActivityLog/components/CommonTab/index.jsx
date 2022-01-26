import { Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import Empty from '@/components/Empty';
import Icon from '@/assets/timeOffTableEmptyIcon.svg';
import NotificationTag from '../NotificationTag';
import PendingApprovalTag from '../PendingApprovalTag';
import TicketTag from '../TicketTag';
import styles from './index.less';

const CommonTab = (props) => {
  const { isInModal = false, type: typeProp = '1', data = [] } = props;

  const renderTagByType = (type) => {
    switch (type) {
      case '1': {
        return data.map((item) => {
          return <PendingApprovalTag item={item} />;
        });
      }
      case '2': {
        return data.map((item) => {
          return <NotificationTag item={item} />;
        });
      }
      case '3': {
        return data.map((item) => {
          return <TicketTag item={item} />;
        });
      }
      default:
        return null;
    }
  };

  if (data.length === 0) return <Empty image={Icon} />;

  return (
    <div className={styles.CommonTab} style={isInModal ? { maxHeight: '600px' } : {}}>
      <Row gutter={[16, 16]}>{renderTagByType(typeProp)}</Row>
    </div>
  );
};

export default connect(() => ({}))(CommonTab);
