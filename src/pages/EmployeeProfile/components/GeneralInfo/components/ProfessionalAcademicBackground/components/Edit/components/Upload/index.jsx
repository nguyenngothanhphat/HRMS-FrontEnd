import React, { Component } from 'react';
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from './index.less';

class UploadCertification extends Component {
  beforeUpload = (file) => {
    const checkType =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
    if (!checkType) {
      message.error('You can only upload JPG/PNG/PDF file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return checkType && isLt2M;
  };

  handleUpload = (info) => {
    const { handleFieldChange = () => {}, index } = this.props;
    const { status, originFileObj } = info.file;
    if (status === 'done') {
      const formData = new FormData();
      formData.append('file', originFileObj);
      // call API upload with data is formData
      // console.log('formData', formData);
      handleFieldChange(
        index,
        'urlFile',
        'https://binaries.templates.cdn.office.net/support/templates/en-us/lt22671785_quantized.png',
      );
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  handleDeleteBtn = () => {
    const { handleFieldChange = () => {}, index } = this.props;
    handleFieldChange(index, 'urlFile', '');
  };

  render() {
    const props = {
      name: 'file',
      multiple: false,
      showUploadList: false,
    };
    const { item: { urlFile = '' } = {} } = this.props;
    return (
      <div className={styles.root}>
        {!urlFile ? (
          <Upload {...props} onChange={this.handleUpload} beforeUpload={this.beforeUpload}>
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        ) : (
          <div className={styles.viewRow}>
            <div>
              <a
                href={urlFile}
                target="_blank"
                rel="noopener noreferrer"
                id="img-certification"
                className={styles.nameCertification}
              >
                File Name
              </a>
              <img
                src="/assets/images/iconFilePNG.svg"
                alt="iconFilePNG"
                className={styles.iconCertification}
              />
            </div>
            <div className={styles.textDelete} onClick={this.handleDeleteBtn}>
              Delete
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UploadCertification;
