import React, { Component } from 'react';
import {
  Row,
  Col,
  Input,
  Upload,
  message,
  Avatar,
  Tooltip,
  Spin,
  Button,
  Timeline,
  Icon,
} from 'antd';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { connect } from 'umi';

import AttachmentIcon from '@/assets/ticketsManagement-attach.svg';
import TrashIcon from '@/assets/trash.svg';
import ImageIcon from '@/assets/image_icon.png';
import PDFIcon from '@/assets/pdf_icon.png';

import styles from './index.less';

const { TextArea } = Input;
const { Dragger } = Upload;
@connect(
  ({
    loading,
    ticketManagement: { listEmployee = [], ticketDetail: { ticketDetail = {} } = {} } = {},
  }) => ({
    ticketDetail,
    listEmployee,
    loadingUploadAttachment: loading.effects['upload/uploadFile'],
    loadingAddChat: loading.effects['ticketManagement/addChat'],
  }),
)
class TicketDetailsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      // uploadedAttachments: [],
      uploadedFileList: [],
      fileNameList: [],
    };
  }

  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  handleSubmit = () => {
    const {
      dispatch,
      ticketDetail: {
        id = '',
        priority = '',
        description = '',
        subject = '',
        created_at: requestDate = '',
        cc_List: ccList = [],
        query_type: queryType = '',
      } = {},
    } = this.props;

    const { value, uploadedFileList } = this.state;

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
          id,
          priority,
          subject,
          ccList,
          queryType,
          description,
          requestDate,
          chat: value,
          attachment: documents,
        };
        dispatch({
          type: 'ticketManagement/addChat',
          payload,
        }).then((response) => {
          const { statusCode } = response;
          if (statusCode === 200) {
            this.setState({ uploadedFileList: [], fileNameList: [] });
          }
        });
      } else {
        const payload = {
          id,
          priority,
          subject,
          ccList,
          queryType,
          description,
          requestDate,
          chat: value,
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

  avatarTicket = () => {
    const { listEmployee } = this.props;
    const { ticketDetail: { cc_list: list = [] } = {} } = this.props;
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
      type: 'upload/uploadFile',
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

  render() {
    const { ticketDetail } = this.props;
    const {
      id = '',
      priority = '',
      description = '',
      subject = '',
      created_at: requestDate = '',
      cc_List: ccList = [],
      query_type: queryType = '',
      loadingUploadAttachment = false,
      employeeRaise: { generalInfo: { legalName = '' } = {} } = {},
    } = ticketDetail;
    // const { uploadedAttachments } = this.state;
    const { fileNameList, loadingAddChat, value } = this.state;
    const chat = [
      {
        label: 'Registered',
        date: '2017-07-03',
      },
      {
        label: '1',
        date: '2017-07-04',
      },
      {
        label: '2',
        date: '2017-08-01',
      },
      {
        label: '3',
        date: '2017-09-01',
      },
    ];

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
                  Ticket ID: <span>{id}</span>
                </Col>
                <Col span={8} className={styles.formContent__title}>
                  Request Date: <span>{moment(requestDate).format('DD/MM/YYYY')}</span>
                </Col>
                <Col span={8} className={styles.formContent__title}>
                  Open by: <span>{legalName}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8} className={styles.formContent__title}>
                  Query Type: <span>{queryType}</span>
                </Col>
                <Col span={8} className={styles.formContent__title}>
                  Priority: <span>{priority}</span>
                </Col>
                <Col span={8} className={styles.formContent__title}>
                  Subject: <span>{subject}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8} className={styles.formContent__title}>
                  QC:
                  <span>
                    <Avatar.Group
                      maxCount={2}
                      maxStyle={{
                        color: '#f56a00',
                        backgroundColor: '#fde3cf',
                      }}
                    >
                      {this.avatarTicket()}
                    </Avatar.Group>
                  </span>
                </Col>
                <Col span={16} className={styles.formContent__title}>
                  Attachments: <span>12/03/2019</span>
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
                            <img src={PDFIcon} alt="pdf" />
                          ) : (
                            <img src={ImageIcon} alt="img" />
                          )}
                        </div>
                        <div className={styles.fileName}>
                          Uploaded: <a>{item.nameFile}</a>
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
                {/* <Upload
                  maxCount={2}
                  action={(file) => this.handleUpload(file)}
                  beforeUpload={this.beforeUpload}
                  onRemove={(file) => this.handleRemove(file)}
                  openFileDialogOnClick={!(uploadedAttachments.length === 2)}
                  listType="picture"
                  className="upload-list-inline"
                >
                  <div
                    className={`${styles.addAttachments} ${
                      uploadedAttachments.length === 2 ? styles.disableUpload : {}
                    }`}
                  >
                    <div className={styles.btn}>
                      <img src={attachIcon} alt="" />
                    </div>
                  </div>
                </Upload> */}
              </Col>
            </div>
          </div>
          <div className={styles.container__btnSend}>
            <Button
              htmlType="submit"
              loading={loadingAddChat}
              className={styles.btnSend}
              onClick={this.handleSubmit}
            >
              Send
            </Button>
          </div>
          <div className={styles.timeline}>
            <Timeline mode="alternate">
              {chat.map((e, index) => {
                return (
                  <Timeline.Item key={index}>
                    <div>{e.label}</div>
                    <div>{moment(e.date).format('DD MMM YYYY')}</div>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </div>
          <div className={styles.container__btnStart}>
            <Button className={styles.btnStart}>Start</Button>
          </div>
        </div>
      </div>
    );
  }
}
export default TicketDetailsForm;
