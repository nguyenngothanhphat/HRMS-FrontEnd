import React, { Component } from 'react';
import { Upload, message, Spin } from 'antd';
import { connect } from 'umi';

@connect()
class UploadImage extends Component {
  beforeUpload = (file) => {
    const { dispatch } = this.props;
    const checkType =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
    if (!checkType) {
      message.error('You can only upload JPG/PNG/PDF file!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('File must smaller than 5MB!');
    }
    return checkType;
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
    const { content = 'Your content', loading = false } = this.props;
    if (loading) {
      return <Spin loading={loading} active />;
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
      >
        {content}
      </Upload>
    );
  }
}

export default UploadImage;
