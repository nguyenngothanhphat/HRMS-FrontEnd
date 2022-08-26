import { Avatar, Card, Col, Input, Row, Spin, Tag, Timeline, Tooltip, Upload } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect, Link } from 'umi';
import AttachmenUploadIcon from '@/assets/attach-upload.svg';
import DefaultAvatar from '@/assets/avtDefault.jpg';
import ImageIcon from '@/assets/image_icon.png';
import PDFIcon from '@/assets/pdf_icon.png';
import TrashIcon from '@/assets/ticketManagement-trashIcon.svg';
import AttachmentIcon from '@/assets/ticketsManagement-attach.svg';
import CustomBlueButton from '@/components/CustomBlueButton';
import CustomEditButton from '@/components/CustomEditButton';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import { PRIORITY_COLOR } from '@/constants/ticketManagement';
import { FILE_TYPE } from '@/constants/upload';
import { beforeUpload, compressImage, identifyFile } from '@/utils/upload';
import { getEmployeeUrl } from '@/utils/utils';
import AssignTeamModal from '../../AssignTeamModal';
import EditTicketModal from '../../EditTicketModal';
import TicketUpdatedContent from '../TicketUpdatedContent';
import styles from './index.less';

const { TextArea } = Input;
const { Dragger } = Upload;

