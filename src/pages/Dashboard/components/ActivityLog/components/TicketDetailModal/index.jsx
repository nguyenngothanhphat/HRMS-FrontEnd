import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { Button, Col, Modal, Row, Select, Spin, Steps, Tag } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import { TIMEOFF_STATUS } from '@/constants/timeOff';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import PDFIcon from '@/assets/pdf_icon.png';
import DefaultAvatar from '@/assets/avtDefault.jpg';
import MessageBox from '../MessageBox';
import styles from './index.less';
import { getEmployeeUrl } from '@/utils/utils';
import { PRIORITY_COLOR } from '@/constants/ticketManagement';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';

const { Step } = Steps;
const { Option } = Select;
const { IN_PROGRESS, ACCEPTED, ON_HOLD, REJECTED, DELETED, WITHDRAWN } = TIMEOFF_STATUS;

const TicketDetailModal = (props) => {
  const {
    visible = false,
    onClose = () => {},
    title = '',
    item: {
      id: ticketID = '',
      ticketID: tickIdTimeoff = '',
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
      onDate = '',
      fromDate = '',
      toDate = '',
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
    if (visible && !isEmpty(ccList)) {
      dispatch({
        type: 'dashboard/fetchListEmployee',
        payload: {
          ids: ccList,
        },
      });
    }
  }, [visible, JSON.stringify(ccList)]);

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
        <p className={styles.header__text}>
          {`${typeName.length > 0 ? 'Requestee Detail' : title}`}
        </p>
      </div>
    );
  };

  const handleCancel = () => {
    onClose();
  };
  const renderCCList = () => {
    const intersection = listEmployee.filter((element) => ccList.includes(element._id));
    return (
      <span>
        {intersection.map((val, index) => {
          const { generalInfo: { legalName = '', userId = '' } = {} } = val;
          return (
            <Link to={getEmployeeUrl(userId)}>
              {legalName}
              {index + 1 < intersection.length ? ', ' : ''}
            </Link>
          );
        })}
      </span>
    );
  };

  const attachmentsContent = () => {
    return (
      <span className={styles.attachments}>
        {!isEmpty(attachments)
          ? attachments.map((val, i) => {
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
                <div className={styles.attachments__file} key={`${i + 1}`}>
                  <a href={val.attachmentUrl} target="_blank" rel="noreferrer">
                    {attachmentSlice()}
                  </a>
                  <img className={styles.attachmentsImg} src={PDFIcon} alt="pdf" />
                </div>
              );
            })
          : 'N/A'}
      </span>
    );
  };
  const renderIcon = (url, statusTemp) => {
    return (
      <div className={styles.avatar}>
        <img
          onError={(e) => {
            e.target.src = DefaultAvatar;
          }}
          src={url || DefaultAvatar}
          alt="avatar"
        />
        {statusTemp === REJECTED && <CloseCircleTwoTone twoToneColor="#fd4546" />}
      </div>
    );
  };
  const renderIcon2 = (url) => {
    return (
      <div className={styles.avatar}>
        <img
          onError={(e) => {
            e.target.src = DefaultAvatar;
          }}
          src={url || DefaultAvatar}
          alt="avatar"
        />
        <CheckCircleTwoTone twoToneColor="#52c41a" />
      </div>
    );
  };
  const getFlow = () => {
    const {
      item: {
        employee: { generalInfo: { legalName: ln1 = '', avatar: av1 = '' } = {} } = {},
        approvalManager: { generalInfo: { legalName: ln2 = '', avatar: av2 = '' } = {} } = {},
      } = {},
    } = props;

    const arr = [];
    arr.push({
      name: ln1,
      avatar: av1 || DefaultAvatar,
    });
    arr.push({
      name: ln2,
      avatar: av2 || DefaultAvatar,
    });
    return arr;
  };

  const renderModalContent = () => {
    const content = [
      {
        name: 'Ticket ID',
        value: <span className={styles.ticketID}>{ticketID || tickIdTimeoff}</span>,
        span: 12,
      },
      {
        name: 'Request Date',
        value: moment(requestDate || onDate || createdAt).format(DATE_FORMAT_MDY),
        span: 12,
      },
      {
        name: queryType && queryType.length > 0 ? 'Query Type' : 'Timeoff Type',
        value: queryType || typeName,
        span: 12,
      },
      {
        name: 'Priority',
        value: <Tag color={PRIORITY_COLOR[priority]}>{priority}</Tag>,
        span: 12,
        disabled: typeName.length > 0,
      },
      {
        name: 'Duration',
        value: `${moment(fromDate).format(DATE_FORMAT_MDY)} - ${moment(toDate).format(
          DATE_FORMAT_MDY,
        )}`,
        span: 12,
        disabled: queryType && queryType.length > 0,
      },
      {
        name: 'Subject',
        value: subject,
        span: 12,
      },
      {
        name: 'CC',
        value: (
          <span>{loadingFetchListEmployee && !isEmpty(ccList) ? <Spin /> : renderCCList()}</span>
        ),
        span: 12,
        disabled: typeName.length > 0,
      },
      {
        name: 'Attachments',
        value: attachmentsContent(),
        span: 24,
      },
      {
        name: 'Description',
        value: description,
        span: 24,
      },
    ];
    const people = getFlow();
    return (
      <div className={styles.container}>
        <div className={styles.container__details}>
          <div className={styles.abovePart}>
            <Row gutter={[16, 16]}>
              {content.map(
                (val) =>
                  !val.disabled && (
                    <Col span={val.span} key={val.name}>
                      <div>
                        <span className={styles.title}>{val.name}</span>:{' '}
                        <span className={styles.value}>{val.value}</span>
                      </div>
                    </Col>
                  ),
              )}
            </Row>
          </div>
          <div className={styles.belowPart}>
            {queryType && queryType.length > 0 ? (
              <>
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
                  <CustomPrimaryButton
                    disabled={status === 'New' || status === 'IN-PROGRESS'}
                    onClick={handleUpdateStatus}
                  >
                    Update
                  </CustomPrimaryButton>
                </div>
              </>
            ) : (
              <div className={styles.content}>
                <span className={styles.title}>Chain of approval</span>
                <Steps current={status === IN_PROGRESS ? 1 : 2} labelPlacement="vertical">
                  {people.map((value, index) => {
                    const { avatar = '', name = '' } = value;
                    return (
                      <Step
                        key={`${index + 1}`}
                        icon={
                          status === DELETED ? (
                            renderIcon(avatar)
                          ) : (
                            <>
                              {index === 0 && renderIcon2(avatar)}
                              {index === 1 && (
                                <>
                                  {status === REJECTED && renderIcon(avatar, REJECTED)}
                                  {(status === IN_PROGRESS || status === WITHDRAWN) &&
                                    renderIcon(avatar)}
                                  {(status === ACCEPTED || status === ON_HOLD) &&
                                    renderIcon2(avatar)}
                                </>
                              )}
                            </>
                          )
                        }
                        title={name}
                      />
                    );
                  })}
                </Steps>
              </div>
            )}
          </div>
        </div>
        {queryType && queryType.length > 0 && <MessageBox chats={chats} item={item} />}
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
