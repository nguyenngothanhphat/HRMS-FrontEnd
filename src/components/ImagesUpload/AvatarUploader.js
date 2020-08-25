import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Upload, message, Icon } from 'antd';
import styles from './AvatarUploader.less';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class AvatarUploader extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      imgUrl: value,
    };
  }

  static getDerivedStateFromProps({ value }, { imgUrl }) {
    if (typeof value === 'string' && imgUrl !== value) return { imgUrl: value };
    return { imgUrl };
  }

  triggerChange = ({ file }) => {
    const { onChange } = this.props;
    try {
      if (typeof file.type === 'string' && !file.type.match(/image\/.*/)) {
        throw new Error(formatMessage({ id: 'image.not-image' }));
      }
      if (file.size > 3 * 1024 * 1024)
        throw new Error(formatMessage({ id: 'common.error.file-too-large' }));
      this.setState({ loading: true });
      getBase64(file, imgUrl => {
        if (onChange) onChange(file);
        this.setState({ imgUrl, loading: false });
      });
    } catch ({ message: msg }) {
      message.warn(msg);
    }
  };

  render() {
    const { loading = false, imgUrl } = this.state;

    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">
          <FormattedMessage id="common.button.upload" />
        </div>
      </div>
    );

    const draggerUploadProps = {
      className: styles['upload-box'],
      listType: 'picture-card',
      showUploadList: false,
      onChange: this.triggerChange,
      beforeUpload: () => false,
    };
    let img;
    if (imgUrl) {
      img = <img alt="..." src={imgUrl} />;
    }

    return <Upload {...draggerUploadProps}>{img || uploadButton}</Upload>;
  }
}

export default AvatarUploader;
