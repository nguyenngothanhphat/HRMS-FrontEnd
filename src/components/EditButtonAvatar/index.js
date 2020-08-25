import React, { Component } from 'react';
import { Upload, notification, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ setting: { urlImage }, user: { currentUser: { avatarUrl: avatar } } }) => ({
  urlImage,
  avatar,
}))
class EditButtonAvatar extends Component {
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
    const { dispatch, type } = this.props;
    const data = new FormData();
    data.append('file', file);
    dispatch({
      type: 'setting/uploadAvatar',
      payload: data,
      imageType: type,
    });
  };

  render() {
    const { disabled } = this.props;
    return (
      <Upload
        disabled={disabled}
        showUploadList={false}
        onChange={this.handleChange}
        beforeUpload={() => false}
      >
        <Button className={styles.editBtn} type="primary">
          <img
            src="/assets/img/edit.png"
            alt="avatar"
            style={{ width: '10px', marginLeftL: '-7px' }}
          />
          {formatMessage({ id: 'profile.editBtn' })}
        </Button>
      </Upload>
    );
  }
}

export default EditButtonAvatar;
