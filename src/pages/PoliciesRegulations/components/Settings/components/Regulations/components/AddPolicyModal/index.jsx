import React, { Component } from 'react';
import { Button, Col, Form, Input, Modal, Row, message, Spin, Upload, Tooltip } from 'antd';
import styles from './index.less';
import TrashIcon from '@/assets/trash.svg';
import ImageIcon from '@/assets/image_icon.png';
import PDFIcon from '@/assets/pdf_icon.png';

const { Dragger } = Upload;
class AddPolicyModal extends Component {
  formRef = React.createRef();

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

  handleRemove = () => {
    this.handlePreview('');
  };

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    this.setState({ uploadedFile: {} });
    this.handlePreview('');
    onClose();
  };

  onFinish = async (values) => {
    const { onAdd = () => {} } = this.props;

    const { key = '' } = values;
    const { uploadedFile = {} } = this.state;

    const payload = {
      key,
      uploadedFile,
    };

    if (!uploadedFile || Object.keys(uploadedFile).length === 0) {
      message.error('Invalid file');
    } else {
      onAdd(payload);
      this.setState({ uploadedFile: {}, fileName: '' });
    }
  };

  render() {
    const { loadingUploadAttachment, visible = false } = this.props;
    const { fileName = '' } = this.state;
    const renderModalHeader = () => {
      return (
        <div className={styles.header}>
          <p className={styles.header__text}>Add Policy</p>
        </div>
      );
    };
    const renderModalContent = () => {
      return (
        <div className={styles.content}>
          <Form name="basic" id="addForm" ref={this.formRef} onFinish={this.onFinish}>
            <Form.Item
              label="Categories Name"
              name="key"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Please enter the categories name' }]}
            >
              <Input />
            </Form.Item>
            <div className={styles.fileUploadForm}>
              <Dragger
                beforeUpload={this.beforeUpload}
                showUploadList={false}
                disabled={fileName}
                action={(file) => this.handleUpload(file)}
              >
                {fileName !== '' ? (
                  <div className={styles.fileUploadedContainer}>
                    <Tooltip title="Remove">
                      <img
                        onClick={() => this.handleRemove()}
                        className={styles.trashIcon}
                        src={TrashIcon}
                        alt="remove"
                      />
                    </Tooltip>
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
                    {/* <Button disabled={selectExistDocument}>Choose an another file</Button> */}
                  </div>
                ) : (
                  <div className={styles.drapperBlock}>
                    {loadingUploadAttachment ? (
                      <Spin />
                    ) : (
                      <>
                        {/* <img className={styles.uploadIcon} src={AttachmentIcon} alt="upload" /> */}
                        <div className={styles.aboveText}>
                          <span className={styles.uploadText}>Drop file here or</span>
                          <span className={styles.browseText}> browse</span>
                        </div>
                        <span className={styles.belowText}>
                          Maximum file size 300 mb, Supported file format png, jpeg, pdf.
                        </span>
                      </>
                    )}
                  </div>
                )}
              </Dragger>
            </div>
          </Form>
        </div>
      );
    };

    return (
      <>
        <Modal
          className={`${styles.AddPolicyModal} ${styles.noPadding}`}
          onCancel={this.handleCancel}
          destroyOnClose
          width={696}
          footer={
            <>
              <Button className={styles.btnCancel} onClick={this.handleCancel}>
                Cancel
              </Button>
              <Button
                className={styles.btnSubmit}
                type="primary"
                form="myForm"
                key="submit"
                htmlType="submit"
                // loading={loadingAddTask}
              >
                Submit
              </Button>
            </>
          }
          title={renderModalHeader()}
          centered
          visible={visible}
        >
          {renderModalContent()}
        </Modal>
      </>
    );
  }
}

export default AddPolicyModal;