const TicketDetailsForm = (props) => {
  const {
    ticketDetail = {},
    loadingUploadAttachment = false,
    loadingAddChat = false,
    roles = [],
    permissions = {},
    refreshData = () => {},
  } = props;

  const {
    id = '',
    priority = '',
    description = '',
    subject = '',
    created_at: requestDate = '',
    query_type: queryType = '',
    attachments = [],
    chats = [],
    employeeRaise = {},
    ccList = [],
    employee_assignee: employeeAssignedTickets = '',
  } = ticketDetail;

  const [value, setValue] = React.useState('');
  const [uploadedFileList, setUploadedFileList] = React.useState([]);
  const [fileNameList, setFileNameList] = React.useState([]);
  const [arrayChats, setArrayChats] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editVisible, setEditVisible] = React.useState(false);

  useEffect(() => {
    if (chats?.length) setArrayChats(chats.reverse());
    else setArrayChats([]);
  }, [chats]);

  const findRole = () => {
    const manager = roles.find((item) => item === 'MANAGER');
    const hrManager = roles.find((item) => item === 'HR-MANAGER');
    const role = hrManager || manager || 'EMPLOYEE';
    return role;
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const handlePreview = (nameFile, idFile) => {
    const arrFileName = [...fileNameList];
    arrFileName.push({ nameFile, idFile });
    setFileNameList(arrFileName);
  };

  const handleUpload = async (file) => {
    const { dispatch } = props;
    const arrFile = [...uploadedFileList];
    const compressedFile = await compressImage(file);
    const formData = new FormData();
    formData.append('blob', compressedFile, file.name);

    dispatch({
      type: 'ticketManagement/uploadFileAttachments',
      payload: formData,
    }).then((resp) => {
      const { data = [] } = resp;
      const fileUploaded = data.length > 0 ? data[0] : {};
      arrFile.push(fileUploaded);
      const { name = '', id: idTemp } = fileUploaded;
      setUploadedFileList(arrFile);
      handlePreview(name, idTemp);
    });
  };

  const handleRemove = (idFile) => {
    const filterUploadedFile = uploadedFileList.filter((item) => item.id !== idFile);
    const filterFileName = fileNameList.filter((item) => item.idFile !== idFile);
    setUploadedFileList(filterUploadedFile);
    setFileNameList(filterFileName);
  };

  const handleSubmit = () => {
    const { dispatch, ticketDetail: { id: idTicket = '' } = {}, employee } = props;
    const { _id = '' } = employee;
    const createdAt = moment();
    const documents = uploadedFileList?.map((item) => {
      return {
        attachment: item.id,
        attachmentName: item.name,
        attachmentUrl: item.url,
      };
    });

    if (value !== '') {
      if (!isEmpty(uploadedFileList)) {
        const payload = {
          id: idTicket,
          chat: {
            employee: _id,
            message: value,
            attachments: documents,
            createdAt,
          },
        };

        dispatch({
          type: 'ticketManagement/addChat',
          payload,
        }).then((response) => {
          const { statusCode } = response;
          if (statusCode === 200) {
            setUploadedFileList([]);
            setValue('');
            setFileNameList([]);
          }
        });
      } else {
        const payload = {
          id: idTicket,
          chat: {
            employee: _id,
            message: value,
            createdAt: requestDate,
          },
        };
        dispatch({
          type: 'ticketManagement/addChat',
          payload,
        }).then((response) => {
          const { statusCode } = response;
          if (statusCode === 200) {
            setValue('');
          }
        });
      }
    }
  };

  const role = findRole(roles);
  const checkRole = ['MANAGER', 'HR-MANAGER'].includes(role);
  const checkPermission = permissions.viewTicketByAdmin === 1;
  const isAppendTicket = permissions.appendTicket === 1;

  const avatarTicket = () => {
    return ccList.map((val) => {
      const { generalInfo: { avatar = '', legalName = '' } = {} } = val;
      if (avatar !== '') {
        return (
          <Tooltip placement="top" title={legalName}>
            <Avatar src={avatar} />
          </Tooltip>
        );
      }
      return (
        <Tooltip placement="top" title={legalName}>
          <Avatar src={avatar} />
        </Tooltip>
      );
    });
  };

  const getOpenBy = () => {
    if (!isEmpty(employeeRaise)) {
      return (
        <Link to={getEmployeeUrl(employeeRaise?.generalInfo?.userId)}>
          {employeeRaise?.generalInfo?.legalName}
        </Link>
      );
    }
    return '';
  };

  const getAttachmentChat = (val) => {
    if (!isEmpty(val)) {
      return val.map((e) => {
        const attachmentSlice = () => {
          if (e.attachmentName.length > 35) {
            return `${e.attachmentName.substr(0, 8)}...${e.attachmentName.substr(
              e.attachmentName.length - 6,
              e.attachmentName.length,
            )}`;
          }
          return e.attachmentName;
        };
        return (
          <div className={styles.attachments__file}>
            <img className={styles.attachments__file__img} src={PDFIcon} alt="pdf" />
            <a href={e.attachmentUrl} target="_blank" rel="noreferrer">
              {attachmentSlice()}
            </a>
          </div>
        );
      });
    }
    return '';
  };

  return (
    <div className={styles.TicketDetails}>
      <Card
        title="Ticket Details"
        extra={
          <div style={{ display: 'flex' }}>
            <CustomEditButton
              onClick={() => setEditVisible(true)}
              disabled={loadingAddChat}
              style={{ border: '1px solid #2c6df9', borderRadius: 15 }}
            />
            {(checkRole || checkPermission || isAppendTicket) && (
              <CustomBlueButton
                style={{ marginLeft: 12, borderRadius: 15 }}
                onClick={() => setModalVisible(true)}
                disabled={loadingAddChat}
              >
                Move To
              </CustomBlueButton>
            )}
          </div>
        }
      >
        <div className={styles.formContent}>
          <Row gutter={[24, 16]} className={styles.information}>
            <Col span={8} className={styles.formContent__title}>
              Ticket ID: <span className={styles.formContent__title__color}>{id}</span>
            </Col>
            <Col span={8} className={styles.formContent__title}>
              Request Date: <span>{moment(requestDate).format(DATE_FORMAT_MDY)}</span>
            </Col>
            <Col span={8} className={styles.formContent__title}>
              Opened by: <span>{getOpenBy()}</span>
            </Col>

            <Col span={8} className={styles.formContent__title}>
              Query Type: <span>{queryType}</span>
            </Col>
            <Col span={8} className={styles.formContent__priority}>
              Priority:
              <Tag color={PRIORITY_COLOR[priority]}>{priority}</Tag>
            </Col>
            <Col span={8} className={styles.formContent__title}>
              Subject: <span>{subject}</span>
            </Col>

            <Col span={8} className={styles.formContent__titleQC}>
              CC:
              <span>
                {!isEmpty(ccList) ? (
                  <Avatar.Group
                    maxCount={2}
                    maxStyle={{
                      color: '#f56a00',
                      backgroundColor: '#fde3cf',
                    }}
                  >
                    {avatarTicket()}
                  </Avatar.Group>
                ) : (
                  ''
                )}
              </span>
            </Col>

            <Col span={16} className={styles.formContent__attachments}>
              Attachments:
              <div className={styles.attachments}>
                {!isEmpty(attachments) ? (
                  attachments.map((val) => {
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
                      <div className={styles.attachments__file}>
                        <a href={val.attachmentUrl} target="_blank" rel="noreferrer">
                          {attachmentSlice()}
                        </a>
                        <img className={styles.attachments__file__img} src={PDFIcon} alt="pdf" />
                      </div>
                    );
                  })
                ) : (
                  <span style={{ paddingLeft: '8px' }}> _ </span>
                )}
              </div>
            </Col>

            <Col span={24} className={styles.formContent__title}>
              Description:
            </Col>

            <Col span={16}>{description}</Col>
          </Row>

          <div className={styles.note}>
            <div className={styles.note__title}>Notes</div>
            <div className={styles.note__textareaContent}>
              <TextArea
                value={value}
                onChange={onChange}
                placeholder="Type your message here..."
                autoSize={{ minRows: 3, maxRows: 6 }}
                className={styles.note__textarea}
              />
              <Col xs={24} className={styles.btnAttach}>
                <Dragger
                  beforeUpload={(file) => beforeUpload(file, [FILE_TYPE.IMAGE, FILE_TYPE.PDF], 2)}
                  showUploadList={false}
                  action={(file) => handleUpload(file)}
                  multiple
                >
                  {isEmpty(fileNameList) ? (
                    <>
                      {loadingUploadAttachment ? (
                        <Spin />
                      ) : (
                        <div className={styles.chooseFile}>
                          <img className={styles.uploadIcon} src={AttachmentIcon} alt="upload" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={styles.fileUploadedContainer}>
                      <div className={styles.dragAndDrop}>
                        <img className={styles.uploadIcon} src={AttachmentIcon} alt="upload" />
                      </div>
                    </div>
                  )}
                </Dragger>
                <>
                  {fileNameList.map((item) => (
                    <div className={styles.fileUploadedContainer__listFiles}>
                      <div className={styles.fileUploadedContainer__listFiles__files}>
                        <div className={styles.previewIcon}>
                          {identifyFile(item.nameFile) === FILE_TYPE.PDF ? (
                            <img src={AttachmenUploadIcon} alt="pdf" />
                          ) : (
                            <img src={ImageIcon} alt="img" />
                          )}
                        </div>
                        <div className={styles.fileName}>
                          <a>
                            {item.nameFile.length > 35
                              ? `${item.nameFile.substr(0, 8)}...${item.nameFile.substr(
                                  item.nameFile.length - 6,
                                  item.nameFile.length,
                                )}`
                              : item.nameFile}
                          </a>
                        </div>
                      </div>
                      <Tooltip title="Remove">
                        <img
                          onClick={() => handleRemove(item.idFile)}
                          className={styles.trashIcon}
                          src={TrashIcon}
                          alt="remove"
                        />
                      </Tooltip>
                    </div>
                  ))}
                </>
              </Col>
            </div>
          </div>
          <div className={styles.tree}>
            <div className={styles.btnSend}>
              <CustomPrimaryButton
                htmlType="submit"
                loading={loadingAddChat}
                onClick={handleSubmit}
                backgroundColor="#2c6df9"
                disabled={loadingAddChat}
              >
                Send
              </CustomPrimaryButton>
            </div>
            <div className={styles.timeline}>
              <Row>
                <Col span={24}>
                  <Timeline mode="alternate">
                    {arrayChats.map((item) => {
                      const {
                        employee: {
                          generalInfo: { avatar = '' } = {},
                          id: employeeChatID = '',
                        } = {},
                      } = item;

                      return (
                        <Timeline.Item
                          position={employeeChatID === employeeAssignedTickets ? 'right' : 'left'}
                          dot={
                            <Avatar
                              size={40}
                              className={styles.avatar}
                              src={
                                <img
                                  src={avatar || DefaultAvatar}
                                  alt=""
                                  onError={(e) => {
                                    e.target.src = DefaultAvatar;
                                  }}
                                />
                              }
                            />
                          }
                        >
                          {item.title && <div className={styles.titleChat}>{item.title}</div>}
                          {typeof item.message === 'string' && (
                            <div className={styles.chatMessage}>{item.message}</div>
                          )}
                          <>
                            {item.attachments ? (
                              <div>{getAttachmentChat(item.attachments)}</div>
                            ) : (
                              ''
                            )}
                          </>
                          <div className={styles.timeChat}>
                            {moment(item.createdAt).format('DD-MM-YYYY, hh:mm a')}
                          </div>
                          {typeof item.message === 'object' && (
                            <TicketUpdatedContent message={item.message} />
                          )}
                        </Timeline.Item>
                      );
                    })}
                  </Timeline>
                </Col>
              </Row>
            </div>
            <div className={styles.btnStart}>
              {!isEmpty(chats) && (
                <CustomPrimaryButton backgroundColor="#707177">Start</CustomPrimaryButton>
              )}
            </div>
          </div>
        </div>
      </Card>
      <AssignTeamModal visible={modalVisible} role={role} onClose={() => setModalVisible(false)} />
      <EditTicketModal
        ticket={ticketDetail}
        visible={editVisible}
        role={role}
        onClose={() => setEditVisible(false)}
        refreshData={refreshData}
      />
    </div>
  );
};
export default connect(
  ({
    loading,
    ticketManagement: { listEmployee = [], ticketDetail = {} } = {},
    user: { permissions = {}, currentUser: { employee = {}, roles = [] } = {} } = {},
  }) => ({
    employee,
    roles,
    listEmployee,
    ticketDetail,
    permissions,
    loadingUploadAttachment: loading.effects['ticketManagement/uploadFileAttachments'],
    loadingAddChat: loading.effects['ticketManagement/addChat'],
  }),
)(TicketDetailsForm);
