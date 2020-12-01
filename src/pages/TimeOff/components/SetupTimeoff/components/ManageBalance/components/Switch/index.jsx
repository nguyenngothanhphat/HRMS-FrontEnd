import React, { PureComponent, message } from 'react';
import icon from '@/assets/svgIcon.svg';
import { Upload } from 'antd';
import styles from './index.less';

class Switch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
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

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  render() {
    return (
      <div className={styles.root}>
        <div>Switch</div>
        <div>Keep current employee timeoff balances, but move them to new policies</div>
        <img src={icon} alt="" />
        <div>
          <Upload
            className={styles.upload}
            name="avatar"
            beforeUpload={() => this.beforeUpload()}
            onChange={this.handleChange}
          >
            <div className={styles.upload}>
              <img className={styles.uploadIcon} src="icon" alt="img-upload" />
              <span className={styles.uploadText}>Upload new</span>
            </div>
          </Upload>
        </div>
      </div>
    );
  }
}
export default Switch;
