import { Row, Col, Tooltip } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'umi';
import DetailTicket from '../../../Approval/components/DetailTicket';
import RejectCommentModal from './components/RejectCommentModal';
import ViewIcon from '@/assets/dashboard/open.svg';
import ApproveIcon from '@/assets/dashboard/approve.svg';
import CancelIcon from '@/assets/dashboard/cancel.svg';
import { TYPE_TICKET_APPROVAL } from '@/utils/dashboard';
import styles from './index.less';

const PendingApprovalTag = (props) => {
  const {
    item: {
      createdAt: date = '',
      employee: { generalInfo: { legalName = '', userId = '' } = {} || {} } = {} || {},
      employeeInfo: { legalName: nameTimeSheet = '', userId: userTimeSheet = '' } = {} || {},
      type: { typeName = '' } = {} || {},
      typeTicket = '',
      ticketID = '',
      ticketId = '',
      _id = '',
    } = {},
    item,
    loadingReject = false,
    refreshData = () => {},
    dispatch,
  } = props;
  const [openModal, setOpenModal] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [viewedDetail, setViewedDetail] = useState(false);
  const onApproveClick = async (itemProp) => {
    let response = {};
    if (typeTicket === TYPE_TICKET_APPROVAL.LEAVE_REQUEST) {
      response = await dispatch({
        type: 'dashboard/approveRequest',
        payload: {
          typeTicket,
          _id: itemProp._id,
        },
        statusTimeoff: 'approval',
      });
      const { statusCode = '' } = response;
      if (statusCode === 200) {
        refreshData();
      }
    } else {
      response = await dispatch({
        type: 'dashboard/approveTimeSheetRequest',
        payload: {
          status: 'APPROVED',
          ticketId: itemProp.ticketId,
        },
      });
      const { code = '' } = response;
      if (code === 200) {
        refreshData();
      }
    }
  };

  const onReject = async (comment) => {
    let response = {};
    if (typeTicket === TYPE_TICKET_APPROVAL.LEAVE_REQUEST) {
      response = await dispatch({
        type: 'dashboard/rejectRequest',
        payload: {
          typeTicket,
          _id,
          comment,
        },
      });
      const { statusCode = '' } = response;
      if (statusCode === 200) {
        refreshData();
        setCommentModalVisible(false);
      }
    } else {
      response = await dispatch({
        type: 'dashboard/rejectTimeSheetRequest',
        payload: {
          status: 'REJECTED',
          ticketId,
          comment,
        },
      });
      const { code = '' } = response;
      if (code === 200) {
        refreshData();
        setCommentModalVisible(false);
      }
    }
  };

  const handleViewDetail = () => {
    setOpenModal(true);
    setViewedDetail(true);
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
                  New{' '}
                  {typeTicket === TYPE_TICKET_APPROVAL.LEAVE_REQUEST ? (
                    <span className={styles.timeoffType}>Timeoff</span>
                  ) : (
                    <span className={styles.timesheetType}>Timesheet</span>
                  )}{' '}
                  request from{' '}
                  <span>
                    {typeTicket === TYPE_TICKET_APPROVAL.LEAVE_REQUEST
                      ? `${legalName}(${userId})`
                      : `${nameTimeSheet}(${userTimeSheet})`}
                  </span>{' '}
                  has been received.
                </div>
              </Col>
              <Col span={4} className={styles.rightPart}>
                <div className={styles.viewBtn} onClick={handleViewDetail}>
                  <Tooltip title="View">
                    <img src={ViewIcon} alt="View Icon" />
                  </Tooltip>
                </div>
                <div className={styles.viewBtn} onClick={() => onApproveClick(item)}>
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
        <DetailTicket
          openModal={openModal}
          viewedDetail={viewedDetail}
          ticket={item}
          onCancel={() => setOpenModal(false)}
          setViewedDetail={setViewedDetail}
          refreshData={refreshData}
        />
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
  loadingReject: loading.effects['dashboard/rejectRequest'],
}))(PendingApprovalTag);
