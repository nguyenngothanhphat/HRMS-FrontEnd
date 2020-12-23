import React, { Component } from 'react';
import { Upload, message, Spin } from 'antd';
import { connect } from 'umi';
import undo from '@/assets/undo-signs.svg';
import styles from './index.less';

@connect()
class UploadImage extends Component {
  constructor(props) {
    super(props);
    this.state = { check: true };
  }

  beforeUpload = (file) => {
    const { setSizeImageMatch = () => {}, isUploadPDF = false } = this.props;
    let checkType;
    if (isUploadPDF) {
      checkType = file.type === 'application/pdf';
    } else {
      checkType =
        file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
    }
    if (!checkType) {
      if (isUploadPDF) {
        message.error('You can only upload PDF file!');
      } else {
        message.error('You can only upload JPG/PNG/PDF file!');
      }
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        message.error('Image must smaller than 5MB!');
      }
      if (file.type === 'application/pdf') {
        message.error('File must smaller than 5MB!');
      }
      setSizeImageMatch(isLt5M);
      this.setState({ check: isLt5M });
    }
    setTimeout(() => {
      setSizeImageMatch(isLt5M);
      this.setState({ check: isLt5M });
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
      getResponse(resp);
    });
  };

  render() {
    const { check } = this.state;
    const { content = 'Your content', loading = false } = this.props;
    if (loading) {
      return <Spin loading={loading} active="true" />;
    }
    const props = {
      name: 'file',
      multiple: false,
      showUploadList: false,
    };
    return (
      <Upload
        {...props}
        beforeUpload={this.beforeUpload}
        action={(file) => this.handleUpload(file)}
        className={styles.UploadImageFile}
      >
        {check ? '' : <span className={styles.ShowTestValidation}>File must me under 5 Mb </span>}
        {content} {check ? '' : <img src={undo} alt="undo" />}
      </Upload>
    );
  }
}

export default UploadImage;
