import { Row, Col, Tooltip, notification } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'umi';
import DetailTicket from '../../../Approval/components/DetailTicket';
import RejectCommentModal from './components/RejectCommentModal';
import ViewIcon from '@/assets/dashboard/open.svg';
import ApproveIcon from '@/assets/dashboard/approve.svg';
import CancelIcon from '@/assets/dashboard/cancel.svg';
import styles from './index.less';

const PendingApprovalTag = (props) => {
  const {
    item: {
      createdAt: date = '',
      employee: { generalInfo: { legalName = '', userId = '' } = {} || {} } = {} || {},
      type: { typeName = '' } = {} || {},
      typeTicket = '',
      ticketID = '',
      _id = '',
    } = {},
    item,
    loadingReject = false,
    refreshData = () => {},
    dispatch,
  } = props;
  const [openModal, setOpenModal] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);

  const onApproveClick = async (idProp) => {
    const res = await dispatch({
      type: 'timeOff/approveRequest',
      payload: {
        _id: idProp,
      },
    });
    const { statusCode = 0 } = res;
    if (statusCode === 200) {
      refreshData();
      notification.success({
        message: 'The ticket has been approved',
      });
    }
  };

  const onReject = async (comment) => {
    const res = await dispatch({
      type: 'timeOff/rejectRequest',
      payload: {
        _id,
        comment,
      },
    });
    const { statusCode = 0 } = res;
    if (statusCode === 200) {
      setCommentModalVisible(false);
      refreshData();
      notification.success({
        message: 'The ticket has been rejected',
      });
    }
  };

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
                  New {typeName && typeTicket === 'leaveRequest' ? 'Timeoff' : 'Comoff'} request
                  from{' '}
                  <span className={styles.userId}>
                    {legalName} ({userId})
                  </span>{' '}
                  has been received.
                </div>
              </Col>
              <Col span={4} className={styles.rightPart}>
                <div className={styles.viewBtn} onClick={() => setOpenModal(true)}>
                  <Tooltip title="View">
                    <img src={ViewIcon} alt="View Icon" />
                  </Tooltip>
                </div>
                <div className={styles.viewBtn} onClick={() => onApproveClick(_id)}>
                  <Tooltip title="Approve">
                    <img src={ApproveIcon} alt="Approve Icon" />
                  </Tooltip>
                </div>
                <div className={styles.viewBtn} onClick={() => setCommentModalVisible(true)}>
                  <Tooltip title="Reject">
                    <img src={CancelIcon} alt="Cancel Icon" />
                  </Tooltip>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <DetailTicket openModal={openModal} ticket={item} onCancel={() => setOpenModal(false)} />
        <RejectCommentModal
          visible={commentModalVisible}
          onClose={() => setCommentModalVisible(false)}
          onReject={onReject}
          ticketID={ticketID}
          loading={loadingReject}
        />
      </>
    );
  };

  return renderTag();
};

export default connect(({ loading }) => ({
  loadingReject: loading.effects['timeOff/rejectRequest'],
}))(PendingApprovalTag);
