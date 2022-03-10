import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Modal, message, Spin, Upload, Tooltip, Select } from 'antd';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentLocation } from '@/utils/authority';
import TrashIcon from '@/assets/policiesRegulations/delete.svg';
import UploadIcon from '@/assets/policiesRegulations/upload.svg';
import PDFIcon from '@/assets/policiesRegulations/pdf-2.svg';
import ImageIcon from '@/assets/policiesRegulations/image_icon.png';
import styles from './index.less';

const { Dragger } = Upload;
const { Option } = Select;

const AddPolicyModal = (props) => {
  const [form] = Form.useForm();
  const [disabledSave, setDisabledSave] = useState(true);
  const [uploadedFile, setUploadedFile] = useState({});
  const [fileName, setFileName] = useState('');
  const {
    onClose = () => {},
    generalInfoId = '',
    onRefresh = () => {},
    selectedCountry = '',
    visible,
    loadingUploadAttachment,
    loadingAdd,
    listCategory = [],
    listPolicy = [],

    item: { attachment: { name = '' } = {} } = {},
    setSizeImageMatch = () => {},
    dispatch,
  } = props;
  useEffect(() => {
    if (name !== '') {
      setFileName(name);
    }
  }, []);

  const identifyImageOrPdf = (file) => {
    const parts = file.split('.');
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

  const handlePreview = (file) => {
    setFileName(file);
  };

  const beforeUpload = (file) => {
    const checkType = identifyImageOrPdf(file.name) === 0 || identifyImageOrPdf(file.name) === 1;
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

  const handleUpload = (file) => {
    const formData = new FormData();
    formData.append('uri', file);
    dispatch({
      type: 'policiesRegulations/uploadFileAttachments',
      payload: formData,
    }).then((resp) => {
      const { data = [] } = resp;
      const result = data.length > 0 ? data[0] : {};
      const { name: newName = '' } = file;
      setUploadedFile(result);
      handlePreview(newName);
    });
  };

  const handleRemove = () => {
    handlePreview('');
  };

  const handleCancel = () => {
    setUploadedFile({});
    handlePreview('');
    onClose();
  };

  const onFinish = async ({ categoryPolicy, namePolicies }) => {
    const attachment = {
      id: uploadedFile.id,
      name: uploadedFile.name,
      url: uploadedFile.url,
    };

    const payload = {
      employee: generalInfoId,
      categoryPolicy,
      namePolicy: namePolicies,
      attachment,
      country: [selectedCountry],
      location: getCurrentLocation(),
      company: getCurrentCompany(),
    };

    if (!selectedCountry) {
      message.error('Please select country');
    } else if (!uploadedFile || Object.keys(uploadedFile).length === 0) {
      message.error('Invalid file');
    } else {
      dispatch({
        type: 'policiesRegulations/addPolicy',
        payload,
      }).then((response) => {
        const { statusCode } = response;
        if (statusCode === 200) {
          onRefresh(selectedCountry);
          onClose();
          form.resetFields();
        }
      });
      setUploadedFile({});
      setFileName('');
    }
  };

  const handleFormChange = () => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);
    setDisabledSave(hasErrors);
  };

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
        <Form
          name="basic"
          id="addForm"
          form={form}
          onFieldsChange={handleFormChange}
          onFinish={onFinish}
        >
          <Form.Item
            rules={[{ required: true, message: 'Please Policy Categories' }]}
            label="Policy Categories"
            name="categoryPolicy"
            labelCol={{ span: 24 }}
          >
            <Select
              showSearch
              optionFilterProp="children"
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
            name="namePolicies"
            labelCol={{ span: 24 }}
            rules={[
              { required: true, message: 'Please enter Policy Name' },
              () => ({
                validator(_, value) {
                  const duplicate = listPolicy.find(
                    (val) => val.namePolicy.replace(/\s/g, '') === value.replace(/\s/g, ''),
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
              beforeUpload={beforeUpload}
              showUploadList={false}
              disabled={fileName}
              action={(file) => handleUpload(file)}
            >
              {fileName !== '' ? (
                <div className={styles.fileUploadedContainer}>
                  <Tooltip title="Remove">
                    <img
                      onClick={() => handleRemove()}
                      className={styles.trashIcon}
                      src={TrashIcon}
                      alt="remove"
                    />
                  </Tooltip>
                  <p className={styles.previewIcon}>
                    {identifyImageOrPdf(fileName) === 1 ? (
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
                        File size should not be more than 25mb. Supported file for view: pdf & jpeg.
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
        onCancel={handleCancel}
        destroyOnClose
        width={696}
        footer={
          <>
            <Button className={styles.btnCancel} onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="addForm"
              key="submit"
              htmlType="submit"
              loading={loadingAdd}
              disabled={disabledSave || !uploadedFile || Object.keys(uploadedFile).length === 0}
            >
              Add Policy
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
};

export default connect(
  ({
    loading,
    policiesRegulations: {
      listCategory = [],
      tempData: { listPolicy = [] },
      originData: { selectedCountry = '' },
    } = {},
    user: {
      currentUser: { employee: { generalInfo: { _id: generalInfoId = '' } = {} } = {} } = {},
    },
  }) => ({
    listCategory,
    selectedCountry,
    listPolicy,
    generalInfoId,
    loadingUploadAttachment: loading.effects['policiesRegulations/uploadFileAttachments'],
    loadingAdd: loading.effects['policiesRegulations/addPolicy'],
  }),
)(AddPolicyModal);
