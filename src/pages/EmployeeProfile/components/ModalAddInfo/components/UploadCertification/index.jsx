import React, { Component } from 'react';
import { Button, Upload, message } from 'antd';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { connect } from 'umi';
import { UploadOutlined } from '@ant-design/icons';
import styles from './index.less';

@connect(({ loading }) => ({
  loading: loading.effects['upload/uploadFile'],
}))
class UploadCertification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      linkImage: '',
    };
  }

  handleOpenModalReview = (linkImage) => {
    this.setState({
      visible: true,
      linkImage,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
    setTimeout(() => {
      this.setState({
        linkImage: '',
      });
    }, 500);
  };

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

  handleUpload = async (file) => {
    const { dispatch } = this.props;
    const formData = new FormData();
    formData.append('uri', file);
    const resp = await dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    });
    this.triggerChangeUpload(resp);
  };

  triggerChangeUpload = (resp) => {
    const { handleFieldChange = () => {}, item } = this.props;
    const { statusCode, data = [] } = resp;
    if (statusCode === 200) {
      const [first] = data;
      const { url = '' } = first;
      handleFieldChange(item, url);
    }
  };

  handleDeleteBtn = () => {
    const { handleFieldChange = () => {}, item } = this.props;
    handleFieldChange(item, '');
  };

  render() {
    const props = {
      name: 'file',
      multiple: false,
      showUploadList: false,
    };
    const { visible, linkImage } = this.state;
    const { url: urlFile = '', loading } = this.props;
    const nameFile = urlFile.split('/').pop();
    return (
      <div className={styles.root}>
        {!urlFile ? (
          <Upload
            {...props}
            beforeUpload={this.beforeUpload}
            action={(file) => this.handleUpload(file)}
          >
            <Button
              type="link"
              loading={loading}
              icon={<UploadOutlined style={{ color: '#FFA100' }} />}
              className={styles.btnUpload}
              style={{ color: '#FFA100', padding: '0' }}
            >
              Upload File
            </Button>
          </Upload>
        ) : (
          <div className={styles.viewRow}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p
                onClick={() => this.handleOpenModalReview(urlFile)}
                className={styles.nameCertification}
              >
                {nameFile}
              </p>
              <img
                src="/assets/images/iconFilePNG.svg"
                alt="iconFilePNG"
                className={styles.iconCertification}
              />
            </div>
            <img
              src="/assets/images/remove.svg"
              alt="remove"
              className={styles.iconDelete}
              onClick={this.handleDeleteBtn}
            />
          </div>
        )}
        <ViewDocumentModal visible={visible} onClose={this.handleCancel} url={linkImage} />
      </div>
    );
  }
}

export default UploadCertification;
