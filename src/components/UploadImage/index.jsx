/* eslint-disable react/jsx-props-no-spreading */
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
    const { setSizeImageMatch = () => {}, isUploadPDF = false, maxFileSize = 5 } = this.props;
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
    const isLtMaxFileSize = file.size / 1024 / 1024 < maxFileSize;
    if (!isLtMaxFileSize) {
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        message.error(`Image must smaller than ${maxFileSize}MB!`);
      }
      if (file.type === 'application/pdf') {
        message.error(`File must smaller than ${maxFileSize}MB!`);
      }
      setSizeImageMatch(isLtMaxFileSize);
      this.setState({ check: isLtMaxFileSize });
    }
    setTimeout(() => {
      setSizeImageMatch(isLtMaxFileSize);
      this.setState({ check: isLtMaxFileSize });
    }, 2000);
    return checkType && isLtMaxFileSize;
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
    const { content = 'Your content', loading = false, disabledFields = false } = this.props;
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
        disabled={disabledFields}
      >
        {!check && <span className={styles.ShowTestValidation}>File must me under 5 Mb </span>}
        {content} {!check && <img src={undo} alt="undo" />}
      </Upload>
    );
  }
}

export default UploadImage;
