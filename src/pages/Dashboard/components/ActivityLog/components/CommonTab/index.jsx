import { Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import NotificationTag from '../NotificationTag';
import PendingApprovalTag from '../PendingApprovalTag';
import TicketTag from '../TicketTag';
import styles from './index.less';

const CommonTab = (props) => {
  const { isInModal = false, type: typeProp = '1', data = [], noBackground = false } = props;

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

  const getCss = () => {
    if (isInModal && noBackground) return { background: '#fff', maxHeight: '600px' };
    if (isInModal) return { maxHeight: '600px' };
    if (noBackground) return { background: '#fff' };
    return {};
  };

  return (
    <div className={styles.CommonTab} style={getCss()}>
      <Row gutter={[16, 16]}>{renderTagByType(typeProp)}</Row>
    </div>
  );
};

export default connect(() => ({}))(CommonTab);
