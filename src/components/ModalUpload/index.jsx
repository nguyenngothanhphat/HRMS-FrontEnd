/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { connect } from 'umi';
import styles from './index.less';

// Component has 6 props: key="", handleCancel =()=>{}, getResponse = () => {}, titleModal = "", visible= boolean, widthImage =""

@connect(({ loading }) => ({
  loading: loading.effects['upload/uploadFile'],
}))
class ModalUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUploaded: {},
      imageUrl: '',
      crop: {
        unit: '%',
        x: 5,
        y: 5,
        width: 75,
        height: 75,
      },
      croppedImage: null,
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
    if (status === 'done') {
      // message.success(`${info.file.name} file uploaded successfully.`);
      this.getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          fileUploaded: info.file.originFileObj,
          imageUrl,
        }),
      );
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState(
      {
        fileUploaded: {},
        imageUrl: '',
        crop: {
          unit: '%',
          x: 5,
          y: 5,
          width: 75,
          height: 75,
        },
        croppedImage: null,
      },
      () => handleCancel(),
    );
  };

  handleUploadToServer = () => {
    const { dispatch, getResponse = () => {} } = this.props;
    const { croppedImage } = this.state;
    const formData = new FormData();
    formData.append('uri', croppedImage);
    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
      isUploadAvatar: true,
    }).then((resp) => {
      getResponse(resp);
    });
  };

  renderHeaderModal = () => {
    const { titleModal = 'Your title' } = this.props;
    const props = {
      name: 'file',
      multiple: false,
      showUploadList: false,
    };
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
        <Upload {...props} onChange={this.onChange} beforeUpload={this.beforeUpload}>
          <div className={styles.header__upload}>
            <img
              className={styles.header__upload__icon}
              src="/assets/images/iconUpload.svg"
              alt="img-upload"
            />
            <span className={styles.header__upload__text}>Upload new</span>
          </div>
        </Upload>
      </div>
    );
  };

  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop) => {
    this.setState({ crop });
  };

  makeClientCrop = async (crop) => {
    const { fileUploaded: { name = '' } = {} } = this.state;
    if (this.imageRef && crop.width && crop.height) {
      const croppedImage = await this.getCroppedImg(this.imageRef, crop);
      const file = new File([croppedImage], name, { type: 'image/jpeg' });
      this.setState({ croppedImage: file });
    }
  };

  getCroppedImg = (image, crop) => {
    const { fileUploaded: { name = '' } = {} } = this.state;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          return reject(new Error('Canvas is empty'));
        }
        Object.assign(blob, { name, lastModifiedDate: new Date() });
        return resolve(blob);
      }, 'image/jpeg');
    });
  };

  render() {
    const { visible = false, widthImage = '', loading, key } = this.props;
    const width = widthImage || 'auto';
    const { imageUrl, crop } = this.state;
    return (
      <Modal
        key={key}
        className={styles.modalUpload}
        visible={visible}
        title={this.renderHeaderModal()}
        onOk={this.handleUploadToServer}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={[
          <div key="cancel" className={styles.btnCancel} onClick={this.handleCancel}>
            Cancel
          </div>,
          <Button
            key="submit"
            type="primary"
            disabled={!imageUrl}
            loading={loading}
            className={styles.btnSubmit}
            onClick={this.handleUploadToServer}
          >
            Save
          </Button>,
        ]}
      >
        <div className={styles.viewImg}>
          {imageUrl ? (
            <ReactCrop
              className={styles.viewImg__img}
              style={{ width }}
              src={imageUrl}
              crop={crop}
              ruleOfThirds
              onImageLoaded={this.onImageLoaded}
              onComplete={this.onCropComplete}
              onChange={this.onCropChange}
            />
          ) : (
            <img
              src="https://semantic-ui.com/images/wireframe/white-image.png"
              alt="empty"
              className={styles.viewEmpty}
            />
          )}
        </div>
      </Modal>
    );
  }
}

export default ModalUpload;
