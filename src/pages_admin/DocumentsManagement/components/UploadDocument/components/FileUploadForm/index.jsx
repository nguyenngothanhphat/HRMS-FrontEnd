import React, { PureComponent } from 'react';
import { Upload, message, Button } from 'antd';
import FileUploadIcon from '@/assets/uploadFile_icon.svg';
import styles from './index.less';

const { Dragger } = Upload;

export default class FileUploadForm extends PureComponent {
  render() {
    return (
      <div className={styles.FileUploadForm}>
        <Dragger
          name="file"
          showUploadList={false}
          onChange={(info) => {
            const { status } = info.file;
            if (status !== 'uploading') {
              // eslint-disable-next-line no-console
              console.log(info.file, info.fileList);
            }
            if (status === 'done') {
              message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
              message.error(`${info.file.name} file upload failed.`);
            }
          }}
        >
          <>
            <p className={styles.uploadIcon}>
              <img src={FileUploadIcon} alt="upload" />
            </p>
          </>

          <p className={styles.uploadText}>Drap and drop the file here</p>
          <p className={styles.uploadText}>or</p>
          <Button>Choose file</Button>
        </Dragger>
      </div>
    );
  }
}
