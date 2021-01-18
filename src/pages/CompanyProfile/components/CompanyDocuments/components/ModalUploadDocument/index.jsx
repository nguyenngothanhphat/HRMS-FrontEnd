/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { Modal, Button, Input, Select, Upload, message, Spin } from 'antd';
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import classnames from 'classnames';
import styles from './index.less';

const { Dragger } = Upload;
const { Option } = Select;

const listType = [
  { _id: '12345', name: 'Type 1' },
  { _id: '45678', name: 'Type 2' },
];

@connect(({ loading }) => ({
  loading: loading.effects['upload/uploadFile'],
}))
class ModalUploadDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      name: '',
      urlImage: '',
    };
  }

  shouldComponentUpdate(nextProps) {
    const { keyModal } = this.props;
    const { keyModal: nextKeyModal } = nextProps;
    if (keyModal !== nextKeyModal) {
      this.setState({
        type: '',
        name: '',
        urlImage: '',
      });
    }
    return true;
  }

  onOk = () => {
    const { handleSubmit = () => {} } = this.props;
    const { name, type } = this.state;
    handleSubmit({ name, type });
  };

  onChangeField = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  beforeUpload = ({ type, size }) => {
    const checkImg = type === 'image/jpeg' || type === 'application/pdf';
    if (!checkImg) {
      message.error('You can only upload JPEG/PDF file!');
    }
    const isLt2M = size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return checkImg && isLt2M;
  };

  handleRemoveFile = () => {
    this.setState({
      urlImage: '',
    });
  };

  handleUpload = (file) => {
    const { dispatch } = this.props;
    const formData = new FormData();
    formData.append('uri', file);
    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    }).then((resp) => {
      const { statusCode, data = [] } = resp;
      if (statusCode === 200) {
        const [first] = data;
        this.setState({ urlImage: first.url });
      }
    });
  };

  render() {
    const { visible = false, loadingSubmit = false, handleCancel = () => {}, loading } = this.props;
    const { name: valueName, type, urlImage } = this.state;
    const propsUpload = {
      name: 'file',
      multiple: false,
      showUploadList: false,
    };
    const checkDisabled = !valueName || !type || !urlImage;
    return (
      <Modal
        className={styles.root}
        destroyOnClose
        visible={visible}
        title="Upload a new document"
        onOk={this.onOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key="submit"
            className={styles.btnDone}
            loading={loadingSubmit}
            onClick={this.onOk}
            disabled={checkDisabled}
          >
            Done
          </Button>,
        ]}
      >
        <div className={styles.content}>
          <div className={classnames(styles.viewUpload, { [styles.center]: loading })}>
            {loading ? (
              <Spin size="large" />
            ) : (
              <Dragger
                {...propsUpload}
                beforeUpload={this.beforeUpload}
                action={(file) => this.handleUpload(file)}
              >
                <div className={styles.content}>
                  <div className={styles.viewIconDownload}>
                    <div className={styles.viewIconDownload__circle}>
                      <CloudUploadOutlined className={styles.viewIconDownload__circle__icon} />
                    </div>
                  </div>
                  <p className={styles.title}>Drag & drop your file here</p>
                  <p className={styles.text}>
                    or <span className={styles.browse}>browse</span> to upload a file
                  </p>
                  <p className={styles.textDescription}>
                    File size should not be more than 2mb. Supported file for view: pdf & jpeg
                  </p>
                </div>
              </Dragger>
            )}
          </div>
          {urlImage && (
            <div className={styles.viewName}>
              <p className={styles.viewName__text}>{urlImage.split('/').pop()}</p>
              <div className={styles.viewName__btnRemove} onClick={this.handleRemoveFile}>
                <DeleteOutlined className={styles.viewName__btnRemove__icon} />
              </div>
            </div>
          )}
          <div className={styles.content__viewRow}>
            <p>Name of the document</p>
            <div className={styles.content__viewRow__field}>
              <Input
                placeholder="Name of the document"
                value={valueName}
                name="name"
                onChange={({ target: { value, name } }) => this.onChangeField(name, value)}
              />
            </div>
          </div>
          <div className={styles.content__viewRow}>
            <p>Document type</p>
            <div className={styles.content__viewRow__field}>
              <Select
                value={type}
                placeholder="Select Type"
                showArrow
                showSearch
                onChange={(value) => this.onChangeField('type', value)}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {listType.map((item) => (
                  <Option key={item._id} value={item.name}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ModalUploadDocument;
