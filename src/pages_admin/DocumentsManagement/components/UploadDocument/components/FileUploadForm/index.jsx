import React, { PureComponent } from 'react';
import { Upload, message, Button } from 'antd';
import FileUploadIcon from '@/assets/uploadFile_icon.svg';
import styles from './index.less';

const { Dragger } = Upload;

export default class FileUploadForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
    };
  }

  handlePreview = (fileName) => {
    this.setState({
      fileName,
    });
  };

  onChange = (info) => {
    const { status } = info.file;
    if (status !== 'uploading') {
      // eslint-disable-next-line no-console
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      this.handlePreview(info.file.name);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  render() {
    const { fileName = '' } = this.state;
    return (
      <div className={styles.FileUploadForm}>
        <Dragger name="file" showUploadList={false} onChange={(info) => this.onChange(info)}>
          {fileName !== '' ? (
            <div className={styles.fileUploadedContainer}>
              <p className={styles.fileName}>
                Uploaded: <a>{fileName}</a>
              </p>
              <Button>Choose an another file</Button>
            </div>
          ) : (
            <div>
              <div>
                <p className={styles.uploadIcon}>
                  <img src={FileUploadIcon} alt="upload" />
                </p>
              </div>

              <p className={styles.uploadText}>Drap and drop the file here</p>
              <p className={styles.uploadText}>or</p>
              <Button>Choose file</Button>
            </div>
          )}
        </Dragger>
      </div>
    );
  }
}
