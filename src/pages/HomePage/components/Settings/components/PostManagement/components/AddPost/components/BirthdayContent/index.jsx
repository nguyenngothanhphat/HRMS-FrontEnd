import { Form, Input, message, Upload } from 'antd';
import React from 'react';
import AttachmentIcon from '@/assets/attachment.svg';
import styles from './index.less';

const { Dragger } = Upload;

const BirthdayContent = (props) => {
  const { uploadFilesB = [], setUploadFilesB = () => {} } = props;

  const identifyImageOrPdf = (fileName) => {
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

  const beforeUpload = (file) => {
    const { setSizeImageMatch = () => {} } = props;
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

  // getBase64(file, (imageUrl) => setUploadFiles([...uploadFiles, imageUrl]));

  const handleUpload = async (file) => {
    setUploadFilesB([...uploadFilesB, file]);
  };

  const handleRemove = (file) => {
    const temp = uploadFilesB.filter((x) => x.uid !== file.uid);
    setUploadFilesB(temp);
  };

  return (
    <div className={styles.BirthdayContent}>
      <Form.Item label="Description" name="descriptionB">
        <Input.TextArea
          placeholder="Enter the description"
          autoSize={{
            minRows: 5,
            maxRows: 7,
          }}
        />
      </Form.Item>

      <Form.Item label="Media" name="media">
        <Dragger
          beforeUpload={beforeUpload}
          // disabled={selectExistDocument || fileName}
          action={(file) => handleUpload(file)}
          listType="picture"
          onRemove={(file) => handleRemove(file)}
          maxCount={1}
          className={styles.fileUploadForm}
        >
          <div className={styles.drapperBlock}>
            <img className={styles.uploadIcon} src={AttachmentIcon} alt="upload" />
            <span className={styles.chooseFileText}>Choose files</span>
            <span className={styles.uploadText}>or drop files here</span>
          </div>
        </Dragger>
      </Form.Item>
    </div>
  );
};

export default BirthdayContent;
