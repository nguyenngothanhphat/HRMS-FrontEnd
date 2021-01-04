/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Row, Col, Divider, Upload, Modal, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import styles from './index.less';

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

class CompanySignatoryForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLt5M: true,
      checkValidate: [{}],
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList: [
        {
          // uid: '-1',
          // name: 'image.png',
          // status: 'done',
          // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      ],
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleUpload = (info) => {
    let _fileList = [...info.fileList];

    _fileList = _fileList.slice(-1);
    this.setState({
      fileList: _fileList,
    });
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;

    return (
      <div className={styles.CompanySignatoryForm}>
        <div className={styles.CompanySignatoryForm_form}>
          <Row gutter={[24, 12]} align="middle">
            <Col className={styles.CompanySignatoryForm_title} span={6}>
              Name of the signatory
            </Col>
            <Col className={styles.CompanySignatoryForm_title} span={12}>
              Signature
            </Col>
            <Col className={styles.CompanySignatoryForm_title} span={6}>
              Actions
            </Col>
          </Row>
          <Divider />
          <Row gutter={[24, 12]} align="middle">
            <Col className={styles.CompanySignatoryForm_content} span={6}>
              SanDeep Meta
            </Col>
            <Col className={styles.CompanySignatoryForm_content} span={12}></Col>
            <Col className={styles.CompanySignatoryForm_content} span={6}>
              <>
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onChange={this.handleUpload}
                  beforeUpload={() => false}
                >
                  <UploadOutlined />
                </Upload>
                <Modal
                  visible={previewVisible}
                  title={previewTitle}
                  footer={null}
                  onCancel={this.handleCancel}
                >
                  <img
                    alt="example"
                    style={{ width: '100%', height: '400px' }}
                    src={previewImage}
                  />
                </Modal>
              </>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default CompanySignatoryForm;
