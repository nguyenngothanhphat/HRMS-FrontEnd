import { Form, Input, Upload } from 'antd';
import React from 'react';
import AttachmentIcon from '@/assets/attachment.svg';
import { beforeUpload } from '@/utils/homePage';
import styles from './index.less';

const { Dragger } = Upload;

const ImagesContent = (props) => {
  const { defaultFileList = [] } = props;

  return (
    <div className={styles.ImagesContent}>
      <Form.Item
        label="Title"
        name="titleI"
        rules={[
          {
            required: true,
            message: 'Required field!',
          },
        ]}
      >
        <Input placeholder="Enter the title" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="descriptionI"
        rules={[
          {
            required: true,
            message: 'Required field!',
          },
        ]}
      >
        <Input.TextArea
          placeholder="Enter the description"
          maxLength={500}
          showCount={{
            formatter: ({ count, maxLength }) => {
              return `Character Limit: ${count}/${maxLength}`;
            },
          }}
          autoSize={{
            minRows: 5,
            maxRows: 10,
          }}
        />
      </Form.Item>

      <Form.Item label="Media file" name="uploadFilesI">
        <Dragger
          beforeUpload={beforeUpload}
          listType="picture"
          className={styles.fileUploadForm}
          // multiple
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

export default ImagesContent;
