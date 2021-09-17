import { Button, Form, Input, Modal, Select } from 'antd';

import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;
@connect(() => ({}))
class EditModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nameState: '',
      descriptionState: '',
      selectedList: [],
    };
  }

  setList = (list) => {
    this.setState({
      selectedList: list,
    });
  };

  componentDidMount = async () => {};

  handleRemove = () => {
    this.handlePreview('');
  };

  renderHeaderModal = () => {
    const { action = 'add' } = this.props;
    let title = 'Add New Grade';
    if (action === 'edit') {
      title = 'Edit Grade';
    }
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  onFinish = async (values) => {};

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    this.setState({ nameState: '', descriptionState: '' });
    onClose(false);
  };

  render() {
    const { visible = false } = this.props;
    const { nameState, descriptionState, selectedList } = this.state;

    return (
      <>
        <Modal
          className={styles.EditModal}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={[
            <Button onClick={this.handleCancel} className={styles.btnCancel}>
              Cancel
            </Button>,
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
              disabled={!nameState || !descriptionState || selectedList.length === 0}
              // loading={loadingReassign}
            >
              Add
            </Button>,
          ]}
          title={this.renderHeaderModal()}
          centered
          visible={visible}
        >
          <Form
            name="basic"
            // ref={this.formRef}
            id="myForm"
            onFinish={this.onFinish}
            initialValues={
              {
                // from: currentEmpId,
              }
            }
          >
            <Form.Item
              rules={[{ required: true, message: 'Please enter grade name!' }]}
              label="Grade Name"
              name="name"
              labelCol={{ span: 24 }}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default EditModal;
