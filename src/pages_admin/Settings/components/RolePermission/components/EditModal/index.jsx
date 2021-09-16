import { Button, Form, Input, Modal, Tree } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';

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
    let title = 'Add New Roles & Permission';
    if (action === 'edit') {
      title = 'Edit';
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

  renderList = () => {
    const { permissionList = [] } = this.props;
    let formatList = permissionList.map((per) => per?.module);
    formatList = formatList.filter(
      (value) => value !== undefined && value !== '' && value !== null,
    );
    formatList = [...new Set(formatList)];

    const treeData = formatList.map((moduleName, index) => {
      let result = permissionList.map((per) => {
        const { _id = '', name = '', module = '' } = per;
        if (moduleName === module) {
          return {
            title: name,
            key: _id,
          };
        }
        return 0;
      });
      result = result.filter((val) => val !== 0);

      return {
        key: index,
        title: moduleName,
        children: result,
      };
    });
    const onCheck = (checkedKeys) => {
      this.setList(checkedKeys);
    };

    return (
      <>
        <span className={styles.permissionTitle}>Permission</span>
        <div className={styles.roleList}>
          <Tree
            checkable
            defaultExpandAll={false}
            // onSelect={onSelect}
            onCheck={onCheck}
            treeData={treeData}
            showLine={{ showLeafIcon: false }}
            showIcon={false}
          />
        </div>
      </>
    );
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
              rules={[{ required: true, message: 'Please enter role name!' }]}
              label="Role"
              name="name"
              labelCol={{ span: 24 }}
            >
              <Input placeholder="Role Name" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Please enter role description!' }]}
            >
              <Input placeholder="Role Description" />
            </Form.Item>
            {this.renderList()}
          </Form>
        </Modal>
      </>
    );
  }
}

export default EditModal;
