import React, { Component } from 'react';
import { Button, Upload, message } from 'antd';
import { connect } from 'umi';
import { UploadOutlined } from '@ant-design/icons';
import styles from './index.less';

@connect(({ loading }) => ({
  loading: loading.effects['upload/uploadFile'],
}))
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

  handleUpload = (file) => {
    const { dispatch } = this.props;
    const formData = new FormData();
    formData.append('uri', file);
    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    }).then((resp) => {
      this.triggerChangeUpload(resp);
    });
  };

  triggerChangeUpload = (resp) => {
    const { handleFieldChange = () => {}, index } = this.props;
    const { statusCode, data = [] } = resp;
    if (statusCode === 200) {
      const [first] = data;
      handleFieldChange(index, 'urlFile', first.url);
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
    const { item: { urlFile = '' } = {}, loading } = this.props;
    return (
      <div className={styles.root}>
        {!urlFile ? (
          <Upload
            {...props}
            beforeUpload={this.beforeUpload}
            action={(file) => this.handleUpload(file)}
          >
            <Button loading={loading} icon={<UploadOutlined />}>
              Click to upload
            </Button>
          </Upload>
        ) : (
          <div className={styles.viewRow}>
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
            <img
              src="/assets/images/remove.svg"
              alt="remove"
              className={styles.iconDelete}
              onClick={this.handleDeleteBtn}
            />
          </div>
        )}
      </div>
    );
  }
}

export default UploadCertification;
