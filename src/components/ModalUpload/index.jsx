import React, { Component } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Dragger } = Upload;

class ModalUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUploaded: {},
      imageUrl: '',
      loading: false,
    };
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  onChange = (info) => {
    const { status } = info.file;
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      this.getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    } else if (status === 'error') {
      this.setState({ loading: false });
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState(
      {
        imageUrl: '',
        loading: false,
      },
      () => handleCancel(),
    );
  };

  render() {
    const { visible = false } = this.props;
    const { loading, imageUrl } = this.state;
    const props = {
      name: 'file',
      multiple: false,
      showUploadList: false,
    };

    return (
      <Modal
        className={styles.modalUpload}
        visible={visible}
        title="Upload Image"
        onOk={() => {}}
        onCancel={this.handleCancel}
        footer={[
          <Button
            key="submit"
            type="primary"
            // loading={loading}
            className={styles.btnSubmit}
            onClick={() => {}}
          >
            Submit
          </Button>,
        ]}
      >
        <div>
          <Dragger {...props} onChange={this.onChange} beforeUpload={this.beforeUpload}>
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              <div>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or Drag file to this area to upload here</p>
              </div>
            )}
          </Dragger>
        </div>
      </Modal>
    );
  }
}

export default ModalUpload;
