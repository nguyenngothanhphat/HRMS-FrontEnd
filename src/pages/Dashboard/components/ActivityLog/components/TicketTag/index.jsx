import { Row, Col } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'umi';

import styles from './index.less';
import TicketDetailModal from '../TicketDetailModal';

const TicketTag = (props) => {
  const { item: itemProp = {} } = props;
  const [openModal, setOpenModal] = useState(false);

  // RENDER UI
  const renderTag = (item) => {
    const {
      created_at: onDateSupportRequest = '',
      id: ticketID = '',
      status = '',
      query_type: typeNameSupportRequest = '',
      onDate = '',
      fromDate = '',
      toDate = '',
      ticketID: ticketIDTimeoff = '',
    } = item;

    const dateTemp = moment(onDateSupportRequest).date();
    const dateTempTimeoff = moment(onDate).date();
    const monthTemp = moment(onDateSupportRequest).locale('en').format('MMM');
    const monthTempTimeoff = moment(onDate).locale('en').format('MMM');
    return (
      <Col span={24}>
        <div className={styles.TicketTag}>
          <Row align="middle" justify="space-between">
            {onDate ? (
              <>
                <Col span={20} className={styles.leftPart}>
                  <div className={styles.dateTime}>
                    <span>{dateTempTimeoff}</span>
                    <span>{monthTempTimeoff}</span>
                  </div>
                  <div className={styles.content}>
                    <span className={styles.userId}>[Ticket ID #{ticketIDTimeoff}]</span> Timeoff
                    Ticket from {moment(fromDate).locale('en').format('MMM DD YYYY')} to{' '}
                    {moment(toDate).locale('en').format('MMM DD YYYY')} is {status}
                  </div>
                </Col>
                <Col span={4} className={styles.rightPart} onClick={() => setOpenModal(true)}>
                  <div className={styles.viewBtn}>
                    <span>View</span>
                  </div>
                </Col>
              </>
            ) : (
              <>
                <Col span={20} className={styles.leftPart}>
                  <div className={styles.dateTime}>
                    <span>{dateTemp}</span>
                    <span>{monthTemp}</span>
                  </div>
                  <div className={styles.content}>
                    <span className={styles.userId}>[Ticket ID #{ticketID}]</span> Support request
                    regarding {typeNameSupportRequest} is {status}
                  </div>
                </Col>
                <Col span={4} className={styles.rightPart} onClick={() => setOpenModal(true)}>
                  <div className={styles.viewBtn}>
                    <span>View</span>
                  </div>
                </Col>
              </>
            )}
          </Row>
        </div>
      </Col>
    );
  };

  return (
    <>
      {renderTag(itemProp)}
      <TicketDetailModal
        visible={openModal}
        onClose={() => setOpenModal(false)}
        title="Ticket Details"
        item={itemProp}
      />
    </>
  );
};

export default connect(() => ({}))(TicketTag);
