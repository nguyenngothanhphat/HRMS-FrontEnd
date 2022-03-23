import { Form, Input, message, Upload } from 'antd';
import React from 'react';
import AttachmentIcon from '@/assets/attachment.svg';
import styles from './index.less';

const { Dragger } = Upload;

const AnnouncementContent = (props) => {
  const { defaultFileList = [] } = props;

  const identifyImage = (fileName) => {
    const parts = fileName.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 1;

      default:
        return 0;
    }
  };

  const beforeUpload = (file) => {
    const { setSizeImageMatch = () => {} } = props;
    const checkType = identifyImage(file.name) === 1;
    if (!checkType) {
      message.error('You can only upload png, jpeg image files!');
    }
    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      message.error('Image must smaller than 3MB!');
      setSizeImageMatch(isLt3M);
    }
    setTimeout(() => {
      setSizeImageMatch(isLt3M);
    }, 2000);
    return checkType && isLt3M;
  };

  return (
    <div className={styles.AnnouncementContent}>
      <Form.Item
        label="Description"
        name="descriptionA"
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
          maxLength={500}
          showCount={{
            formatter: ({ count, maxLength }) => {
              return `Character Limit: ${count}/${maxLength}`;
            },
          }}
        />
      </Form.Item>

      <Form.Item label="Media file" name="uploadFilesA">
        <Dragger
          beforeUpload={beforeUpload}
          listType="picture"
          className={styles.fileUploadForm}
          maxCount={1}
          defaultFileList={[...defaultFileList]}
        >
          <div className={styles.drapperBlock}>
            <img className={styles.uploadIcon} src={AttachmentIcon} alt="upload" />
            <span className={styles.chooseFileText}>Choose file</span>
            <span className={styles.uploadText}>or drop file here</span>
            <p className={styles.description}>
              Maximum file size 3 mb, Supported file format png, jpeg (Image size 350*300)
            </p>
          </div>
        </Dragger>
      </Form.Item>
    </div>
  );
};

export default AnnouncementContent;
