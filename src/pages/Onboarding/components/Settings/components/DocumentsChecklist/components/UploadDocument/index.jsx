import {
  Button, Card,
  Col, Divider, Form,
  Input, message, Row,
  Select, Spin, Tooltip,
  Upload
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import TrashIcon from '@/assets/onboarding/delete.svg';
import DocIcon from '@/assets/onboarding/fileDocIcon.svg';
import ImageIcon from '@/assets/onboarding/image_icon.png';
import PDFIcon from '@/assets/onboarding/pdf-2.svg';
import UploadIcon from '@/assets/onboarding/upload.svg';
import ViewIcon from '@/assets/onboarding/viewIcon.svg';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { getCurrentLocation } from '@/utils/authority';
import styles from './index.less';

const { Dragger } = Upload;
const UploadDocument = (props) => {
  const { dispatch, setSizeImageMatch = () => {}, handleCancelUploadDocument = () => {} } = props;

  const {
    user: {
      currentUser: { employee: { generalInfo: { legalName: author = '' } = {} } = {} } = {},
    } = {},
    location: { companyLocationList: locationList = [] } = {},
    loadingUploadAttachment = false,
    onboardingSettings: {
      employeeList = [],
      documentTypeList = [],
      recordEdit: {
        _id = '',
        location = [],
        displayName: displayNameProps = '',
        category: { name: categoryName = '' } = {},
        attachment: { name: attachmentName = '', _id: idAttchment = '' } = {},
      } = {},
      action = '',
    } = {},

    getListDocumentType = false,
  } = props;

  const [form] = Form.useForm();
  const currentDate = moment();
  const currentLocation = getCurrentLocation();
  const [uploadedFile, setUploadedFile] = useState({});
  const [fileName, setFileName] = useState('');
  const [isViewDocument, setIsViewDocument] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'onboardingSettings/fetchEmployeeListEffect',
      payload: {},
    });
    dispatch({
      type: 'onboardingSettings/getListDocumentType',
      payload: {},
    });
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
    const checkType =
      identifyImageOrPdf(file.name) === 0 ||
      identifyImageOrPdf(file.name) === 1 ||
      identifyImageOrPdf(file.name) === 2;
    if (!checkType) {
      message.error('Invalid file type!');
    }
    const isLt5M = file.size / 1024 / 1024 < 25;
    if (!isLt5M) {
      message.error('File must smaller than 25MB!');
      setSizeImageMatch(isLt5M);
    }
    setTimeout(() => {
      setSizeImageMatch(isLt5M);
    }, 2000);
    return checkType && isLt5M;
  };

  const handleUpload = (file) => {
    const formData = new FormData();
    formData.append('uri', file);
    dispatch({
      type: 'onboardingSettings/uploadFileAttachments',
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

  const renderImageFile = () => {
    switch (identifyImageOrPdf(fileName)) {
      case 0:
        return <img src={ImageIcon} alt="img" />;
      case 1:
        return <img src={PDFIcon} alt="pdf" />;
      case 2:
        return <img src={DocIcon} alt="doc" />;
      default:
        return <img src={PDFIcon} alt="pdf" />;
    }
  };

  const jsLcfirst = (string) => {
    return string.charAt(0).toLowerCase() + string.slice(1);
  };

  const reFreshGetListDocument = () => {
    dispatch({
      type: 'onboardingSettings/getListDocumentCheckList',
      payload: {},
    });
  };

  const onFinish = (values) => {
    const { employee = '', displayName = '', category = '' } = values;
    const obj = employeeList.find((item) => item?.generalInfo?.legalName === employee);
    const key = displayName.replace(/\s/g, '');
    const filterCategory = documentTypeList.find((item) => item.name === category);
    let payload = {
      ...values,
      category: filterCategory._id || '',
      employee: obj._id,
      attachment: uploadedFile.id || idAttchment,
      key: jsLcfirst(key),
    };

    payload = _.pickBy(payload, _.identity);
    if (action === 'edit') {
      payload.id = _id;
    }

    if (category === 'Electronically Sign') {
      message.error('Document is required field!');
    } else if (action === 'add') {
      dispatch({
        type: 'onboardingSettings/uploadDocumentChecklist',
        payload,
      }).then((res) => {
        const { statusCode = '' } = res;
        if (statusCode === 200) {
          reFreshGetListDocument();
          handleCancelUploadDocument();
        }
      });
    } else {
      dispatch({
        type: 'onboardingSettings/edit',
        payload,
      }).then((res) => {
        const { statusCode = '' } = res;
        if (statusCode === 200) {
          reFreshGetListDocument();
          handleCancelUploadDocument();
        }
      });
    }
  };

  useEffect(() => {
    setFileName(attachmentName);
  }, [action]);

  return (
    <Row className={styles.UploadDocument}>
      <Col span={16}>
        <Card title="Upload Document" className={styles.container}>
          <Form
            form={form}
            initialValues={{
              category: action === 'edit' ? categoryName : '',
              displayName: action === 'edit' ? displayNameProps : '',
              dateCreated: moment(currentDate).format('YYYY-MM-DD'),
              employee: author,
              location: action === 'edit' ? location.map((item) => item._id) : currentLocation,
            }}
            onFinish={onFinish}
          >
            <Row className={styles.formContent} gutter={[24, 24]}>
              <Col span={8}>
                Document Type <span style={{ color: 'red' }}> *</span>
              </Col>

              <Col span={16}>
                <Form.Item name="category" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select type of document"
                    allowClear
                    showArrow
                    showSearch
                    loading={getListDocumentType}
                    disabled={getListDocumentType}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {documentTypeList.map((item) => (
                      <Select.Option key={item._id} value={item.name}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                Title<span style={{ color: 'red' }}> *</span>
              </Col>
              <Col span={16}>
                <Form.Item name="displayName" rules={[{ required: true }]}>
                  <Input placeholder="Title" />
                </Form.Item>
              </Col>

              <Col span={8}>
                Location <span style={{ color: 'red' }}> *</span>
              </Col>
              <Col span={16}>
                <Form.Item name="location" rules={[{ required: true }]}>
                  <Select
                    size="large"
                    placeholder="Please select country"
                    showArrow
                    mode="multiple"
                    allowClear
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    className={styles.selectCountry}
                  >
                    {locationList.map((item) => {
                      return (
                        <Select.Option value={item._id} key={item.name}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>Author</Col>
              <Col span={16}>
                <Form.Item name="employee">
                  <Input placeholder="Author" disabled />
                </Form.Item>
              </Col>

              <Col span={8}>Date Created</Col>
              <Col span={16}>
                <Form.Item name="dateCreated">
                  <Input placeholder="Date Created" disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles.fileUploadForm} rules={[{ required: true }]}>
              <Col span={8}>Upload Document</Col>
              <Col span={16}>
                <Dragger
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                  disabled={fileName}
                  action={(file) => handleUpload(file)}
                >
                  {fileName !== '' ? (
                    <div className={styles.fileUploadedContainer}>
                      <div className={styles.trashIcon}>
                        <Tooltip title="View">
                          <img onClick={() => setIsViewDocument(true)} src={ViewIcon} alt="view" />
                        </Tooltip>
                        <Tooltip title="Remove">
                          <img onClick={() => handleRemove()} src={TrashIcon} alt="remove" />
                        </Tooltip>
                      </div>

                      <p className={styles.previewIcon}>{renderImageFile()}</p>
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
                            <div className={styles.uploadText}> Drag & drop file here</div>
                            <div className={styles.uploadbrowseText}>
                              or <span className={styles.browseText}>browse</span> to upload file
                            </div>
                          </div>
                          <span className={styles.belowText}>
                            File size should not be more than 25mb. Supported file for view: pdf,
                            doc, docx etc.
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </Dragger>
              </Col>
            </Row>
            <Divider />
            <div className={styles.containerBtn}>
              <Button type="secondary" onClick={handleCancelUploadDocument}>
                Cancle
              </Button>
              <Button type="primary" htmlType="submit" disabled={loadingUploadAttachment}>
                {action === 'add' ? 'Add' : 'Edit'}
              </Button>
            </div>
          </Form>
        </Card>
      </Col>
      <ViewDocumentModal
        visible={isViewDocument}
        onClose={() => setIsViewDocument(false)}
        url={uploadedFile?.url}
        disableDownload
      />
    </Row>
  );
};

export default connect(({ loading, user, location, onboardingSettings }) => ({
  user,
  location,
  onboardingSettings,
  loadingUploadAttachment: loading.effects['onboardingSettings/uploadFileAttachments'],
  getListDocumentType: loading.effects['onboardingSettings/getListDocumentType'],
}))(UploadDocument);
