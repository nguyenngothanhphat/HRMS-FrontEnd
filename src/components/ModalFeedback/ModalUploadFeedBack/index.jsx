/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { connect } from 'umi';
import UploadImage from '@/assets/uploadIcon.svg';
import styles from './index.less';
import { beforeUpload, compressImage, FILE_TYPE } from '@/utils/upload';

const { Dragger } = Upload;
const propsUpload = {
  name: 'file',
  multiple: false,
  showUploadList: false,
};

// Component has 5 props:  handleCancel =()=>{}, getResponse = () => {}, titleModal = "", visible= boolean, widthImage =""

@connect(({ loading }) => ({
  loading: loading.effects['upload/uploadFile'],
}))
class ModalUploadFeedBack extends Component {
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
    const { handleCancelModalUpload = () => {}, openFeedback = () => {} } = this.props;
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
      handleCancelModalUpload(),
      openFeedback(),
    );
  };

  handleUploadToServer = async () => {
    const { dispatch, handleUploadScreenshot = () => {} } = this.props;
    const { croppedImage } = this.state;
    const compressedFile = await compressImage(croppedImage);
    const formData = new FormData();
    formData.append('blob', compressedFile, croppedImage.name);
    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
      showNotification: false,
    }).then((resp) => {
      handleUploadScreenshot(resp);
      this.setState({
        fileUploaded: {},
        imageUrl: '',
      });
    });
  };

  renderHeaderModal = () => {
    const { titleModal = 'Your title' } = this.props;
    const { imageUrl } = this.state;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
        {imageUrl && (
          <Upload
            {...propsUpload}
            onChange={this.onChange}
            beforeUpload={(file) => beforeUpload(file, [FILE_TYPE.IMAGE, FILE_TYPE.PDF], 2)}
          >
            <div className={styles.header__upload}>
              <img
                className={styles.header__upload__icon}
                src="/assets/images/iconUpload.svg"
                alt="img-upload"
              />
              <span className={styles.header__upload__text}>Upload new</span>
            </div>
          </Upload>
        )}
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
    const { fileUploaded: { name = '', type = '' } = {} } = this.state;
    if (this.imageRef && crop.width && crop.height) {
      const croppedImage = await this.getCroppedImg(this.imageRef, crop);
      const file = new File([croppedImage], name, { type });
      this.setState({ croppedImage: file });
    }
  };

  getCroppedImg = (image, crop) => {
    const { fileUploaded: { name = '', type = '' } = {} } = this.state;
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
      }, type);
    });
  };

  render() {
    const { visible = false, widthImage = '', loading, widthModal = '' } = this.props;
    const width = widthImage || 'auto';
    const { imageUrl, crop } = this.state;
    return (
      <Modal
        className={styles.modalUploadFeedBack}
        visible={visible}
        width={widthModal}
        title={this.renderHeaderModal()}
        onOk={this.handleUploadToServer}
        onCancel={this.handleCancel}
        destroyOnClose={this.handleCancel}
        maskClosable={false}
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
            Add Document
          </Button>,
        ]}
      >
        <div className={styles.describe}>
          You can upload a screenshot and describe the issue in the next screen.
        </div>
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
            <Dragger
              {...propsUpload}
              onChange={this.onChange}
              beforeUpload={(file) => beforeUpload(file, [FILE_TYPE.IMAGE, FILE_TYPE.PDF], 2)}
            >
              <p className="ant-upload-drag-icon">
                <img src={UploadImage} alt="" />
              </p>
              <div className={styles.titleUpload}>Drag & drop your file here</div>
              <div className={styles.uploadTextCenter}>
                or <span className={styles.uploadTextCenter__browse}>browse</span> to upload a file
              </div>
              <div className={styles.uploadTextEnd}>
                File size should not be more than 2MB. Supported file for view: pdf & jpeg!
              </div>
            </Dragger>
          )}
        </div>
      </Modal>
    );
  }
}

export default ModalUploadFeedBack;
