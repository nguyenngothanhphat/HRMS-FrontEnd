import AttachmentIcon from '@/assets/attachment.svg';
import ImageIcon from '@/assets/image_icon.png';
import PDFIcon from '@/assets/pdf_icon.png';
import { Button, Form, Input, message, Modal, Spin, Tooltip, Upload } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import TrashIcon from '@/assets/trash.svg';
import styles from './index.less';

const { Dragger } = Upload;

@connect(({ loading }) => ({ loadingUploadAttachment: loading.effects['upload/uploadFile'] }))
class AddDocumentModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uploadedFile: {},
    };
  }

  componentDidMount = async () => {};

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

  renderHeaderModal = () => {
    const { titleModal = 'Upload file' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
      </div>
    );
  };

  onFinish = async (values) => {
    const { onAdd = () => {} } = this.props;

    const { name = '' } = values;
    const { uploadedFile = {} } = this.state;

    const payload = {
      name,
      uploadedFile,
    };

    if (!uploadedFile || Object.keys(uploadedFile).length === 0) {
      message.error('Invalid file');
    } else {
      this.setState({ uploadedFile: {} });
      onAdd(payload);
    }
  };

  handleCancel = () => {
    const { handleModalVisible = () => {} } = this.props;
    this.setState({ uploadedFile: {} });
    this.handlePreview('');
    handleModalVisible(false);
  };

  render() {
    const { loadingUploadAttachment, visible = false } = this.props;
    const { fileName = '' } = this.state;

    return (
      <>
        <Modal
          className={styles.AddDocumentModal}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={[
            <Button onClick={this.handleCancel} className={styles.btnCancel}>
              Cancel
            </Button>,
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
              disabled={!fileName}
              // loading={loadingReassign}
            >
              Add
            </Button>,
          ]}
          title={this.renderHeaderModal()}
          centered
          visible={visible}
        >
          <Form
            name="basic"
            // ref={this.formRef}
            id="myForm"
            onFinish={this.onFinish}
            initialValues={
              {
                // from: currentEmpId,
              }
            }
          >
            <Form.Item
              rules={[{ required: true, message: 'Please enter name' }]}
              label="Name"
              name="key"
              labelCol={{ span: 24 }}
            >
              <Input placeholder="Name" />
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
                        <img className={styles.uploadIcon} src={AttachmentIcon} alt="upload" />
                        <span className={styles.chooseFileText}>Choose file</span>
                        <span className={styles.uploadText}>or drop file here</span>
                      </>
                    )}
                  </div>
                )}
              </Dragger>
            </div>
          </Form>
        </Modal>
      </>
    );
  }
}

export default AddDocumentModal;
