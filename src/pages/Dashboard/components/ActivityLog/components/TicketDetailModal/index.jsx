import { Button, Col, Modal, Row, Select, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
import PDFIcon from '@/assets/pdf_icon.png';
import MessageBox from '../MessageBox';
import styles from './index.less';

const { Option } = Select;

const TicketDetailModal = (props) => {
  const {
    visible = false,
    title = '',
    onClose = () => {},
    item: {
      id: ticketID = '',
      ticketID: tickIdTiemoff = '',
      created_at: requestDate = '',
      createdAt = '',
      query_type: queryType = '',
      type: { typeName = '' } = {},
      priority = '',
      subject = '',
      cc_list: ccList = [],
      attachments = [],
      description = '',
      status = '',
      department_assign: departmentAssign = '',
      employee_assignee: employeeAssignee = '',
      employee_raise: employeeRaise = '',
      chats = [],
    } = {},
    item = {},
    listEmployee = [],
    loadingFetchListEmployee = false,
    dispatch,
  } = props;
  const [statusState, setStatus] = useState('');
  useEffect(() => {
    setStatus(status);
  }, []);
  useEffect(() => {
    if (!isEmpty(ccList)) {
      dispatch({
        type: 'dashboard/fetchListEmployee',
        payload: {
          // employees: ccList,
        },
      });
    }
  }, []);
  const handleUpdateStatus = () => {
    const { employee: { _id: employeeID = '' } = {} } = props;
    const payload = {
      id: ticketID,
      status: statusState,
      priority,
      description,
      subject,
      ccList,
      queryType,
      attachments,
      departmentAssign,
      employeeRaise,
      employeeAssignee,
      employee: employeeID,
    };

    if (statusState && statusState !== status && status !== 'New') {
      dispatch({
        type: 'dashboard/updateTicket',
        payload,
      });
    }
  };

  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  const handleCancel = () => {
    onClose();
  };
  const renderccList = () => {
    const intersection = listEmployee.filter((element) => ccList.includes(element._id));
    return intersection.map((val) => {
      const { generalInfo: { legalName = '' } = {} } = val;
      return <span style={{ paddingRight: '8px' }}>{legalName || ''}</span>;
    });
  };
  const getColor = () => {
    switch (priority) {
      case 'High':
        return '#ffb6b6';
      case 'Normal':
        return '#eefffb';
      case 'Low':
        return '#ffe9c5';
      case 'Urgent':
        return '#FF8484';
      default:
        return '#ffffff';
    }
  };
  const attchementsContent = () => {
    return (
      <span className={styles.attachments}>
        {!isEmpty(attachments)
          ? attachments.map((val) => {
              const attachmentSlice = () => {
                if (val.attachmentName) {
                  if (val.attachmentName.length > 35) {
                    return `${val.attachmentName.substr(0, 8)}...${val.attachmentName.substr(
                      val.attachmentName.length - 6,
                      val.attachmentName.length,
                    )}`;
                  }
                  return val.attachmentName;
                }
                return '';
              };

              return (
                <span className={styles.attachments__file}>
                  <a href={val.attachmentUrl} target="_blank" rel="noreferrer">
                    {attachmentSlice()}
                  </a>
                  <img className={styles.attachmentsImg} src={PDFIcon} alt="pdf" />
                </span>
              );
            })
          : ''}
      </span>
    );
  };
  const renderModalContent = () => {
    const content = [
      {
        name: 'Ticket ID',
        value: <span className={styles.ticketID}>{ticketID || tickIdTiemoff}</span>,
        span: 12,
      },
      {
        name: 'Request Date',
        value: moment(requestDate || createdAt).format('DD/MM/YYYY'),
        span: 12,
      },
      {
        name: 'Query Type',
        value: queryType || typeName,
        span: 12,
      },
      {
        name: 'Priority',
        value: (
          <span className={styles.priority} style={{ background: getColor() }}>
            {priority}
          </span>
        ),
        span: 12,
      },
      {
        name: 'Subject',
        value: subject,
        span: 12,
      },
      {
        name: 'CC',
        value: (
          <span>{loadingFetchListEmployee && !isEmpty(ccList) ? <Spin /> : renderccList()}</span>
        ),
        span: 12,
      },
      {
        name: 'Attachments',
        value: attchementsContent(),
        span: 24,
      },
      {
        name: 'Description',
        value: description,
        span: 24,
      },
    ];
    return (
      <div className={styles.container}>
        <div className={styles.container__details}>
          <div className={styles.abovePart}>
            <Row gutter={[16, 16]}>
              {content.map((val) => (
                <Col span={val.span}>
                  <div>
                    <span className={styles.title}>{val.name}</span>:{' '}
                    <span className={styles.value}>{val.value}</span>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          <div className={styles.belowPart}>
            <div className={styles.status}>
              <span>Status:</span>
              <Select value={statusState} onChange={(value) => setStatus(value)}>
                <Option value="Assigned">Assigned</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Client Pending">Client Pending</Option>
                <Option value="Resolved">Resolved</Option>
                <Option value="Closed">Closed</Option>
              </Select>
            </div>
            <div className={styles.actionButton}>
              <Button
                disabled={status === 'New' || status === 'IN-PROGRESS'}
                onClick={handleUpdateStatus}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
        <MessageBox chats={chats} item={item} />
      </div>
    );
  };

  return (
    <Modal
      className={`${styles.TicketDetailModal} ${styles.withPadding}`}
      onCancel={handleCancel}
      destroyOnClose
      footer={null}
      title={renderModalHeader()}
      centered
      visible={visible}
      width={700}
    >
      {renderModalContent()}
    </Modal>
  );
};

export default connect(
  ({
    user: { currentUser: { employee = {} } } = {},
    loading,
    dashboard: { listEmployee = [] } = {},
  }) => ({
    employee,
    listEmployee,
    loadingUpdateStatus: loading.effects['dashboard/updateStatus'],
    loadingFetchListEmployee: loading.effects['dashboard/fetchListEmployee'],
  }),
)(TicketDetailModal);
