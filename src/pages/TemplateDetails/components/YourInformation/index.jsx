/* eslint-disable compat/compat */

import React, { PureComponent } from 'react';
import { formatMessage, connect } from 'umi';
import { Row, Col, Form, Input, message, Upload, Button } from 'antd';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
// import UploadImage from '@/components/UploadImage';
import { InboxOutlined } from '@ant-design/icons';

import styles from './index.less';

const { Dragger } = Upload;

const propsUpload = {
  name: 'file',
  multiple: false,
  showUploadList: false,
};

@connect(
  ({
    loading,
    upload: { urlImage = '' },
    employeeSetting: {
      isAbleToSubmit = false,
      currentTemplate: { title = '', htmlContent = '', thumbnail = '' } = {},
      newTemplateData: { settings = [], fullname = '', signature = '' },
    },
  }) => ({
    loadingUploadFile: loading.effects['employeeSetting/uploadFile'],
    urlImage,
    isAbleToSubmit,
    settings,
    fullname,
    thumbnail,
    signature,
    title,
    htmlContent,
  }),
)
class YourInformation extends PureComponent {
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

  // normFile = (e) => {
  //   console.log('Upload event:', e);
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e && e.fileList;
  // };
  componentDidMount() {
    this.checkSubmit();
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
    const { dispatch, getResponse = () => {}, onNext } = this.props;
    const { croppedImage } = this.state;
    const formData = new FormData();
    formData.append('uri', croppedImage);
    dispatch({
      type: 'employeeSetting/uploadFile',
      payload: formData,
      isUploadSignature: true,
      // });
    })
      .then((resp) => {
        getResponse(resp);
      })
      .then(() => onNext());
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

  onNext = () => {
    this.handleUploadToServer();
  };

  checkSubmit = () => {
    // const { croppedImage } = this.state;
    const { dispatch, settings, fullname, title } = this.props;
    const newSetting = settings.filter((item) => item !== null && item !== undefined);
    const check = newSetting.map((data) => data.value !== '').every((data) => data === true);
    if (check === true && title !== '' && fullname !== '') {
      dispatch({
        type: 'employeeSetting/save',
        payload: {
          isAbleToSubmit: true,
        },
      });
    } else {
      dispatch({
        type: 'employeeSetting/save',
        payload: {
          isAbleToSubmit: false,
        },
      });
    }
  };

  handleChangeInput = (e) => {
    const { dispatch } = this.props;
    const { target } = e;
    const { value } = target;

    this.checkSubmit();
    dispatch({
      type: 'employeeSetting/saveTemplate',
      payload: {
        fullname: value,
      },
    });
  };

  render() {
    const { loadingUploadFile, isAbleToSubmit } = this.props;
    const { imageUrl, crop } = this.state;
    const width = '231' || 'auto';

    return (
      <div className={styles.YourInformation}>
        <Form
          className={styles.basicInformation__form}
          wrapperCol={{ span: 24 }}
          name="basic"
          onFocus={this.onFocus}
        >
          <Row gutter={[48, 0]}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                label={formatMessage({ id: 'component.yourInformation.fullName' })}
                name="fullName"
              >
                <Input
                  onChange={(e) => this.handleChangeInput(e)}
                  className={styles.formInput}
                  name="fullName"
                />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                label={formatMessage({ id: 'component.yourInformation.designation' })}
                name="designation"
              >
                <Input
                  // onChange={(e) => this.handleChange(e)}
                  className={styles.formInput}
                  name="designation"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Signature">
                {/* <Form.Item
                  name="dragger"
                  valuePropName="fileList"
                  getValueFromEvent={this.normFile}
                  noStyle
                > */}
                {/* <Upload.Dragger name="files" action="/upload.do">
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      {formatMessage({ id: 'component.yourInformation.dragFile' })}
                    </p>
                  </Upload.Dragger> */}
                {/* <UploadImage
                    content="Choose file"
                    // getResponse={(res) => handleFile(res, index, id, docList)}
                    // loading={loading}
                    hideValidation
                    // typeIndex={index}
                    // nestedIndex={id}
                    getIndexFailed={this.getIndexFailed}
                  /> */}
                {/* </Form.Item> */}
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
                    <Dragger onChange={this.onChange} beforeUpload={this.beforeUpload}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    </Dragger>
                  )}
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Button
          className={`${styles.YourInformation__button__primary} ${
            !isAbleToSubmit ? styles.YourInformation__button__disabled : ''
          }`}
          disabled={!isAbleToSubmit}
          onClick={this.onNext}
          type="primary"
          loading={loadingUploadFile}
        >
          {formatMessage({ id: 'component.editForm.next' })}
        </Button>
      </div>
    );
  }
}

export default YourInformation;
