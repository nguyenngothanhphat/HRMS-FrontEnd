import React, { PureComponent } from 'react';
import { Upload, message, Button } from 'antd';
import { connect } from 'umi';
import FileUploadIcon from '@/assets/uploadFile_icon.svg';
import styles from './index.less';

const { Dragger } = Upload;
@connect()
class FileUploadForm extends PureComponent {
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
    return (
      <div className={styles.FileUploadForm}>
        <Dragger
          beforeUpload={this.beforeUpload}
          showUploadList={false}
          action={(file) => this.handleUpload(file)}
        >
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

export default FileUploadForm;
