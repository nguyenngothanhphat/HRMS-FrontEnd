import { Form, Input, Upload } from 'antd';
import React from 'react';
import AttachmentIcon from '@/assets/attachment.svg';
import { beforeUpload } from '@/utils/homePage';
import styles from './index.less';

const { Dragger } = Upload;

const BirthdayContent = (props) => {
  const { defaultFileList = [] } = props;

  return (
    <div className={styles.BirthdayContent}>
      <Form.Item
        label="Description"
        name="descriptionB"
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

      <Form.Item label="Media file" name="uploadFilesB">
        <Dragger
          beforeUpload={beforeUpload}
          listType="picture"
          maxCount={1}
          className={styles.fileUploadForm}
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

export default BirthdayContent;
