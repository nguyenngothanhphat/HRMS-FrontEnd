import React, { Component } from 'react';
import { Upload, message, Spin } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(({ candidatePortal: { data } = {}, loading }) => ({
  data,
  loading: loading.effects['upload/uploadFile'],

  // loading: false,
}))
class UploadImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };
  }

  componentDidUpdate() {
    const { file } = this.state;
    if (file) {
      this.uploadFile();
    }
  }

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
        type: 'candidatePortal/saveOrigin',
        payload: {
          documentListToRender: newArrToAdjust,
        },
      });
    }
    return checkType && isLt5M;
  };

  handleUpload = async () => {
    const { handleSelectedFile } = this.props;

    const { typeIndex, nestedIndex } = this.props;
    await handleSelectedFile(typeIndex, nestedIndex);
  };

  uploadFile = () => {
    const { file } = this.state;
    const { dispatch, getResponse } = this.props;

    const formData = new FormData();
    formData.append('uri', file);

    this.setState({
      file: null,
    });

    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    }).then((res) => {
      getResponse(res);
    });
  };

  render() {
    const {
      content = 'Your content',
      loading = false,
      typeIndex,
      nestedIndex,
      selectedInner = '',
      selectedOuter = '',
    } = this.props;

    if (loading && typeIndex === selectedOuter && nestedIndex === selectedInner) {
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
        action={(fileData) => {
          this.handleUpload();
          this.setState({
            file: fileData,
          });
        }}
        className={styles.UploadImageFile}
      >
        {content}
      </Upload>
    );
  }
}

export default UploadImage;
