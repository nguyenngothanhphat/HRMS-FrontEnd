import React, { Component } from 'react';
import { Upload, message } from 'antd';
import { connect } from 'umi';
import undo from '@/assets/undo-signs.svg';
import styles from './index.less';

@connect(({ upload: { loadingVisaTest = [] } = {} }) => ({ loadingVisaTest }))
class UploadImage extends Component {
  constructor(props) {
    super(props);
    this.state = { check: true };
  }

  beforeUpload = (file) => {
    const { setSizeImageMatch = () => {} } = this.props;
    const checkType =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
    if (!checkType) {
      message.error('You can only upload JPG/PNG/PDF file!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
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
    const { dispatch, getResponse = () => {}, name, index, loadingVisaTest } = this.props;
    const formData = new FormData();
    formData.append('uri', file);
    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
      name,
      index,
    }).then((resp) => {
      getResponse(resp);
      if (name === 'passport') {
        dispatch({
          type: 'upload/save',
          payload: { loadingPassPort: false },
        });
      }
      if (name === 'visa') {
        const getValuesLoading = [...loadingVisaTest];
        getValuesLoading.splice(index, 1, false);
        dispatch({
          type: 'upload/save',
          payload: { loadingVisaTest: getValuesLoading },
        });
      }
    });
  };

  render() {
    const { check } = this.state;
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
        className={styles.UploadImageFile}
      >
        {check ? '' : <span className={styles.ShowTestValidation}>File must me under 5 Mb </span>}
        {content} {check ? '' : <img src={undo} alt="undo" />}
      </Upload>
    );
  }
}

export default UploadImage;
