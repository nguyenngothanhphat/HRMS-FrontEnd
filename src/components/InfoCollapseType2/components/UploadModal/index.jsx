/* eslint-disable compat/compat */
import { Button, Form, Input, Modal, notification, Spin, Upload } from 'antd';
import React, { Component } from 'react';
import { connect } from 'umi';
import ImageIcon from '@/assets/image_icon.png';
import PDFIcon from '@/assets/pdf_icon.png';
import FileUploadIcon from '@/assets/uploadFile_icon.svg';
// import { LogoutOutlined } from '@ant-design/icons';
import { FILE_TYPE } from '@/constants/upload';
import { beforeUpload, compressImage, identifyFile } from '@/utils/upload';
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

  handlePreview = (fileName) => {
    this.setState({
      uploadedFileName: fileName,
    });
  };

  handleUpload = async (file) => {
    const compressedFile = await compressImage(file);
    const formData = new FormData();
    formData.append('blob', compressedFile, file.name);
    const { dispatch } = this.props;
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
                beforeUpload={(file) => beforeUpload(file, [FILE_TYPE.IMAGE, FILE_TYPE.PDF])}
                showUploadList={false}
                action={(file) => this.handleUpload(file)}
              >
                {uploadedFileName !== '' ? (
                  <div className={styles.fileUploadedContainer}>
                    <p className={styles.previewIcon}>
                      {identifyFile(uploadedFileName) === FILE_TYPE.PDF ? (
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
