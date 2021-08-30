import React, { PureComponent } from 'react';
import { Upload, message, Button } from 'antd';
import { connect } from 'umi';
import { UploadOutlined } from '@ant-design/icons';
import ModalReviewImage from '@/components/ModalReviewImage';
import styles from './index.less';

@connect(({ loading }) => ({
  loading: loading.effects['upload/uploadFile'],
}))
class DraggerUpLoad extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      linkImage: '',
    };
  }

  beforeUpload = (file) => {
    const checkType =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
    if (!checkType) {
      message.error('You can only upload JPG/PNG/PDF file!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
    }
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
      getResponse(resp);
    });
  };

  handleOpenModalReview = (linkImage) => {
    this.setState({
      visible: true,
      linkImage,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      linkImage: '',
    });
  };

  handleDeleteBtn = () => {
    const { handleRemoveImageUpload = () => {} } = this.props;
    handleRemoveImageUpload('helpMedia', '');
  };

  render() {
    const props = {
      name: 'file',
      multiple: false,
      showUploadList: false,
    };
    const { visible, linkImage } = this.state;
    const { loading, urlFile = '' } = this.props;
    const nameFile = urlFile.split('/').pop();
    return (
      <div className={styles.root}>
        {!urlFile ? (
          <Upload
            {...props}
            beforeUpload={this.beforeUpload}
            action={(file) => this.handleUpload(file)}
          >
            <Button icon={<UploadOutlined />} loading={loading}>
              Click to Upload
            </Button>
          </Upload>
        ) : (
          <div className={styles.viewRow}>
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
            <img
              src="/assets/images/remove.svg"
              alt="remove"
              className={styles.iconDelete}
              onClick={this.handleDeleteBtn}
            />
          </div>
        )}
        <ModalReviewImage visible={visible} handleCancel={this.handleCancel} link={linkImage} />
      </div>
    );
  }
}

export default DraggerUpLoad;
