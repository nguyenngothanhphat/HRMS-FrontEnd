import { Row, Col } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'umi';
import DetailTicket from '../../../Approval/components/DetailTicket';
import styles from './index.less';

const PendingApprovalTag = (props) => {
  const {
    item: {
      createdAt: date = '',
      employee: { generalInfo: { legalName, userId } = {} || {} } = {} || {},
    } = {},
    item,
  } = props;

  const [openModal, setOpenModal] = useState(false);

  // RENDER UI
  const renderTag = () => {
    const dateTemp = moment(date).date();
    const monthTemp = moment(date).locale('en').format('MMM');
    return (
      <>
        <Col span={24}>
          <div className={styles.PendingApprovalTag}>
            <Row align="middle" justify="space-between">
              <Col span={20} className={styles.leftPart}>
                <div className={styles.dateTime}>
                  <span>{dateTemp}</span>
                  <span>{monthTemp}</span>
                </div>
                <div className={styles.content}>
                  New Asset request from{' '}
                  <span className={styles.userId}>
                    {legalName} ({userId})
                  </span>{' '}
                  has been received.
                </div>
              </Col>
              <Col span={4} className={styles.rightPart}>
                <div className={styles.viewBtn} onClick={() => setOpenModal(true)}>
                  <span>View</span>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <DetailTicket openModal={openModal} ticket={item} onCancel={() => setOpenModal(false)} />
      </>
    );
  };

  return renderTag();
};

export default connect(() => ({}))(PendingApprovalTag);
