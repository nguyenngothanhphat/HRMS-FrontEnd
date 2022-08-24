import { Form, Input, Select, Upload } from 'antd';
import React from 'react';
import AttachmentIcon from '@/assets/attachment.svg';
import styles from './index.less';
import UploadFileURLIcon from '@/assets/homePage/uploadURLIcon.svg';

const { Dragger } = Upload;

const AnnouncementContent = (props) => {
  const {
    defaultFileList = [],
    company: { name: companyName = '' } = {},
    isUpload = false,
    isURL = false,
  } = props;

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

      <Form.Item label="Post As" name="postAsCompany">
        <Select>
          <Select.Option value={false}>Self</Select.Option>
          <Select.Option value>{companyName}</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="Create by" name="createBy">
        <Input disabled />
      </Form.Item>

      <Form.Item label="Media file" name="uploadFilesA">
        <Dragger
          listType="picture"
          className={styles.fileUploadForm}
          fileList={[...defaultFileList]}
          multiple
          disabled={isURL}
        >
          <div className={styles.drapperBlock}>
            <img className={styles.uploadIcon} src={AttachmentIcon} alt="upload" />
            <span className={styles.chooseFileText}>Choose files</span>
            <span className={styles.uploadText}>or drop files here</span>
            <p className={styles.description}>
              Maximum file size 5 MB, Maximum file size is 5MB. Supported file formats are png, jpg,
              jpeg, mp4 & mov
            </p>
          </div>
        </Dragger>
      </Form.Item>
      <div className={styles.separator}>OR</div>
      <Form.Item
        label="Upload File by URL"
        name="urlFile"
        rules={[
          {
            pattern: /(http(s?):\/\/[^\s]+)/g,
            message: 'URL is invalid!',
          },
        ]}
      >
        <Input
          placeholder="Type your media link here"
          allowClear
          prefix={<img src={UploadFileURLIcon} alt="upload-url-icon" />}
          disabled={isUpload}
        />
      </Form.Item>
    </div>
  );
};

export default AnnouncementContent;
