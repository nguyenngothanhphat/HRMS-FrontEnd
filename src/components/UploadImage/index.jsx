import React, { Component } from 'react';
import { Upload, message } from 'antd';
import { connect } from 'umi';

@connect()
class UploadImage extends Component {
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
    const { dispatch, getResponse = () => {}, name = '' } = this.props;
    const formData = new FormData();
    formData.append('uri', file);
    dispatch({
      type: 'upload/uploadFileCard',
      payload: formData,
      name,
    }).then((resp) => {
      getResponse(resp);
    });
  };

  render() {
    const { content = 'Your content' } = this.props;
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
