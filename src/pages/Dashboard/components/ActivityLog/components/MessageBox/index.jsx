import { Button, Form, Input, message, Tooltip, Spin, Upload } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { isEmpty } from 'lodash';

import MessageIcon from '@/assets/candidatePortal/messageIcon.svg';
import AttachmenUploadtIcon from '@/assets/attach-upload.svg';
import TrashIcon from '@/assets/ticketManagement-trashIcon.svg';
import AttachmentIcon from '@/assets/ticketsManagement-attach.svg';
import PDFIcon from '@/assets/pdf_icon.png';
import ImageIcon from '@/assets/image_icon.png';

import styles from './index.less';

const { Dragger } = Upload;
@connect(
  ({
    loading,
    user: { currentUser: { employee = {} } } = {},
    dashboard: { listEmployee = [] } = {},
  }) => ({
    employee,
    listEmployee,
    loadingUploadAttachment: loading.effects['dashboard/uploadFileAttachments'],
    loadingFectchListMyTicket: loading.effects['dashboard/fetchListMyTicket'],
    loadingfetchListEmployee: loading.effects['dashboard/fetchListEmployee'],
    loadingAddNotes: loading.effects['dashboard/addNotes'],
  }),
)
class MessageBox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { uploadedFileList: [], fileNameList: [], value: '' };
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
      type: 'dashboard/uploadFileAttachments',
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

  handleAddNote = () => {
    const { dispatch, item: { id: idTicket = '' } = {}, employee: { _id = '' } = {} } = this.props;
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
          type: 'dashboard/addNotes',
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
          type: 'dashboard/addNotes',
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

  renderSender = () => {
    return (
      <div className={styles.senderContainer}>
        <div className={styles.titleContainer}>
          <div className={styles.avatar}>
            <img src={MessageIcon} alt="message" />
          </div>
          <div className={styles.info}>
            <span className={styles.name}>Notes</span>
          </div>
        </div>
      </div>
    );
  };

  renderNameAttach = (value) => {
    const { listEmployee = [] } = this.props;
    const intersection = listEmployee.filter((element) => element._id === value);
    return intersection.map((val) => {
      const { generalInfo: { legalName = '' } = {} } = val;
      return <span className={styles.nameAttach}>{legalName || ''}</span>;
    });
  };

  renderChatContent = () => {
    const { chats = [], loadingfetchListEmployee = false } = this.props;
    if (!isEmpty(chats)) {
      return chats.map((chat) => {
        return (
          <div className={styles.boxMessage}>
            <div className={styles.chatTitle}>{chat.title || ''}</div>
            <div className={styles.chatText}>{chat.message || ''}</div>
            <div>
              {chat.attachments ? (
                <>
                  {!isEmpty(chat.attachments)
                    ? chat.attachments.map((val) => {
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
                            <img
                              className={styles.attachments__file__img}
                              src={PDFIcon}
                              alt="pdf"
                            />
                            <a href={val.attachmentUrl} target="_blank" rel="noreferrer">
                              {attachmentSlice()}
                            </a>
                          </div>
                        );
                      })
                    : ''}
                </>
              ) : (
                ''
              )}
            </div>
            <div>
              {loadingfetchListEmployee ? <Spin /> : this.renderNameAttach(chat.employee)}
              <span className={styles.chatDate}>
                {moment(chat.createdAt).locale('en').format('DD-MM-YYYY, hh:mm a')}
              </span>
            </div>
          </div>
        );
      });
    }
    return '';
  };

  renderInput = () => {
    const {
      loadingUploadAttachment = false,
      loadingAddNotes = false,
      loadingFectchListMyTicket = false,
    } = this.props;
    const { fileNameList, value } = this.state;

    return (
      <div className={styles.inputContainer}>
        <Form name="inputChat">
          <Form.Item name="message" className={styles.formChat}>
            <Input.TextArea
              value={value}
              onChange={this.onChange}
              autoSize={{ minRows: 1 }}
              maxLength={255}
              placeholder="Add a note for reference"
            />
            <div
              className={`${value.length === 0 ? styles.containerAattachment : ''} ${
                value.length > 0 ? styles.maginTop : ''
              }`}
            >
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
            </div>
          </Form.Item>
          <div>
            <Button
              htmlType="submit"
              loading={loadingAddNotes && loadingFectchListMyTicket}
              className={`${value === '' ? styles.btnAddNote__disable : styles.btnNote}`}
              onClick={this.handleAddNote}
            >
              + Add notes
            </Button>
          </div>
        </Form>
      </div>
    );
  };

  render() {
    return (
      <div className={styles.MessageBoxMyTicket}>
        <div className={styles.chatContainer}>
          {this.renderSender()}
          <div className={styles.chatContainer__content}>{this.renderChatContent()}</div>
        </div>
        {this.renderInput()}
      </div>
    );
  }
}

export default MessageBox;
