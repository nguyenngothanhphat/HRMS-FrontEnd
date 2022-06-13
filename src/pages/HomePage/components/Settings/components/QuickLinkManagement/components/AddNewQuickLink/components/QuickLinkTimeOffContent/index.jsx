import { Form, Input, message, Upload } from 'antd';
import React from 'react';
import AttachmentIcon from '@/assets/attachment.svg';
import styles from './index.less';

const { Dragger } = Upload;

const QuickLinkTimeOffContent = (props) => {
  const { defaultFileList = [] } = props;

  const identifyImage = (fileName) => {
    const parts = fileName.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'pdf':
        return 1;

      default:
        return 0;
    }
  };

  const beforeUpload = (file) => {
    const checkType = identifyImage(file.name) === 1;
    if (!checkType) {
      message.error('You can only upload pdf files!');
    }
    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      message.error('File must smaller than 3MB!');
    }
    return checkType && isLt3M;
  };

  return (
    <div className={styles.QuickLinkContent}>
      <Form.Item
        label="Description"
        name="descriptionTO"
        rules={[
          {
            required: true,
            message: 'Required field!',
          },
        ]}
      >
        <Input.TextArea
          placeholder="Enter the description"
          autoSize={{
            minRows: 5,
            maxRows: 10,
          }}
          maxLength={50}
          showCount={{
            formatter: ({ count, maxLength }) => {
              return `Character Limit: ${count}/${maxLength}`;
            },
          }}
        />
      </Form.Item>

      <Form.Item
        label="Upload file"
        name="uploadFilesTO"
        rules={[
          {
            required: true,
            message: 'Required field!',
          },
        ]}
      >
        <Dragger
          beforeUpload={beforeUpload}
          className={styles.fileUploadForm}
          defaultFileList={[...defaultFileList]}
          multiple
        >
          <div className={styles.drapperBlock}>
            <img className={styles.uploadIcon} src={AttachmentIcon} alt="upload" />
            <span className={styles.chooseFileText}>Choose files</span>
            <span className={styles.uploadText}>or drop files here</span>
            <p className={styles.description}>
              Maximum file size 3 mb, Supported file format png, jpeg (Image size 350*300)
            </p>
          </div>
        </Dragger>
      </Form.Item>
    </div>
  );
};

export default QuickLinkTimeOffContent;
