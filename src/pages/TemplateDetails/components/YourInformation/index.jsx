import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import { Row, Col, Form, Input, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import styles from './index.less';

class YourInformation extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      // loading: false,
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
    // const { loading, imageUrl } = this.state;
    // const uploadButton = (
    //   <div>
    //     {loading ? <LoadingOutlined /> : <PlusOutlined />}
    //     <div style={{ marginTop: 8 }}>
    //       {formatMessage({ id: 'component.yourInformation.upload' })}
    //     </div>
    //   </div>
    // );
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
                  // onChange={(e) => this.handleChange(e)}
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
                    <p className="ant-upload-text">
                      {formatMessage({ id: 'component.yourInformation.dragFile' })}
                    </p>
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
