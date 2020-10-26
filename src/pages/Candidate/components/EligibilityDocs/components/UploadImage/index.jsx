import React, { Component } from 'react';
import { Upload, message, Spin } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(({ candidateProfile: { data } = {}, loading }) => ({
  data,
  loading: loading.effects['upload/uploadFile'],
}))
class UploadImage extends Component {
  beforeUpload = (file) => {
    const {
      setSizeImageMatch = () => {},
      data: { documentListToRender },
      typeIndex,
      nestedIndex,
      dispatch,
    } = this.props;
    const checkType =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
    if (!checkType) {
      message.error('You can only upload JPG/PNG/PDF file!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
      setSizeImageMatch(isLt5M);
      const newArrToAdjust = JSON.parse(JSON.stringify(documentListToRender));
      newArrToAdjust[typeIndex].data[nestedIndex].isValidated = false;
      dispatch({
        type: 'candidateProfile/saveOrigin',
        payload: {
          documentListToRender: newArrToAdjust,
        },
      });
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

  render() {
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
        {content}
      </Upload>
    );
  }
}

export default UploadImage;
