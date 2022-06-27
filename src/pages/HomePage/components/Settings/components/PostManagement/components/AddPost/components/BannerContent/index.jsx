import { Form, Upload } from 'antd';
import React from 'react';
import AttachmentIcon from '@/assets/attachment.svg';
import { beforeUpload } from '@/utils/homePage';
import styles from './index.less';

const { Dragger } = Upload;

const BannerContent = (props) => {
  const { defaultFileList = [] } = props;

  return (
    <div className={styles.BannerContent}>
      <Form.Item label="Media file" name="uploadFilesBN">
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

export default BannerContent;
