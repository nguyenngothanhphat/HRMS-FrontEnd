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
    loadingUploadAttachment = false,
  } = props;
  const [uploadedFile, setUploadedFile] = useState({});
  const [fileName, setFileName] = useState('');
  const [isViewDocument, setIsViewDocument] = useState(false);

  // useEffect(() => {
  //   if (name !== '') {
  //     setFileName(name);
  //   }
  // }, []);
  const currentDate = moment();
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
      type: 'upload/uploadFile',
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

  return (
    <Row className={styles.UploadDocument}>
      <Col span={16}>
        <Card title="Upload Document" className={styles.container}>
          <Form
            initialValues={{
              dateCreated: moment(currentDate).format('YYYY-MM-DD'),
              author,
            }}
          >
            <Row className={styles.formContent}>
              <Col span={8}>Document Type</Col>
              <Col span={16}>
                <Form.Item>
                  <Select placeholder="Select type of document">
                    <Select.Option>Eletronically Sign</Select.Option>
                    <Select.Option>Scan and Upload</Select.Option>
                    <Select.Option>Hard Coppy</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>Title</Col>
              <Col span={16}>
                <Form.Item>
                  <Input placeholder="Title" />
                </Form.Item>
              </Col>

              <Col span={8}>Author</Col>
              <Col span={16}>
                <Form.Item name="author">
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
            <Row className={styles.fileUploadForm}>
              <Col span={8}>Attacth Document</Col>
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
              <Button type="primary">Submit</Button>
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

export default connect(({ loading, user }) => ({
  user,
  loadingUploadAttachment: loading.effects['upload/uploadFile'],
}))(UploadDocument);
