import { Button, Col, Form, Input, message, Row, Select, Upload } from 'antd';
import React from 'react';
import { connect } from 'umi';
import ImageIcon from '@/assets/image_icon.png';
import PDFIcon from '@/assets/pdf_icon.png';
import UploadIcon from '@/assets/upload-icon.svg';
import styles from './index.less';

const AddContent = (props) => {
  const formRef = React.createRef();
  const { date = '', projectName = '', fileName = '' } = props;

  const onAction = (file) => {
    //
  };

  const identifyImageOrPdf = (name) => {
    const parts = name.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        // case 'gif':
        // case 'bmp':
        // case 'png':
        return 0;
      case 'pdf':
        return 1;
      default:
        return 0;
    }
  };

  const beforeUpload = (file) => {
    const maxFileSize = 25;
    const checkType = file.type === 'application/pdf' || file.type === 'image/jpeg';

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

  return (
    <div className={styles.AddContent}>
      <Form
        name="basic"
        ref={formRef}
        id="myForm"
        // onFinish={handleFinish}
        initialValues={{}}
      >
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col xs={24} md={12}>
            <Form.Item label="Document Type" name="documentType" labelCol={{ span: 24 }}>
              <Select placeholder="Enter Document Type">
                {[].map((item) => {
                  return <Select.Option key={item.id}>{item.type_name}</Select.Option>;
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Document Name" name="documentName" labelCol={{ span: 24 }}>
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
                name="file"
                multiple={false}
                showUploadList={false}
                action={(file) => onAction(file)}
                beforeUpload={beforeUpload}
              >
                {fileName !== '' ? (
                  <div className={styles.fileUploadedContainer}>
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
                    <Button>Choose an another file</Button>
                  </div>
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

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
}))(AddContent);
