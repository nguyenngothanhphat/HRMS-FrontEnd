/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Row, Col, Divider, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import EditIcon from './images/edit.svg';
import DownloadIcon from './images/download.svg';
import DeleteIcon from './images/delete.svg';

import styles from './index.less';

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
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

class CompanySignatoryForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  handleUpload = (info) => {
    console.log('info', info);
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

  // ACTIONS
  onDownload = () => {
    // eslint-disable-next-line no-alert
    alert('Download');
  };

  onEdit = () => {
    // eslint-disable-next-line no-alert
    alert('Edit');
  };

  onDelete = () => {
    // eslint-disable-next-line no-alert
    alert('Delete');
  };

  render() {
    const { loading, imageUrl } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        {/* <span style={{ marginLeft: '10px', display: 'inline-block' }}>Upload</span> */}
      </div>
    );
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
            <Col className={styles.CompanySignatoryForm_image} span={12}>
              <Upload
                listType="picture-card"
                // fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleUpload}
                beforeUpload={beforeUpload}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                showUploadList={false}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ minWidth: '200px' }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Col>
            <Col className={styles.CompanySignatoryForm_action} span={6}>
              <div className={styles.actionsButton}>
                <img src={DownloadIcon} onClick={() => this.onDownload()} alt="download" />
                <img src={EditIcon} onClick={() => this.onEdit()} alt="edit" />
                <img src={DeleteIcon} onClick={() => this.onDelete()} alt="delete" />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default CompanySignatoryForm;
