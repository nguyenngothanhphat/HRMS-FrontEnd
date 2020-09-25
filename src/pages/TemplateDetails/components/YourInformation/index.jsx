import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import styles from './index.less';

class YourInformation extends PureComponent {
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
      this.getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  render() {
    const { loading, imageUrl } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
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
                label="Full name"
                name="fullName"
              >
                <Input
                  // onChange={(e) => this.handleChange(e)}
                  className={styles.formInput}
                  name="fullName"
                />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                label="Designation"
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
              <Form.Item label="Dragger">
                <Form.Item
                  name="dragger"
                  valuePropName="fileList"
                  getValueFromEvent={this.normFile}
                  noStyle
                >
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default YourInformation;
