import { Col, Form, Input, message, Row, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { connect } from 'umi';
import UploadIcon from '@/assets/upload-icon.svg';
import styles from './index.less';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const AddContent = (props) => {
  const formRef = React.createRef();
  const {
    dispatch,
    visible = false,
    projectDetails: { projectId = '', documentTypeList = [] } = {},
    currentUser: { employee = {} } = {} || {},
    onClose = () => {},
    refreshData = () => {},
  } = props;

  const { generalInfo: { userId: employeeId = '', legalName: employeeName = '' } = {} || {} } =
    employee;

  const [uploadedPreview, setUploadedPreview] = useState('');
  const [uploadedFile, setUploadedFile] = useState({});
  const [numPages, setNumPages] = useState({});

  const fetchDocumentTypeList = () => {
    dispatch({
      type: 'projectDetails/fetchDocumentTypeListEffect',
    });
  };

  useEffect(() => {
    if (visible) {
      fetchDocumentTypeList();
    }
  }, [visible]);

  const handleUpload = async (file) => {
    const getBase64 = (img, callback) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    };

    if (!file.url && !file.preview) {
      getBase64(file, (imageUrl) => setUploadedPreview(imageUrl));
    }
    setUploadedFile(file);
  };

  const identifyImageOrPdf = (name) => {
    const parts = name.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 0;
      case 'pdf':
        return 1;
      default:
        return 2;
    }
  };

  const beforeUpload = (file) => {
    const maxFileSize = 25;
    const checkType = identifyImageOrPdf(file.name) === 0 || identifyImageOrPdf(file.name) === 1;

    if (!checkType) {
      message.error('You can only upload JPG/PNG/PDF file!');
    }
    const isLtMaxFileSize = file.size / 1024 / 1024 < maxFileSize;
    if (!isLtMaxFileSize) {
      if (file.type === 'image/jpeg') {
        message.error(`Image must smaller than ${maxFileSize}MB!`);
      }
      if (file.type === 'application/pdf') {
        message.error(`File must smaller than ${maxFileSize}MB!`);
      }
    }
    return checkType && isLtMaxFileSize;
  };

  // finish
  const addDocument = async (values, attachment) => {
    const res = await dispatch({
      type: 'projectDetails/addDocumentEffect',
      payload: {
        ...values,
        projectId,
        attachment,
        owner: employeeId,
        ownerName: employeeName,
      },
    });
    if (res.statusCode === 200) {
      refreshData();
      onClose();
    }
  };

  const handleFinish = (values) => {
    const formData = new FormData();
    formData.append('uri', uploadedFile);
    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    }).then((response) => {
      const { data: imageData = [] } = response;
      const { id = '' } = imageData[0];
      addDocument(values, id);
    });
  };

  const onDocumentLoadSuccess = ({ numPages: n }) => {
    setNumPages(n);
  };

  const _renderPreview = () => {
    if (uploadedPreview.includes('application/pdf')) {
      return (
        <div className={styles.fileUploadedContainer}>
          <Document
            className={styles.pdfFrame}
            file={uploadedPreview}
            noData="Document Not Found"
            onDocumentLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                loading=""
                className={styles.pdfPage}
                key={`page_${index + 1}`}
                pageNumber={index + 1}
              />
            ))}
          </Document>
        </div>
      );
    }
    return (
      <div className={styles.fileUploadedContainer}>
        <img src={uploadedPreview} alt="preview" />
      </div>
    );
  };

  return (
    <div className={styles.AddContent}>
      <Form name="basic" ref={formRef} id="myForm" onFinish={handleFinish} initialValues={{}}>
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Document Type"
              name="documentType"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Select Document Type' }]}
            >
              <Select placeholder="Select Document Type">
                {documentTypeList.map((item) => {
                  return <Select.Option key={item.id}>{item.type_name}</Select.Option>;
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Document Name"
              name="documentName"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Enter Document Name' }]}
            >
              <Input placeholder="Enter Document Name" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item label="Comments (Optional)" name="comments" labelCol={{ span: 24 }}>
              <Input.TextArea autoSize={{ minRows: 4 }} placeholder="Enter Comments" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name="file">
              <Upload.Dragger
                multiple={false}
                showUploadList={false}
                action={(file) => handleUpload(file)}
                beforeUpload={beforeUpload}
              >
                {uploadedPreview ? (
                  _renderPreview()
                ) : (
                  <div className={styles.content}>
                    <div className={styles.viewIconDownload}>
                      <div className={styles.viewIconDownload__circle}>
                        <img src={UploadIcon} alt="upload" />
                      </div>
                    </div>
                    <p className={styles.title}>Drag and drop your file here</p>
                    <p className={styles.text}>
                      or <span className={styles.browse}>browse</span> to upload a file
                    </p>
                    <p className={styles.helpText}>
                      File size should not be more than 25mb. Supported file for view: pdf &amp;
                      jpeg{' '}
                    </p>
                  </div>
                )}
              </Upload.Dragger>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default connect(({ projectDetails, user: { currentUser = {} } }) => ({
  projectDetails,
  currentUser,
}))(AddContent);
