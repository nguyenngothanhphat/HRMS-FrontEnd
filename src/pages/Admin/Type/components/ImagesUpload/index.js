import { formatMessage } from 'umi-plugin-react/locale';
import React, { PureComponent } from 'react';
import { Upload, Icon, notification } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ setting }) => ({
  setting,
}))
class ImagesUpload extends PureComponent {
  handleChange = ({ file }) => {
    this.processFile(file)
      .then(() => {
        this.uploadFile(file);
      })
      .catch(({ message = '' }) => {
        if (message !== 'Deleted') {
          notification.warn({ message });
        }
      });
  };

  handleRemove = () => {
    const { onChange } = this.props;
    if (onChange) {
      onChange('');
    }
  };

  processFile = file => {
    return new Promise((resolve, reject) => {
      if (!file) reject(new Error(formatMessage({ id: 'image.invalid' })));
      if (file.status === 'removed') reject(new Error('Deleted'));
      if (typeof file.type === 'string' && !file.type.match(/image\/.*/)) {
        reject(new Error(formatMessage({ id: 'image.not-image' })));
      }
      if (file.size > 3 * 1024 * 1024)
        reject(new Error(formatMessage({ id: 'common.error.file-too-large' })));
      const reader = new FileReader();
      const image = new Image();
      reader.onloadend = () => {
        image.src = reader.result;
      };

      image.onload = () => {
        resolve();
      };
      reader.readAsDataURL(file);
    });
  };

  uploadFile = file => {
    const { dispatch, type, onChange } = this.props;
    const data = new FormData();
    data.append('file', file);
    dispatch({
      type: 'setting/uploadImage',
      payload: data,
      imageType: type,
    }).then(response => {
      const { url } = response.data[0];
      if (typeof onChange === 'function') onChange(url);
    });
  };

  beforeUpload = () => {
    return false;
  };

  render() {
    const { value } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{formatMessage({ id: 'common.button.upload' })}</div>
      </div>
    );
    let img;
    if (value) {
      img = <img alt="..." src={value} />;
    }

    return (
      <div className={styles.picturesWall}>
        <Upload
          className={styles.uploadBox}
          listType="picture-card"
          onChange={this.handleChange}
          showUploadList={false}
          beforeUpload={this.beforeUpload}
        >
          {img || uploadButton}
        </Upload>
      </div>
    );
  }
}

export default ImagesUpload;
