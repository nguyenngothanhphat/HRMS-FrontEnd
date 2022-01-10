import { Modal, Button, Row, Col, Input } from 'antd';
import React, { useState } from 'react';
import { DownOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'umi';
import styles from './index.less';

const DetailTicket = (props) => {
  const {
    openModal,
    onCancel,
    ticket: {
      _id,
      ticketID = '',
      assignee = {},
      employee = {},
      status = '',
      createdAt = '',
      fromDate = '',
      toDate = '',
      type = {},
      subject = '',
      description = '',
      typeTicket = '',
    },
    dispatch,
    loadingApprovel,
    loadingReject,
  } = props;
  const [showDetail, setShowDetail] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const onApproval = async () => {
    const response = await dispatch({
      type: 'dashboard/approvalTicket',
      payload: {
        typeTicket,
        _id,
        comment,
      },
      statusTimeoff: 'approval',
    });
    const { statusCode = '' } = response;
    if (statusCode === 200) onCancel();
  };
  const onReject = async () => {
    const response = await dispatch({
      type: 'dashboard/rejectTicket',
      payload: {
        typeTicket,
        _id,
        comment,
      },
      statusTimeoff: 'reject',
    });
    const { statusCode = '' } = response;
    if (statusCode === 200) onCancel();
  };
  const viewDetail = () => {
    setShowDetail(!showDetail);
  };

  const {
    generalInfo: { legalName, userId } = {},
    departmentInfo: { name: departmentName = '' } = {},
  } = employee;
  const { generalInfoInfo: { legalName: legalNameManager = '', userIdManager = '' } = {} } =
    assignee;
  const { name: requestType = '', typeName = '' } = type;
  return (
    <Modal
      className={styles.modalCustom}
      visible={openModal}
      onCancel={onCancel}
      style={{ top: 50 }}
      destroyOnClose
      title={`Approval Request - #${ticketID}`}
      maskClosable={false}
      width={600}
      footer={[
        <Button
          key="cancel"
          className={styles.btnCancel}
          onClick={onReject}
          loading={loadingReject}
        >
          Reject
        </Button>,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          onClick={onApproval}
          className={styles.btnSubmit}
          loading={loadingApprovel}
        >
          Approve
        </Button>,
      ]}
    >
      <>
        <div className={styles.ticketInfo}>
          <Row className={styles.ticketInfo__row}>
            <Col span={8} className={styles.title}>
              Requester's Name:
            </Col>
            <Col span={16} className={styles.contain}>
              {legalName} ({userId})
            </Col>
          </Row>
          <Row className={styles.ticketInfo__row}>
            <Col span={8} className={styles.title}>
              Requester's Manager:
            </Col>
            <Col span={16} className={styles.contain}>
              {legalNameManager} {userIdManager && { userIdManager }}
            </Col>
          </Row>
          <Row className={styles.ticketInfo__row}>
            <Col span={8} className={styles.title}>
              Requester's Department:
            </Col>
            <Col span={16} className={styles.contain}>
              {departmentName}
            </Col>
          </Row>
          <Row className={styles.ticketInfo__row}>
            <Col span={8} className={styles.title}>
              Request Date:
            </Col>
            <Col span={16} className={styles.contain}>
              {moment(createdAt).locale('en').format('DD/MM/YYYY')}
            </Col>
          </Row>
          <Row className={styles.ticketInfo__row}>
            <Col span={8} className={styles.title}>
              Request Type:
            </Col>
            <Col span={16} className={styles.contain}>
              {typeName}
            </Col>
          </Row>
          {subject && (
            <Row className={styles.ticketInfo__row}>
              <Col span={8} className={styles.title}>
                Request Reason:
              </Col>
              <Col span={16} className={styles.contain}>
                {subject}
              </Col>
            </Row>
          )}
          {showDetail && (
            <div className={styles.ticketInfo__more}>
              <Row className={styles.ticketInfo__row}>
                <Col span={8} className={styles.title}>
                  Ticket ID:
                </Col>
                <Col span={16} className={styles.contain}>
                  <span className={styles.blueText}> {ticketID}</span>
                </Col>
              </Row>
              <Row className={styles.ticketInfo__row}>
                <Col span={8} className={styles.title}>
                  Leave Type:
                </Col>
                <Col span={16} className={styles.contain}>
                  {requestType}
                </Col>
              </Row>
              <Row className={styles.ticketInfo__row}>
                <Col span={8} className={styles.title}>
                  Leave duration:
                </Col>
                <Col span={16} className={styles.contain}>
                  {moment(fromDate).locale('en').format('DD.MM.YYYY')}-{' '}
                  {moment(toDate).locale('en').format('DD.MM.YYYY')}
                </Col>
              </Row>
              <Row className={styles.ticketInfo__row}>
                <Col span={8} className={styles.title}>
                  Requested on:
                </Col>
                <Col span={16} className={styles.contain}>
                  {moment(createdAt).locale('en').format('DD.MM.YYYY')}
                </Col>
              </Row>
              {description && (
                <Row className={styles.ticketInfo__row}>
                  <Col span={8} className={styles.title}>
                    Description:
                  </Col>
                  <Col span={16} className={styles.contain}>
                    {description}
                  </Col>
                </Row>
              )}
              <Row className={styles.ticketInfo__row}>
                <Col span={8} className={styles.title}>
                  Status:
                </Col>
                <Col span={16} className={styles.contain}>
                  <span className={styles.status}>{status}</span>
                </Col>
              </Row>
            </div>
          )}
          <Row className={styles.ticketInfo__detail} onClick={viewDetail}>
            Request Details <DownOutlined rotate={showDetail ? 180 : 0} />
          </Row>
        </div>
        <div className={styles.addComment} onClick={() => setShowComment(!showComment)}>
          {showComment ? <MinusOutlined /> : <PlusOutlined />} Add Comments
        </div>
        {showComment && (
          <Input.TextArea
            placeholder="Type here..."
            className={styles.comment}
            onChange={(e) => setComment(e.target.value)}
          />
        )}
      </>
    </Modal>
  );
};
export default connect(({ loading }) => ({
  loadingApprovel: loading.effects['dashboard/approvalTicket'],
  loadingReject: loading.effects['dashboard/rejectTicket'],
}))(DetailTicket);
