import React, { Component } from 'react';
import { message, Button, Spin, Modal, Form, Upload } from 'antd';
import { connect } from 'umi';
import { isEmpty } from 'lodash';

import AttachmentIcon from '@/assets/attachment.svg';
import ImageIcon from '@/assets/image_icon.png';
import PDFIcon from '@/assets/pdf_icon.png';

import styles from './index.less';

const { Dragger } = Upload;

@connect(({ loading }) => ({
  loadingUploadAttachment: loading.effects['upload/uploadFile'],
  loadingAddDocument: loading.effects['onboardingSettings/addDocument'],
}))
class ModalAddDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedFile: {},
      fileName: '',
    };
  }

  identifyImageOrPdf = (fileName) => {
    const parts = fileName.split('.');
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

  destroyOnClose = () => {
    const { handleCandelModal = () => {} } = this.props;
    handleCandelModal();
  };

  handlePreview = (fileName) => {
    this.setState({
      fileName,
    });
  };

  beforeUpload = (file) => {
    const { setSizeImageMatch = () => {} } = this.props;
    const checkType =
      this.identifyImageOrPdf(file.name) === 0 || this.identifyImageOrPdf(file.name) === 1;
    if (!checkType) {
      message.error('You can only upload image and PDF file!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
      setSizeImageMatch(isLt5M);
      // this.setState({ check: isLt5M });
    }
    setTimeout(() => {
      setSizeImageMatch(isLt5M);
      // this.setState({ check: isLt5M });
    }, 2000);
    return checkType && isLt5M;
  };

  handleUpload = (file) => {
    const { dispatch } = this.props;
    const formData = new FormData();
    formData.append('uri', file);

    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    }).then((resp) => {
      const { data = [] } = resp;
      const uploadedFile = data.length > 0 ? data[0] : {};
      const { name = '' } = file;
      this.setState({ uploadedFile });
      this.handlePreview(name);
    });
  };

  onFinish = () => {
    const { dispatch, handleCandelModal = () => {}, idBenefit = '', idCountry } = this.props;
    const { uploadedFile: { id = '', url = '', name = '' } = {}, uploadedFile = {} } = this.state;
    const payload = {
      country: idCountry,
      payload: {
        benefitId: idBenefit,
        document: {
          attachment: id,
          attachmentName: name,
          attachmentUrl: url,
        },
      },
    };

    if (!isEmpty(uploadedFile)) {
      dispatch({
        type: 'onboardingSettings/addDocument',
        payload,
      }).then((response) => {
        const { statusCode } = response;
        if (statusCode === 200) {
          this.setState({ uploadedFile: {}, fileName: '' });
          handleCandelModal();
        }
      });
    } else {
      message.error('Please choose file');
    }
  };

  render() {
    const {
      visible = false,
      loadingUploadAttachment = false,
      loadingAddDocument = false,
    } = this.props;

    const { fileName } = this.state;

    return (
      <Modal
        visible={visible}
        className={styles.addDocumentModal}
        title={false}
        onCancel={this.destroyOnClose}
        destroyOnClose={this.destroyOnClose}
        footer={false}
      >
        <div className={styles.addDocument}>
          <div className={styles.addDocument__header}>
            <div className={styles.addDocument__header__title}>Add a Document</div>
          </div>
          <Form onFinish={this.onFinish}>
            <div className={styles.addDocument__body}>
              <div className={styles.documentSection}>
                <Dragger
                  beforeUpload={this.beforeUpload}
                  showUploadList={false}
                  action={(file) => this.handleUpload(file)}
                >
                  {fileName === '' ? (
                    <>
                      {loadingUploadAttachment ? (
                        <Spin />
                      ) : (
                        <>
                          <img className={styles.uploadIcon} src={AttachmentIcon} alt="upload" />
                          <span className={styles.chooseFileText}>Choose file</span>
                          <span className={styles.uploadText}>or drop file here</span>
                        </>
                      )}
                    </>
                  ) : (
                    <div className={styles.fileUploadedContainer}>
                      <p className={styles.previewIcon}>
                        {this.identifyImageOrPdf(fileName) === 1 ? (
                          <img src={PDFIcon} alt="pdf" />
                        ) : (
                          <img src={ImageIcon} alt="img" />
                        )}
                      </p>
                      <p className={styles.fileName}>
                        Uploaded: <a>{fileName}</a>
                      </p>
                    </div>
                  )}
                </Dragger>
              </div>
            </div>
            <div className={styles.addDocument__bottom}>
              <Button
                onClick={this.destroyOnClose}
                className={`${styles.addDocument__bottom_btn} ${styles.cancelBtn}`}
              >
                Cancel
              </Button>
              <Button
                htmlType="submit"
                className={`${styles.addDocument__bottom_btn} ${styles.addBtn}`}
                loading={loadingAddDocument}
              >
                Add
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default ModalAddDocument;
