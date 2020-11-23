/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Upload, message, Button, Spin, Modal, Input, Form, notification } from 'antd';
import { connect } from 'umi';
import FileUploadIcon from '@/assets/uploadFile_icon.svg';
import PDFIcon from '@/assets/pdf_icon.png';
import ImageIcon from '@/assets/image_icon.png';
import styles from './index.less';

const { Dragger } = Upload;
@connect(({ loading, employeeProfile }) => ({
  loadingUploadAttachment: loading.effects['upload/uploadFile'],
  employeeProfile,
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
    const { titleModal = '' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
      </div>
    );
  };

  handleFileName = (e) => {
    const { value } = e.target;
    this.setState({
      keyFileName: value,
    });
  };

  handleRemoveToServer = () => {
    const { keyFileName: key, fileId } = this.state;
    const {
      employeeGroup = '',
      parentEmployeeGroup = '',
      employeeProfile: {
        idCurrentEmployee = '',
        originData: { compensationData: { company = '' } = {} } = {},
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
        employeeGroup,
        parentEmployeeGroup,
        attachment: fileId,
        employee: idCurrentEmployee,
        company,
      };

      dispatch({
        type: 'employeeProfile/uploadDocument',
        data,
      }).then((res) => {
        const { statusCode } = res;
        if (statusCode === 200) {
          message.success('Uploaded file');
          setTimeout(() => {
            handleCancel();
          }, 1000);
          refreshData();
        }
      });
    }
  };

  render() {
    const { uploadedFileName = '' } = this.state;
    const { loadingUploadAttachment, employeeGroup = '' } = this.props;
    const { visible = false, loading = false, handleCancel = () => {} } = this.props;

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
            employeeGroup === 'Identity' ? (
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
                ,
                <Button
                  key="submit"
                  type="primary"
                  form="myForm"
                  htmlType="submit"
                  loading={loading}
                  className={styles.btnSubmit}
                  onClick={this.handleRemoveToServer}
                >
                  Upload
                </Button>
              </div>
            ),
          ]}
        >
          {employeeGroup === 'Identity' ? (
            <span className={styles.errorMessage}>
              Please add these following documents via{' '}
              <span className={styles.boldText}>General Info</span> tab.
              <div className={styles.list}>
                <span>- Visa</span>
                <span>- Passport</span>
                <span>- Adhaar Card</span>
              </div>
            </span>
          ) : (
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
                initialValues={{ documentType: employeeGroup }}
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
                  <Input onChange={this.handleFileName} />
                </Form.Item>
                <Form.Item label="Document Type" name="documentType" rules={[{ required: true }]}>
                  <Input disabled />
                </Form.Item>
              </Form>
            </div>
          )}
        </Modal>
      </div>
    );
  }
}

export default UploadModal;
