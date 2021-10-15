import React, { useState } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import s from './index.less';
import DetailTicket from './DetailTicket/index';

const TicketItem = (props) => {
  const {
    infoTicket: {
      createdAt = '',
      employee: {
        generalInfo: { legalName, userId },
      },
    } = {},
    infoTicket,
  } = props;

  const [openModal, setOpenModal] = useState(false);
  return (
    <Row className={s.container}>
      <Col span={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={s.date}>
          <span>{moment(createdAt).locale('en').format('DD')}</span>
          <span>{moment(createdAt).locale('en').format('MMM')}</span>
        </div>
      </Col>
      <Col span={15}>
        <p className={s.description}>
          New Asset request from {legalName} <strong>[{userId}]</strong> has been received.
        </p>
      </Col>
      <Col span={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className={s.view} onClick={() => setOpenModal(true)}>
          View
        </div>
      </Col>
      <DetailTicket
        openModal={openModal}
        ticket={infoTicket}
        onCancel={() => setOpenModal(false)}
      />
    </Row>
  );
};

export default TicketItem;
