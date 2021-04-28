/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Upload, message, Button, Spin, Modal, Input, Form, notification } from 'antd';
import { connect } from 'umi';
import FileUploadIcon from '@/assets/uploadFile_icon.svg';
import PDFIcon from '@/assets/pdf_icon.png';
import ImageIcon from '@/assets/image_icon.png';
// import { LogoutOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Dragger } = Upload;
@connect(({ loading, employeeProfile, user: { currentUser: { employeeId = '' } = {} } } = {}) => ({
  loadingUploadAttachment: loading.effects['upload/uploadFile'],
  loadingUploadDocument: loading.effects['employeeProfile/uploadDocument'],
  loadingUpdateDocument: loading.effects['employeeProfile/updateDocument'],
  employeeProfile,
  employeeId,
}))
class UploadModal extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      uploadedFileName: '',
      keyFileName: '',
      fileId: '',
    };
  }

  getResponse = (resp) => {
    const { statusCode, data = [] } = resp;
    const { id = '' } = data[0];
    if (statusCode === 200) {
      this.setState({
        fileId: id,
      });
    }
  };

  identifyImageOrPdf = (fileName) => {
    const parts = fileName.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'png':
        return 0;
      case 'pdf':
        return 1;
      default:
        return 0;
    }
  };

  handlePreview = (fileName) => {
    this.setState({
      uploadedFileName: fileName,
    });
  };

  beforeUpload = (file) => {
    const { setSizeImageMatch = () => {} } = this.props;
    const checkType =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
    if (!checkType) {
      message.error('You can only upload JPG/PNG/PDF file!');
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
      const { name = '' } = data[0];
      this.getResponse(resp);
      this.handlePreview(name);
    });
  };

  renderHeaderModal = () => {
    const { actionType = 1 } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>
          {actionType === 1 ? 'Upload new document' : 'Replace document'}
        </p>
      </div>
    );
  };

  handleName = (name) => {
    const { idCurrentEmployee = '' } = this.props;
    const check = name.includes(idCurrentEmployee.replace(/ /g, ''));
    const keyFileName = check ? name : `${name}_${idCurrentEmployee}`;
    return keyFileName.replace(/ /g, '');
  };

  handleFileNameInput = (e) => {
    const { value } = e.target;
    const keyFileName = this.handleName(value);
    this.setState({
      keyFileName,
    });
  };

  handleRemoveToServer = () => {
    const { keyFileName: key, fileId } = this.state;
    const {
      categoryId = '',
      employeeProfile: {
        idCurrentEmployee = '',
        companyCurrentEmployee = '',
        tenantCurrentEmployee = '',
      } = {},
      dispatch,
      handleCancel = () => {},
      refreshData = () => {},
    } = this.props;

    if (fileId === '') {
      notification.error({ message: 'Please choose file to upload!' });
    } else if (key !== '') {
      const data = {
        key, // file name
        attachment: fileId,
        category: categoryId,
        employee: idCurrentEmployee,
        company: companyCurrentEmployee,
        tenantId: tenantCurrentEmployee,
      };

      dispatch({
        type: 'employeeProfile/uploadDocument',
        data,
      }).then((res) => {
        const { statusCode } = res;
        if (statusCode === 200) {
          // message.success('Uploaded file');
          setTimeout(() => {
            handleCancel();
          }, 2000);
          refreshData();
        }
      });
    }
  };

  replaceDocument = async () => {
    const { keyFileName: key, fileId } = this.state;
    const { currentFileName, employeeProfile: { tenantCurrentEmployee = '' } = {} } = this.props;
    let finalName = '';
    if (currentFileName && !key) finalName = this.handleName(currentFileName);
    else finalName = this.handleName(key);

    const {
      dispatch,
      refreshData = () => {},
      currentDocumentId = '',
      handleCancel = () => {},
    } = this.props;

    if (fileId === '') {
      notification.error({ message: 'Please choose file to upload!' });
    } else {
      const payload = {
        id: currentDocumentId,
        attachment: fileId,
        tenantId: tenantCurrentEmployee,
      };
      if (finalName) {
        payload.key = finalName;
      }
      const updateDocument = await dispatch({
        type: 'employeeProfile/updateDocument',
        payload,
      });
      if (updateDocument?.statusCode === 200) {
        // message.success('Uploaded file');
        setTimeout(() => {
          handleCancel();
        }, 2000);
        refreshData();
      }
    }
  };

  render() {
    const { uploadedFileName } = this.state;
    const {
      loadingUploadAttachment,
      childCategory = '',
      loadingUploadDocument,
      loadingUpdateDocument,
    } = this.props;
    const {
      visible = false,
      handleCancel = () => {},
      actionType = 1,
      currentFileName = '',
    } = this.props;
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (
      <div>
        <Modal
          className={styles.modalUpload}
          visible={visible}
          title={this.renderHeaderModal()}
          centered
          onOk={this.handleRemoveToServer}
          onCancel={handleCancel}
          destroyOnClose
          footer={[
            childCategory === 'Identity' ? (
              <Button
                key="cancel"
                type="primary"
                className={styles.btnSubmit}
                onClick={handleCancel}
              >
                OK
              </Button>
            ) : (
              <div>
                <div key="cancel" className={styles.btnCancel} onClick={handleCancel}>
                  Cancel
                </div>

                <Button
                  key="submit"
                  type="primary"
                  form="myForm"
                  htmlType="submit"
                  loading={loadingUpdateDocument || loadingUploadDocument}
                  className={styles.btnSubmit}
                  onClick={actionType === 1 ? this.handleRemoveToServer : this.replaceDocument}
                >
                  Upload
                </Button>
              </div>
            ),
          ]}
        >
          <div>
            <div className={styles.FileUploadForm}>
              <Dragger
                beforeUpload={this.beforeUpload}
                showUploadList={false}
                action={(file) => this.handleUpload(file)}
              >
                {uploadedFileName !== '' ? (
                  <div className={styles.fileUploadedContainer}>
                    <p className={styles.previewIcon}>
                      {this.identifyImageOrPdf(uploadedFileName) === 1 ? (
                        <img src={PDFIcon} alt="pdf" />
                      ) : (
                        <img src={ImageIcon} alt="img" />
                      )}
                    </p>
                    <p className={styles.fileName}>
                      Uploaded: <a>{uploadedFileName}</a>
                    </p>
                    <Button>Choose an another file</Button>
                  </div>
                ) : (
                  <div>
                    {loadingUploadAttachment ? (
                      <Spin />
                    ) : (
                      <div>
                        <div>
                          <p className={styles.uploadIcon}>
                            <img src={FileUploadIcon} alt="upload" />
                          </p>
                        </div>
                        <p className={styles.uploadText}>Drap and drop the file here</p>
                        <p className={styles.uploadText}>or</p>
                        <Button>Choose file</Button>
                      </div>
                    )}
                  </div>
                )}
              </Dragger>
            </div>
            <Form
              initialValues={{ documentType: childCategory, documentName: currentFileName }}
              ref={this.formRef}
              id="myForm"
              className={styles.fileNameInput}
              name="basic"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...layout}
            >
              <Form.Item
                label="Document Name"
                name="documentName"
                rules={[{ required: true, message: 'Please input file name!' }]}
              >
                <Input onChange={this.handleFileNameInput} />
              </Form.Item>
              <Form.Item label="Document Type" name="documentType" rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default UploadModal;
