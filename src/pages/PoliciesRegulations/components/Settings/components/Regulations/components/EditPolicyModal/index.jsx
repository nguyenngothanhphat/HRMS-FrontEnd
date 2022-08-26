import React, { Component } from 'react';
import { Button, Form, Input, Modal, message, Spin, Upload, Tooltip, Select } from 'antd';

import { isEmpty } from 'lodash';
import { connect } from 'umi';

import TrashIcon from '@/assets/policiesRegulations/delete.svg';
import UploadIcon from '@/assets/policiesRegulations/upload.svg';
import PDFIcon from '@/assets/policiesRegulations/pdf-2.svg';
import ImageIcon from '@/assets/policiesRegulations/image_icon.png';

import styles from './index.less';

const { Dragger } = Upload;
const { Option } = Select;
@connect(
  ({
    loading,
    policiesRegulations: {
      listCategory = [],
      tempData: { listPolicy = [] },
      originData: { selectedCountry = '' },
    } = {},
    user: { currentUser: { employee: { _id: employeeId = '' } = {} } = {} },
  }) => ({
    listCategory,
    listPolicy,
    selectedCountry,
    employeeId,
    loadingUploadAttachment: loading.effects['policiesRegulations/uploadFileAttachments'],
    loadingUpdate: loading.effects['policiesRegulations/updatePolicy'],
  }),
)
class EditPolicyModal extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      uploadedFile: {},
      fileName: '',
      flag: false,
    };
  }

  identifyImageOrPdf = (fileName) => {
    const parts = fileName.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        return 0;
      case 'pdf':
        return 1;
      case 'doc':
      case 'docx':
        return 2;

      default:
        return 3;
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
      type: 'policiesRegulations/uploadFileAttachments',
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

  handleDeleteFileName = () => {
    const { onDelete = () => {} } = this.props;
    onDelete();
    this.setState({ flag: true });
  };

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    this.setState({ uploadedFile: {} });
    this.handlePreview('');
    onClose();
  };

  onFinish = ({ namePolicy = '', categoryPolicy = '' }) => {
    const {
      dispatch,
      item: { _id: id = '', attachment: attachmentProps = [] } = {},
      employeeId = '',
      onClose = () => {},
      onRefresh = () => {},
      selectedCountry = '',
    } = this.props;
    const { uploadedFile = {}, flag } = this.state;
    const attachment = {
      id: uploadedFile.id,
      name: uploadedFile.name,
      url: uploadedFile.url,
    };

    const payload = {
      id,
      employee: employeeId,
      categoryPolicy,
      namePolicy,
      attachment: !flag ? attachmentProps : attachment,
      country: [selectedCountry],
    };

    const updatePolicyRegulation = () => {
      dispatch({
        type: 'policiesRegulations/updatePolicy',
        payload,
      }).then((response) => {
        const { statusCode } = response;
        if (statusCode === 200) {
          onRefresh(selectedCountry);
          onClose();
        }
      });
      this.setState({ uploadedFile: {}, fileName: '', flag: false });
    };

    if (!flag) {
      updatePolicyRegulation();
    } else if (!uploadedFile || Object.keys(uploadedFile).length === 0) {
      message.error('Invalid file');
    } else {
      updatePolicyRegulation();
    }
  };

  render() {
    const { listCategory = [], item = {}, visible, filePDF = '' } = this.props;
    const { loadingUploadAttachment, loadingUpdate, listPolicy = [] } = this.props;
    const { fileName = '' } = this.state;
    const { namePolicy = '', category = [] } = item;
    const categoryID = !isEmpty(category) ? category[0]._id : '  ';

    const renderModalHeader = () => {
      return (
        <div className={styles.header}>
          <p className={styles.header__text}> Edit Policy</p>
        </div>
      );
    };
    const renderModalContent = () => {
      return (
        <div className={styles.content}>
          <Form
            name="basic"
            initialValues={{
              namePolicy,
              categoryPolicy: categoryID,
            }}
            id="addForm"
            ref={this.formRef}
            onFinish={this.onFinish}
          >
            <Form.Item
              rules={[{ required: true, message: 'Please Policy Categories' }]}
              label="Policy Categories"
              name="categoryPolicy"
              labelCol={{ span: 24 }}
            >
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {listCategory.map((val) => (
                  <Option value={val._id}>{val.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Policy Name"
              name="namePolicy"
              labelCol={{ span: 24 }}
              rules={[
                { required: true, message: 'Please enter policy name' },
                () => ({
                  validator(_, value) {
                    const duplicate = listPolicy.find(
                      (val) => val.namePolicy === value && value !== namePolicy,
                    );
                    if (duplicate) {
                      return Promise.reject('Policy Name is exist ');
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
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
                {filePDF !== '' ? (
                  <div className={styles.fileUploadedContainer}>
                    <Tooltip title="Remove">
                      <img
                        onClick={() => this.handleDeleteFileName()}
                        className={styles.trashIcon}
                        src={TrashIcon}
                        alt="remove"
                      />
                    </Tooltip>
                    <p className={styles.previewIcon}>
                      {this.identifyImageOrPdf(filePDF) === 1 ? (
                        <img src={PDFIcon} alt="pdf" />
                      ) : (
                        <img src={ImageIcon} alt="img" />
                      )}
                    </p>
                    <p className={styles.fileName}>
                      Uploaded: <a>{filePDF}</a>
                    </p>
                  </div>
                ) : (
                  <>
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
                              Maximum file size is 5MB. Supported file types are pdf & jpeg
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </>
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
          className={`${styles.EditPolicyModal} ${styles.noPadding}`}
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
                loading={loadingUpdate}
                disabled={!!loadingUploadAttachment}
              >
                Save Changes
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

export default EditPolicyModal;
