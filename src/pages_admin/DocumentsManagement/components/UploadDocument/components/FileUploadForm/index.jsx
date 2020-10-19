import React, { PureComponent } from 'react';
import { Upload, message, Button, Spin } from 'antd';
import { connect } from 'umi';
import FileUploadIcon from '@/assets/uploadFile_icon.svg';
import PDFIcon from '@/assets/pdf_icon.png';
import ImageIcon from '@/assets/image_icon.png';

import styles from './index.less';

const { Dragger } = Upload;
@connect(({ loading }) => ({
  loadingUploadAttachment: loading.effects['upload/uploadFile'],
}))
class FileUploadForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
    };
  }

  identifyImageOrPdf = (fileName) => {
    const parts = fileName.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'png':
        return 0;
      case 'pdf':
        return 1;
      default:
        return 0;
    }
  };

  handlePreview = (fileName) => {
    this.setState({
      fileName,
    });
  };

  beforeUpload = (file) => {
    const { setSizeImageMatch = () => {} } = this.props;
    const checkType =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
    if (!checkType) {
      message.error('You can only upload JPG/PNG/PDF file!');
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

  handleUpload = (file) => {
    const { dispatch, getResponse = () => {} } = this.props;

    const formData = new FormData();
    formData.append('uri', file);
    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    }).then((resp) => {
      const { data = [] } = resp;
      const { name = '' } = data[0];
      getResponse(resp);
      this.handlePreview(name);
    });
  };

  render() {
    const { fileName = '' } = this.state;
    const { loadingUploadAttachment } = this.props;
    return (
      <div className={styles.FileUploadForm}>
        <Dragger
          beforeUpload={this.beforeUpload}
          showUploadList={false}
          action={(file) => this.handleUpload(file)}
        >
          {fileName !== '' ? (
            <div className={styles.fileUploadedContainer}>
              <p className={styles.previewIcon}>
                {this.identifyImageOrPdf(fileName) === 1 ? (
                  <img src={PDFIcon} alt="pdf" />
                ) : (
                  <img src={ImageIcon} alt="img" />
                )}
              </p>
              <p className={styles.fileName}>
                Uploaded: <a>{fileName}</a>
              </p>
              <Button>Choose an another file</Button>
            </div>
          ) : (
            <div>
              {loadingUploadAttachment ? (
                <Spin />
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
            </div>
          )}
        </Dragger>
      </div>
    );
  }
}

export default FileUploadForm;
