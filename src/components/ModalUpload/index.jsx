/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { connect } from 'umi';
import { InboxOutlined } from '@ant-design/icons';
import { Document, Page } from 'react-pdf';
import styles from './index.less';

const { Dragger } = Upload;
const propsUpload = {
  name: 'file',
  multiple: false,
  showUploadList: false,
};

const PNG_TYPE = 'image/png';
const JPEG_TYPE = 'image/jpeg';
const PDF_TYPE = 'application/pdf';

/* Component has 6 props:  
  handleCancel = () => {}, 
  getResponse = () => {}, 
  formatType = [],
  titleModal = "", 
  visible= boolean, 
  widthImage =""
 */
@connect(({ loading }) => ({
  loading: loading.effects['upload/uploadFile'],
}))
class ModalUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUploaded: {},
      imageUrl: '',
      fileType: '',
      fileData: '',
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
    const { formatType = [PNG_TYPE, JPEG_TYPE, PDF_TYPE] } = this.props;
    this.setState({ fileType: file.type });
    const isJpgOrPng = formatType.includes(file.type);
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('Image must smaller than 5MB!');
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
    const { croppedImage, fileType, fileData } = this.state;
    const formData = new FormData();
    const dataUri = fileType === PDF_TYPE ? fileData : croppedImage;
    formData.append('uri', dataUri);
    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
      isUploadAvatar: true,
    }).then((resp) => {
      this.setState({ imageUrl: '' });
      getResponse(resp);
    });
  };

  renderHeaderModal = () => {
    const { titleModal = 'Your title' } = this.props;
    const { imageUrl } = this.state;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
        {imageUrl && (
          <Upload {...propsUpload} onChange={this.onChange} beforeUpload={this.beforeUpload}>
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
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
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
    const { visible = false, widthImage = '', loading } = this.props;
    const width = widthImage || 'auto';
    const { imageUrl, crop, fileType } = this.state;
    return (
      <Modal
        className={styles.modalUpload}
        visible={visible}
        title={this.renderHeaderModal()}
        onOk={this.handleUploadToServer}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={[
          // <div key="cancel" className={styles.btnCancel} onClick={this.handleCancel}>
          //   Cancel
          // </div>,
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
            <>
              {fileType === PDF_TYPE ? (
                <Document file={imageUrl}>
                  <Page pageNumber={1} />
                </Document>
              ) : (
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
              )}
            </>
          ) : (
            <Dragger
              {...propsUpload}
              onChange={this.onChange}
              beforeUpload={this.beforeUpload}
              action={(data) => this.setState({ fileData: data })}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <div className={styles.uploadText}>Type of file: PDF/PNG/JPEG</div>
              <div className={styles.uploadText}>Size of image must be smaller than 5MB!</div>
            </Dragger>
          )}
        </div>
      </Modal>
    );
  }
}

export default ModalUpload;
