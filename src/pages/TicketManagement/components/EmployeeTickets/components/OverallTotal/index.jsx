import React from 'react';
import { Col, Row } from 'antd';
import assignIcon from '@/assets/ticketManagement-assign.svg';
import priorityIcon from '@/assets/ticketManagement-priority.svg';
import unresolvedIcon from '@/assets/ticketManagement-unresolved.svg';
import styles from './index.less';
import { TICKET_COUNT_BG_COLOR } from '@/constants/ticketManagement';

const OverallTotal = (props) => {
  const { countData = [], tabName = '' } = props;

  const items = [
    {
      id: 'ASSIGN',
      icon: assignIcon,
      label: tabName === 'ticket-queue' ? 'Tickets in Queue' : 'Assigned Tickets',
      total: tabName === 'ticket-queue' ? countData.totalInQueue : countData.totalAssignee,
    },
    {
      id: 'PRIORITY',
      icon: priorityIcon,
      label: 'High Priority Tickets',
      total: tabName === 'ticket-queue' ? countData.totalHighInQueue : countData.totalHigh,
    },
    {
      id: 'UNRESOLVED',
      icon: unresolvedIcon,
      label: 'Tickets out of SLA',
      total: 'N/A',
    },
  ];

  const renderBlock = ({ id = '', icon = '', label = '', total = '' }) => {
    return (
      <Col span={8}>
        <div className={styles.OverallTotal__cart}>
          <div
            className={styles.icon}
            style={{
              backgroundColor: TICKET_COUNT_BG_COLOR[id] || '#fff',
            }}
          >
            <img src={icon} alt="" />
          </div>
          <div className={styles.OverallTotal__name}>
            <h1>{total || 0}</h1>
            <span>{label}</span>
          </div>
        </div>
      </Col>
    );
  };

  return (
    <div className={styles.OverallTotal}>
      <Row gutter={[24, 24]}>
        {items.map((item) => {
          return renderBlock(item);
        })}
      </Row>
    </div>
  );
};

export default OverallTotal;
