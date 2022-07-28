import { Avatar, Button, Col, Input, Row, Spin, Timeline, Tooltip, Upload } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'umi';
import AttachmenUploadtIcon from '@/assets/attach-upload.svg';
import DefaultAvatar from '@/assets/avtDefault.jpg';
import ImageIcon from '@/assets/image_icon.png';
import PDFIcon from '@/assets/pdf_icon.png';
import TrashIcon from '@/assets/ticketManagement-trashIcon.svg';
import AttachmentIcon from '@/assets/ticketsManagement-attach.svg';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import { FILE_TYPE } from '@/constants/upload';
import { beforeUpload, compressImage, identifyFile } from '@/utils/upload';
import AssignTeamModal from '../../AssignTeamModal';
import styles from './index.less';

const { TextArea } = Input;
const { Dragger } = Upload;
@connect(
  ({
    loading,
    ticketManagement: { listEmployee = [], ticketDetail = {} } = {},
    user: { currentUser: { employee = {}, roles = [] } = {} } = {},
  }) => ({
    employee,
    roles,
    listEmployee,
    ticketDetail,
    loadingUploadAttachment: loading.effects['ticketManagement/uploadFileAttachments'],
    loadingAddChat: loading.effects['ticketManagement/addChat'],
  }),
)
class TicketDetailsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      uploadedFileList: [],
      fileNameList: [],
      arrayChats: [],
      modalVisible: false,
    };
  }

  componentDidMount() {
    const { ticketDetail: { chats = [] } = {} } = this.props;
    this.setState({
      arrayChats: chats.reverse(),
    });
  }

  findRole = (roles) => {
    const manager = roles.find((item) => item === 'MANAGER');
    const hrManager = roles.find((item) => item === 'HR-MANAGER');
    const role = hrManager || manager || 'EMPLOYEE';
    return role;
  };

  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  handlePreview = (nameFile, idFile) => {
    const { fileNameList } = this.state;
    const arrFileName = [...fileNameList];
    arrFileName.push({ nameFile, idFile });

    this.setState({
      fileNameList: arrFileName,
    });
  };

  handleUpload = async (file) => {
    const { dispatch } = this.props;
    const { uploadedFileList } = this.state;
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
      const { name = '', id } = fileUploaded;

      this.setState({ uploadedFileList: arrFile });
      this.handlePreview(name, id);
    });
  };

  handleRemove = (idFile) => {
    const { uploadedFileList = [], fileNameList = [] } = this.state;
    const filterUploadedFile = uploadedFileList.filter((item) => item.id !== idFile);
    const filterFileName = fileNameList.filter((item) => item.idFile !== idFile);

    this.setState({ uploadedFileList: filterUploadedFile, fileNameList: filterFileName });
  };

  handleSubmit = () => {
    const { dispatch, ticketDetail: { id: idTicket = '' } = {}, employee } = this.props;
    const { _id = '' } = employee;
    const { value, uploadedFileList } = this.state;
    const requestDate = moment();
    const documents = uploadedFileList?.map((item) => {
      const { id = '', url = '', name = '' } = item;
      return {
        attachment: id,
        attachmentName: name,
        attachmentUrl: url,
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
            createdAt: requestDate,
          },
        };

        dispatch({
          type: 'ticketManagement/addChat',
          payload,
        }).then((response) => {
          const { statusCode } = response;
          if (statusCode === 200) {
            this.setState({ uploadedFileList: [], fileNameList: [], value: '' });
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
            this.setState({ value: '' });
          }
        });
      }
    }
  };

  render() {
    const {
      ticketDetail = {},
      loadingUploadAttachment = false,
      loadingAddChat = false,
      roles = [],
    } = this.props;
    const role = this.findRole(roles);
    const {
      id = '',
      priority = '',
      description = '',
      subject = '',
      created_at: requestDate = '',
      query_type: queryType = '',
      attachments = [],
      chats = [],
      employeeRaise = [],
      ccList = [],
      employee_assignee: employeeAssignedTickets = '',
    } = ticketDetail;

    const { fileNameList, value, arrayChats, modalVisible } = this.state;

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
            <Avatar size={30} src={DefaultAvatar} />
          </Tooltip>
        );
      });
    };

    const getOpenBy = () => {
      if (employeeRaise) {
        if (employeeRaise.length > 0) {
          const { generalInfo: { legalName = '' } = {} } = employeeRaise[0];
          return legalName;
        }
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
        <div className={styles.formDetails}>
          <div className={styles.formTitle}>
            <span className={styles.title}>Tickets Details</span>
            <Button
              className={styles.btnMoveTo}
              type="primary"
              shape="round"
              onClick={() => this.setState({ modalVisible: true })}
            >
              Move To
            </Button>
          </div>
          <div className={styles.formContent}>
            <div className={styles.formContent__container}>
              <Row>
                <Col span={8} className={styles.formContent__title}>
                  Ticket ID: <span className={styles.formContent__title__color}>{id}</span>
                </Col>
                <Col span={8} className={styles.formContent__title}>
                  Request Date: <span>{moment(requestDate).format(DATE_FORMAT_MDY)}</span>
                </Col>
                <Col span={8} className={styles.formContent__title}>
                  Opened by: <span>{getOpenBy()}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8} className={styles.formContent__title}>
                  Query Type: <span>{queryType}</span>
                </Col>
                <Col span={8} className={styles.formContent__priority}>
                  Priority:
                  <span className={styles.priority} style={{ background: getColor() }}>
                    {priority}
                  </span>
                </Col>
                <Col span={8} className={styles.formContent__title}>
                  Subject: <span>{subject}</span>
                </Col>
              </Row>
              <Row>
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
                              return `${val.attachmentName.substr(
                                0,
                                8,
                              )}...${val.attachmentName.substr(
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
                            <img
                              className={styles.attachments__file__img}
                              src={PDFIcon}
                              alt="pdf"
                            />
                          </div>
                        );
                      })
                    ) : (
                      <span style={{ paddingLeft: '8px' }}> _ </span>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={24} className={styles.formContent__title}>
                  Description:
                </Col>
              </Row>
              <Row>
                <Col span={16}>{description}</Col>
              </Row>
            </div>
          </div>
          <div className={styles.note}>
            <div className={styles.note__title}>Notes</div>
            <div className={styles.note__textareaContent}>
              <TextArea
                value={value}
                onChange={this.onChange}
                placeholder="Type your message here..."
                autoSize={{ minRows: 6, maxRows: 8 }}
                className={styles.note__textarea}
              />
              <Col xs={24} className={styles.btnAttach}>
                <Dragger
                  beforeUpload={(file) => beforeUpload(file, [FILE_TYPE.IMAGE, FILE_TYPE.PDF], 2)}
                  showUploadList={false}
                  action={(file) => this.handleUpload(file)}
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
                            <img src={AttachmenUploadtIcon} alt="pdf" />
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
                          onClick={() => this.handleRemove(item.idFile)}
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
          <div
            className={`${
              !isEmpty(chats) ? styles.container__btnSend : styles.container__margin__btnSend
            }`}
          >
            <Button
              htmlType="submit"
              loading={loadingAddChat}
              className={`${value === '' ? styles.btnSend__disable : styles.btnSend}`}
              onClick={this.handleSubmit}
              disabled={loadingAddChat}
            >
              Send
            </Button>
          </div>
          <div className={styles.timeline}>
            <Row>
              <Col span={24}>
                <Timeline mode="alternate">
                  {arrayChats.map((item) => {
                    const {
                      employee: { generalInfo: { avatar = '' } = {}, id: employeeChatID = '' } = {},
                    } = item;

                    return (
                      <Timeline.Item
                        position={employeeChatID === employeeAssignedTickets ? 'right' : 'left'}
                        dot={
                          avatar !== '' ? (
                            <Avatar size={40} className={styles.avatar} src={avatar} />
                          ) : (
                            <Avatar size={40} src={DefaultAvatar} />
                          )
                        }
                      >
                        <div className={styles.titleChat}>{item.title}</div>
                        <div className={styles.chatMessage}>{item.message}</div>
                        <>
                          {item.attachments ? <div>{getAttachmentChat(item.attachments)}</div> : ''}
                        </>
                        <div className={styles.timeChat}>
                          {moment(item.createdAt).format('DD-MM-YYYY, hh:mm a')}
                        </div>
                      </Timeline.Item>
                    );
                  })}
                </Timeline>
              </Col>
            </Row>
          </div>
          <>
            {!isEmpty(chats) ? (
              <div className={styles.container__btnStart}>
                <div className={styles.btnStart}>Start</div>
              </div>
            ) : (
              ''
            )}
          </>
        </div>
        <AssignTeamModal
          visible={modalVisible}
          role={role}
          onClose={() => this.setState({ modalVisible: false })}
        />
      </div>
    );
  }
}
export default TicketDetailsForm;
