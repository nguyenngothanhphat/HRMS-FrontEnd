import { Form, Input, Upload } from 'antd';
import React from 'react';
import AttachmentIcon from '@/assets/attachment.svg';
import { beforeUpload } from '@/utils/homePage';
import styles from './index.less';

const { Dragger } = Upload;

const AnnouncementContent = (props) => {
  const { defaultFileList = [] } = props;

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

export default AnnouncementContent;
