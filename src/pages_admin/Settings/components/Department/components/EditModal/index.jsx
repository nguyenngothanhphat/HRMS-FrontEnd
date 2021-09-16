import { Button, Form, Input, Modal, Select } from 'antd';

import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;
@connect(({ loading }) => ({ loadingUploadAttachment: loading.effects['upload/uploadFile'] }))
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
    let title = 'Add New Department';
    if (action === 'edit') {
      title = 'Edit Department';
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
              rules={[{ required: true, message: 'Please enter department name!' }]}
              label="Department Name"
              name="name"
              labelCol={{ span: 24 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: 'Please enter parent department name!' }]}
              label="Parent Department Name"
              name="name"
              labelCol={{ span: 24 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="HR Point of Contact"
              name="HRPOC"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Please select HR Point of Contact' }]}
            >
              <Select
                // filterOption={(input, option) =>
                //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                filterOption={(input, option) => {
                  return (
                    option.children[1].props.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                  );
                }}
                showSearch
                allowClear
              >
                <Option value="A">A</Option>
                <Option value="B">B</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Finance Point of Contact"
              name="financePOC"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Please select Finance Point of Contact' }]}
            >
              <Select
                // filterOption={(input, option) =>
                //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                filterOption={(input, option) => {
                  return (
                    option.children[1].props.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                  );
                }}
                showSearch
                allowClear
              >
                <Option value="A">A</Option>
                <Option value="B">B</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default EditModal;
