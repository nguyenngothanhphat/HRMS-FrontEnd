import { Row, Col } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
import styles from './index.less';
import TicketDetailModal from '../TicketDetailModal';

const TicketTag = (props) => {
  const { item: itemProp = {}, dispatch } = props;
  const [openModal, setOpenModal] = useState(false);

  // RENDER UI
  const renderTag = (item) => {
    const {
      created_at: onDate = '',
      id: ticketID = '',
      status = '',
      request_type: typeName = '',
      cc_list: ccList,
    } = item;
    useEffect(() => {
      if (!isEmpty(ccList)) {
        dispatch({
          type: 'dashboard/fetchListEmployee',
          payload: {
            employees: ccList,
          },
        });
      }
    }, []);
    const dateTemp = moment(onDate).date();
    const monthTemp = moment(onDate).locale('en').format('MMM');
    return (
      <Col span={24}>
        <div className={styles.TicketTag}>
          <Row align="middle" justify="space-between">
            <Col span={20} className={styles.leftPart}>
              <div className={styles.dateTime}>
                <span>{dateTemp}</span>
                <span>{monthTemp}</span>
              </div>
              <div className={styles.content}>
                <span className={styles.userId}>[Ticket ID #{ticketID}]</span> Support request
                regarding {typeName} is {status}
              </div>
            </Col>
            <Col span={4} className={styles.rightPart} onClick={() => setOpenModal(true)}>
              <div className={styles.viewBtn}>
                <span>View</span>
              </div>
            </Col>
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
