/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { Modal, Button, Input, Select } from 'antd';
import styles from './index.less';

const { Option } = Select;

const listType = [
  { _id: '12345', name: 'Type 1' },
  { _id: '45678', name: 'Type 2' },
];

class ModalUploadDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      name: '',
      // urlImage: '',
    };
  }

  shouldComponentUpdate(nextProps) {
    const { keyModal } = this.props;
    const { keyModal: nextKeyModal } = nextProps;
    if (keyModal !== nextKeyModal) {
      this.setState({
        type: '',
        name: '',
        // urlImage: '',
      });
    }
    return true;
  }

  onOk = () => {
    const { handleSubmit = () => {} } = this.props;
    const { name, type } = this.state;
    handleSubmit({ name, type });
  };

  onCancel = () => {
    const { handleCancel = () => {} } = this.props;
    this.setState(
      {
        type: '',
        name: '',
        // urlImage: '',
      },
      handleCancel(),
    );
  };

  onChangeField = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { visible = false, loading = false } = this.props;
    const {
      name: valueName,
      type,
      // urlImage
    } = this.state;
    const checkDisabled = !valueName || !type;

    return (
      <Modal
        className={styles.root}
        destroyOnClose
        visible={visible}
        title="Upload a new document"
        onOk={this.onOk}
        onCancel={this.onCancel}
        footer={[
          <Button
            key="submit"
            className={styles.btnDone}
            loading={loading}
            onClick={this.onOk}
            disabled={checkDisabled}
          >
            Done
          </Button>,
        ]}
      >
        <div className={styles.content}>
          <div className={styles.viewUpload}>View Upload</div>
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
