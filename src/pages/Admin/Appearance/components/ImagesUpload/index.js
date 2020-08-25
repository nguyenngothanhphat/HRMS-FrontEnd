import { randomBytes } from 'crypto';
import { formatMessage } from 'umi-plugin-react/locale';
import React, { PureComponent } from 'react';
import { Row, Col, Upload, Modal, Icon, notification } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ setting }) => ({
  setting,
}))
class ImagesUpload extends PureComponent {
  constructor(props) {
    super(props);
    const { value = '' } = props;
    const matchedFileName = value.match(/[^/?#]*\.[^/?#]*(\?.*)?(\\#.*)?$/);
    let fileName;
    if (Array.isArray(matchedFileName)) {
      [fileName = 'unknow-file-name'] = matchedFileName;
    }
    this.state = {
      fileList: [
        {
          uid: randomBytes(16),
          name: fileName,
          status: 'done',
          url: value,
        },
      ],
    };
  }

  handleChange = ({ file, fileList }) => {
    this.processFile(file)
      .then(() => {
        this.uploadFile(file);
        this.setState({ fileList });
      })
      .catch(({ message = '' }) => {
        if (message !== 'Deleted') {
          notification.warn({ message });
        }
        this.setState({ fileList: [] });
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
      if (file.size > 5 * 1024 * 1024)
        reject(new Error(formatMessage({ id: 'common.error.file-too-large' })));
      const reader = new FileReader();
      const image = new Image();
      reader.onloadend = () => {
        image.src = reader.result;
      };

      image.onload = () => {
        if (image.height > 512 || image.width > 512) {
          reject(new Error(formatMessage({ id: 'image.max-size' })));
        }
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

  handlePreview = file => {
    this.setState({ previewVisible: file.url || file.thumbUrl });
  };

  handleCancel = () => {
    this.setState({ previewVisible: 0 });
  };

  render() {
    const { previewVisible = 0 } = this.state;
    let { fileList } = this.state;
    if (fileList.length > 0) {
      fileList = fileList[0].url === '' ? [] : fileList;
    }
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{formatMessage({ id: 'common.button.upload' })}</div>
      </div>
    );

    return (
      <div className={styles.picturesWall}>
        <Row>
          <Col xs={8} md={6} lg={4}>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
              onRemove={this.handleRemove}
              beforeUpload={this.beforeUpload}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Col>
          <Col className={styles.note} xs={15} md={17} lg={19} offset={1}>
            <div>{formatMessage({ id: 'image.note-1' })}</div>
            <div>{formatMessage({ id: 'image.note-2' })}</div>
          </Col>
        </Row>
        <Modal width={700} visible={!!previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewVisible} />
        </Modal>
      </div>
    );
  }
}

export default ImagesUpload;
