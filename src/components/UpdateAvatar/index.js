/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Modal, Row, Col, Icon, Button, Upload } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import 'cropperjs/dist/cropper.css';
import ImageEditorRc from 'react-cropper-image-editor';
import styles from './style.less';

@connect(({ loading }) => ({
  loadingImage: loading.effects['user/updateUserProfile'],
  loadingAvatar: loading.effects['setting/uploadAvatar'],
}))
class UpdateAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      disabled: false,
      loading: false,
    };
    this.cropImg = React.createRef();
  }

  fileUpload = file => {
    const { onChange, dispatch, type } = this.props;
    const data = new FormData();
    data.append('file', file);
    dispatch({
      type: 'setting/uploadAvatar',
      payload: data,
      imageType: type,
    }).then(response => {
      const { data: arrayImageObj = [], statusCode } = response;
      const [imageObj = {}] = arrayImageObj;
      const { url = '' } = imageObj;
      if (statusCode === 200) {
        if (typeof onChange === 'function') {
          onChange(url);
        }
        dispatch({
          type: 'user/updateUserProfile',
          payload: { avatarUrl: url },
        });
      }

      this.setState({
        loading: false,
        disabled: false,
        src: null,
      });
    });
  };

  processFile = file => {
    return new Promise((resolve, reject) => {
      if (!file) reject(new Error(formatMessage({ id: 'image.invalid' })));
      if (file.status === 'removed') reject(new Error('Deleted'));
      if (typeof file.type === 'string' && !file.type.match(/image\/.*/)) {
        reject(new Error(formatMessage({ id: 'image.not-image' })));
      }
      if (file.size > 3 * 1024 * 1024) reject(new Error(formatMessage({ id: 'image.not-image' })));
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

  handleUpload = () => {
    this.setState({
      disabled: true,
    });
    this.cropImg.disable();
    const dataUrl = this.cropImg.getCroppedCanvas().toDataURL('image/jpeg', 0.9);
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'filename.jpeg', { type: 'image/jpeg' });
        this.processFile(file).then(() => {
          this.fileUpload(file);
        });
      });
  };

  render() {
    const { visible, handleOk, handleCancel, showModal, title, loadingImage } = this.props;
    const { src, disabled, loading } = this.state;
    const uploadProps = {
      name: 'file',
      showUploadList: false,
      action: file =>
        new Promise(() => {
          const formData = new FormData();
          formData.append('image', file);
          const reader = new FileReader();
          reader.addEventListener('load', () => this.setState({ src: reader.result }));
          reader.readAsDataURL(file);
        }),
    };
    return (
      <>
        <div className={styles.flexBox}>
          <Upload {...uploadProps}>
            <Button onClick={showModal} loading={loading} className={styles.editBtn} type="primary">
              <img
                src="/assets/img/edit.png"
                alt="avatar"
                style={{ width: '16px', marginLeft: '-5px' }}
              />
            </Button>
          </Upload>
        </div>
        {src && (
          <Modal
            className={styles.root}
            bodyStyle={{ backgroundColor: '#F9F9F9' }}
            style={{ backgroundColor: 'transparent', paddingBottom: 0 }}
            visible={visible}
            onOk={handleOk}
            onCancel={() => {
              if (typeof handleCancel === 'function') handleCancel();
              this.setState({ src: null });
            }}
            destroyOnClose
            closeIcon={<Icon style={{ fontSize: '16px', color: 'white' }} type="close" />}
            footer={false}
          >
            <Row className={styles.title}>
              <Col>{title}</Col>
            </Row>
            <Row>
              <>
                <Button
                  className={styles.btn}
                  type="primary"
                  disabled={disabled}
                  onClick={() => {
                    this.cropImg.rotateToLeft();
                  }}
                >
                  <img
                    src="/assets/img/Rotate_left.png"
                    alt="left"
                    style={{ width: '16px', marginLeft: '-5px' }}
                  />
                  {formatMessage({ id: 'profile.rotate-left' })}
                </Button>

                <Button
                  className={styles.btn}
                  type="primary"
                  disabled={disabled}
                  onClick={() => {
                    this.cropImg.rotateToRight();
                  }}
                >
                  <img
                    src="/assets/img/rotate-right.png"
                    alt="left"
                    style={{ width: '16px', marginLeft: '-5px' }}
                  />
                  {formatMessage({ id: 'profile.rotate-right' })}
                </Button>
              </>

              {/* {!src && (
              <Upload {...uploadProps}>
                <Button className={styles.btn} type="primary" icon="edit">
                  {formatMessage({ id: 'profile.choose-file' })}
                </Button>
              </Upload>
            )} */}
              <ImageEditorRc
                ref={c => {
                  this.cropImg = c;
                }}
                crossOrigin="true"
                src={src}
                style={{ maxHeight: '350px', width: '100%' }}
                aspectRatio={1 / 1}
                guides
                rotatable
                movable
                scalable
                zoomable
                dragMode="move"
                checkOrientation
                imageName="image name with extension to download"
                responseType="blob/base64"
              />
              <Button
                className={styles.btn}
                loading={loadingImage}
                type="primary"
                icon="save"
                onClick={this.handleUpload}
              >
                {formatMessage({ id: 'profile.save-upload' })}
              </Button>
            </Row>
          </Modal>
        )}
      </>
    );
  }
}

export default UpdateAvatar;
