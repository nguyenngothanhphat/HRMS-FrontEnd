import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Divider,
  Button,
  message,
  Tooltip,
  Upload,
  Spin,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import styles from './index.less';
import UploadIcon from '@/assets/onboarding/upload.svg';
import TrashIcon from '@/assets/onboarding/delete.svg';
import ViewIcon from '@/assets/onboarding/viewIcon.svg';
import PDFIcon from '@/assets/onboarding/pdf-2.svg';
import ImageIcon from '@/assets/onboarding/image_icon.png';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import DocIcon from '@/assets/onboarding/fileDocIcon.svg';
import { getCurrentLocation } from '@/utils/authority';

const { Dragger } = Upload;
const UploadDocument = (props) => {
  const {
    dispatch,
    setSizeImageMatch = () => {},

    handleCancelUploadDocument = () => {},
  } = props;

  const {
    user: {
      currentUser: { employee: { generalInfo: { legalName: author = '' } = {} } = {} } = {},
    } = {},
    location: { companyLocationList: locationList = [] } = {},
    loadingUploadAttachment = false,
    onboardingSettings: { employeeList = [], documentTypeList = [] } = {},
    getListDocumentType = false,
  } = props;
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

  const onFinish = (values) => {
    const { employee = '', displayName = '' } = values;
    const obj = employeeList.find((item) => item?.generalInfo?.legalName === employee);
    const key = displayName.replace(/\s/g, '');
    const payload = {
      ...values,
      employee: obj._id,
      attachment: uploadedFile.id,
      key: jsLcfirst(key),
    };

    dispatch({
      type: 'onboardingSettings/uploadDocumentChecklist',
      payload,
    });
  };

  return (
    <Row className={styles.UploadDocument}>
      <Col span={16}>
        <Card title="Upload Document" className={styles.container}>
          <Form
            initialValues={{
              dateCreated: moment(currentDate).format('YYYY-MM-DD'),
              employee: author,
              location: currentLocation,
            }}
            onFinish={onFinish}
          >
            <Row className={styles.formContent} gutter={[24, 24]}>
              <Col span={8}>Document Type</Col>
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
                      <Select.Option key={item._id} value={item._id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>Title</Col>
              <Col span={16}>
                <Form.Item name="displayName" rules={[{ required: true }]}>
                  <Input placeholder="Title" />
                </Form.Item>
              </Col>

              <Col span={8}>Location</Col>
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
              <Button type="primary" htmlType="submit">
                Submit
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
