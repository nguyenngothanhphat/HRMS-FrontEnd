import React, { Component } from 'react';
import { Row, Col, Input, Upload, message, Avatar, Tooltip, Spin, Button, Timeline } from 'antd';
import moment from 'moment';

import { isEmpty } from 'lodash';
import { connect } from 'umi';
import { UserOutlined } from '@ant-design/icons';

import AttachmentIcon from '@/assets/ticketsManagement-attach.svg';
import AttachmenUploadtIcon from '@/assets/attach-upload.svg';
import TrashIcon from '@/assets/ticketManagement-trashIcon.svg';
import ImageIcon from '@/assets/image_icon.png';
import PDFIcon from '@/assets/pdf_icon.png';

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
    };
  }

  componentDidMount() {
    const { ticketDetail: { chats = [] } = {} } = this.props;
    this.setState({
      arrayChats: chats.reverse(),
    });
  }

  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  identifyImageOrPdf = (fileNameList) => {
    const parts = fileNameList.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'svg':
      case 'webp':
      case 'tiff':
      case 'png':
        return 0;
      case 'pdf':
        return 1;
      case 'doc':
      case 'docx':
        return 2;

      default:
        return 0;
    }
  };

  handlePreview = (nameFile, idFile) => {
    const { fileNameList } = this.state;
    const arrFileName = [...fileNameList];
    arrFileName.push({ nameFile, idFile });

    this.setState({
      fileNameList: arrFileName,
    });
  };

  beforeUpload = (file) => {
    const { setSizeImageMatch = () => {} } = this.props;
    const checkType =
      this.identifyImageOrPdf(file.name) === 0 || this.identifyImageOrPdf(file.name) === 1;
    if (!checkType) {
      message.error('You can only upload image and PDF file!');
    }
    const isLt5M = file.size / 1024 / 1024 < 2;
    if (!isLt5M) {
      message.error('Image must smaller than 2MB!');
      setSizeImageMatch(isLt5M);
    }
    setTimeout(() => {
      setSizeImageMatch(isLt5M);
    }, 2000);
    return checkType && isLt5M;
  };

  handleUpload = (file) => {
    const { dispatch } = this.props;
    const { uploadedFileList } = this.state;
    const arrFile = [...uploadedFileList];
    const formData = new FormData();
    formData.append('uri', file);

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
    } = this.props;
    const { listEmployee } = this.props;
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

    const { fileNameList, value, arrayChats } = this.state;

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
            <Avatar size={30} icon={<UserOutlined />} />
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
          </div>
          <div className={styles.formContent}>
            <div className={styles.formContent__container}>
              <Row>
                <Col span={8} className={styles.formContent__title}>
                  Ticket ID: <span className={styles.formContent__title__color}>{id}</span>
                </Col>
                <Col span={8} className={styles.formContent__title}>
                  Request Date: <span>{moment(requestDate).format('DD/MM/YYYY')}</span>
                </Col>
                {/** check laf nguoi assigned, raised */}
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
                  beforeUpload={this.beforeUpload}
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
                          {this.identifyImageOrPdf(item.nameFile) === 1 ? (
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
                            <Avatar size={40} icon={<UserOutlined />} />
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
      </div>
    );
  }
}
export default TicketDetailsForm;
