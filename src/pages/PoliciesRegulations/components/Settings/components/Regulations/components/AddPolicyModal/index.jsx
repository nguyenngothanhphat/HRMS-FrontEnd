import React, { Component } from 'react';
import { Button, Col, Form, Input, Modal, Row, message, Spin, Upload, Tooltip, Select } from 'antd';

import { connect } from 'umi';

import TrashIcon from '@/assets/policiesRegulations/delete.svg';
import UploadIcon from '@/assets/policiesRegulations/upload.svg';
import PDFIcon from '@/assets/policiesRegulations/pdf-2.svg';
import ImageIcon from '@/assets/policiesRegulations/image_icon.png';

import styles from './index.less';

const { Dragger } = Upload;
const { Option } = Select;
@connect(({ loading }) => ({
  loadingUploadAttachment: loading.effects['upload/uploadFile'],
  loadingAdd: loading.effects['policiesRegulations/addPolicy'],
  loadingUpdate: loading.effects['policiesRegulations/updatePolicy'],
}))
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
    const { mode, dispatch } = this.props;

    const { key = '' } = values;
    const { uploadedFile = {} } = this.state;

    const payload = {
      key,
      uploadedFile,
    };

    if (mode === 'add') {
      if (!uploadedFile || Object.keys(uploadedFile).length === 0) {
        message.error('Invalid file');
      } else {
        //   dispatch({
        //     type: 'policiesRegulations/addpolicy',
        //     payload: values,
        //   });
        //   this.setState({ uploadedFile: {}, fileName: '' });
      }
    } else {
      // const { _id } = item;
      // dispatch({
      //   type: 'policiesRegulations/updatePolicy',
      //   payload: {
      //     ...values,
      //   },
      // });
    }
  };

  render() {
    const POLICY_CATEGORIES = [
      {
        id: 1,
        name: 'Employee conduct',
      },
      {
        id: 2,
        name: 'Leave Policy',
      },
      {
        id: 3,
        name: 'Company Asset Policy',
      },
      {
        id: 4,
        name: 'Technology usage',
      },
      {
        id: 5,
        name: 'Travel Policy',
      },
    ];
    const { loadingUploadAttachment, loadingAdd, loadingUpdate, openModal, mode } = this.props;
    const { fileName = '' } = this.state;
    const onPolicyCategories = () => {};
    const renderModalHeader = () => {
      return (
        <div className={styles.header}>
          <p className={styles.header__text}>{mode === 'add' ? 'Add Policy' : 'Edit Policy'}</p>
        </div>
      );
    };
    const renderModalContent = () => {
      return (
        <div className={styles.content}>
          <Form name="basic" id="addForm" ref={this.formRef} onFinish={this.onFinish}>
            <Form.Item
              rules={[{ required: true, message: 'Please Policy Categories' }]}
              label="Policy Categories"
              name="policyCategories"
              labelCol={{ span: 24 }}
            >
              <Select showSearch onChange={onPolicyCategories}>
                {POLICY_CATEGORIES.map((val) => (
                  <Option value={val.id}>{val.name}</Option>
                ))}
              </Select>
            </Form.Item>

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
                  </div>
                ) : (
                  <div className={styles.drapperBlock}>
                    {loadingUploadAttachment ? (
                      <Spin />
                    ) : (
                      <>
                        <div className={styles.aboveText}>
                          <div>
                            <img src={UploadIcon} alt="upload" />
                          </div>
                          <div className={styles.uploadText}>Drop file here</div>
                          <div className={styles.uploadbrowseText}>
                            or <span className={styles.browseText}>browse</span> to upload file
                          </div>
                        </div>
                        <span className={styles.belowText}>
                          File size should not be more than 25mb. Supported file for view: pdf &
                          jpeg.
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
                form="addForm"
                key="submit"
                htmlType="submit"
                loading={loadingAdd && loadingUpdate}
              >
                {mode === 'add' ? '  Add Policy' : 'Save Changes'}
              </Button>
            </>
          }
          title={renderModalHeader()}
          centered
          visible={openModal}
        >
          {renderModalContent()}
        </Modal>
      </>
    );
  }
}

export default AddPolicyModal;
