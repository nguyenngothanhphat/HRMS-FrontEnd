import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Upload, Modal, notification, Button, Icon } from 'antd';
import { connect } from 'dva';
import { randomBytes } from 'crypto';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import mime from 'mime-types';
import { getToken } from '@/utils/token';
import { dialog } from '@/utils/utils';

const DraggerUpload = Upload.Dragger;

@connect()
class ImagesUpload extends React.Component {
  constructor(props) {
    super(props);
    const { value = [] } = props;
    this.state = {
      fileList: value.map(url => {
        const [fileName = 'unknow-file-name'] = url.match(/[^/?#]*\.[^/?#]*(\?.*)?(\\#.*)?$/);
        return {
          uid: randomBytes(16),
          name: fileName,
          status: 'done',
          url,
        };
      }),
    };
  }

  handleChange = ({ fileList }) => {
    const { onChange } = this.props;
    this.setState({ fileList });
    if (typeof onChange === 'function')
      onChange(fileList.filter(f => f.status === 'done').map(f => f.url));
  };

  beforeUpload = (file, fileList) => {
    try {
      if (!file) throw new Error('image.invalid');
      const { fileList: currentFileList } = this.state;
      if (currentFileList.length >= 5) {
        throw new Error('image.max');
      }
      if (file.status === 'removed') throw new Error('Deleted');
      const mimeType = mime.extensions[file.type];
      const [fileType] = mimeType;
      if (!(['bmp', 'gif', 'jpeg', 'jpg', 'png', 'pdf'].indexOf(fileType) > -1)) {
        throw new Error('image.not-image');
      }
      if (file.size > 20 * 1024 * 1024) throw new Error('common.error.file-too-large');

      return true;
    } catch ({ message }) {
      notification.warn({ message: formatMessage({ id: message }) });
      fileList.pop(file);
      return false;
    }
  };

  handlePreview = file => {
    if (file.type ? file.type === 'application/pdf' : mime.lookup(file.url) === 'application/pdf') {
      window.open(file.url, '_blank');
      return;
    }
    this.setState({ previewVisible: file.url || file.thumbUrl });
  };

  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  render() {
    const { fileList, previewVisible = false } = this.state;
    const {
      placeholder = formatMessage({ id: 'image.upload.placeholder' }),
      icon = '/assets/img/upload.png',
    } = this.props;
    const { token } = getToken();
    const draggerUploadProps = {
      action: '/server/api/api/attachments/upload-image',
      data: {
        method: 'upload',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      onSuccess: (result, file) => {
        try {
          if (result.statusCode !== 200) throw result;
          const { url } = result.data[0];
          const { fileList: currentFileList } = this.state;
          const fileOnList = currentFileList.find(f => f.uid === file.uid);
          if (fileOnList) Object.assign(fileOnList, { status: 'done', url });
          this.handleChange({ fileList: currentFileList });
        } catch (errors) {
          dialog(errors);
        }
      },
      listType: 'picture-card',
      // className: 'uploadList',
      beforeUpload: this.beforeUpload,
      onChange: this.handleChange,
      onPreview: this.handlePreview,
      fileList,
    };

    return (
      <div>
        <DraggerUpload {...draggerUploadProps}>
          <img src={icon} alt="upload" />
          <p
            style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#666666',
              paddingTop: '20px',
            }}
          >
            {placeholder}
          </p>
        </DraggerUpload>
        <Modal width={700} visible={!!previewVisible} footer={null} onCancel={this.handleCancel}>
          {/* <img alt="example" style={{ width: '100%' }} src={previewVisible} /> */}
          <TransformWrapper>
            {({ zoomIn, zoomOut, resetTransform }) => (
              <React.Fragment>
                <div style={{ paddingBottom: '20px' }}>
                  <Button type="primary" onClick={zoomIn} style={{ marginRight: '10px' }}>
                    <Icon type="zoom-in" style={{ color: '#ffffff', fontSize: '18px' }} />
                  </Button>
                  <Button type="primary" onClick={zoomOut} style={{ marginRight: '10px' }}>
                    <Icon type="zoom-out" style={{ color: '#ffffff', fontSize: '18px' }} />
                  </Button>
                  <Button type="primary" onClick={resetTransform}>
                    <Icon type="fullscreen" style={{ color: '#ffffff', fontSize: '18px' }} />
                  </Button>
                </div>
                <TransformComponent>
                  <img alt="example" style={{ width: '100%' }} src={previewVisible} />
                </TransformComponent>
              </React.Fragment>
            )}
          </TransformWrapper>
        </Modal>
      </div>
    );
  }
}

export default ImagesUpload;
