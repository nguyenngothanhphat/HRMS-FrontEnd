import { Upload, message } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const UploadComponent = (props) => {
  const {
    content = 'Upload',
    loading = false,
    item = {},
    dispatch,
    getResponse = () => {},
  } = props;

  const isFileValid = (fileName) => {
    const parts = fileName.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'pdf':
        return true;
      default:
        return false;
    }
  };

  const beforeUpload = (f) => {
    const checkType = isFileValid(f.name);
    if (!checkType) {
      message.error('You can only upload JPEG/JPG, PNG, PDF file!');
    }
    const isLt5M = f.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
    }
    return checkType && isLt5M;
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('uri', file);
    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    }).then((res) => {
      getResponse(item.key, res);
    });
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
  };
  return (
    <Upload
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...uploadProps}
      beforeUpload={loading ? () => {} : beforeUpload}
      disabled={loading}
      action={
        loading
          ? () => {}
          : (fileData) => {
              handleUpload(fileData);
            }
      }
      className={[styles.UploadImageFile, loading ? styles.disableButton : '']}
    >
      {content}
    </Upload>
  );
};

export default connect(({ candidatePortal: { data } = {}, loading }) => ({
  data,
  loading: loading.effects['upload/uploadFile'],
}))(UploadComponent);
