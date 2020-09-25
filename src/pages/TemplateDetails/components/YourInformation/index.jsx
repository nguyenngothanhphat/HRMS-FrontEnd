import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Upload, Button } from 'antd';
import { PlusOutlined, UploadOutlined, InboxOutlined } from '@ant-design/icons';

import styles from './index.less';

class YourInformation extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
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
              <Form.Item label="Signature">
                <Form.Item
                  name="dragger"
                  valuePropName="fileList"
                  getValueFromEvent={this.normFile}
                  noStyle
                >
                  <Upload.Dragger name="files" action="/upload.do">
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Drag you signature here, or browse</p>
                  </Upload.Dragger>
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
