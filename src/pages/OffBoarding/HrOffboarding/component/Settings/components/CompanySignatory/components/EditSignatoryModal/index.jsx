import React, { PureComponent } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import styles from './index.less';

export default class EditSignatoryModal extends PureComponent {
  render() {
    const { visible, editPack = {}, onOk = () => {}, onClose = () => {} } = this.props;
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal
        className={styles.EditSignatoryModal}
        destroyOnClose
        centered
        visible={visible}
        footer={null}
        onCancel={onClose}
      >
        <div className={styles.container}>
          <Form
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...layout}
            name="basic"
            initialValues={{ name: editPack.name, designation: editPack.designation }}
            onFinish={onOk}
            ref={this.formRef}
            id="myForm"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Designation"
              name="designation"
              rules={[{ required: true, message: 'Please input designation!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
          <Button htmlType="submit" key="submit" form="myForm">
            Save
          </Button>
        </div>
      </Modal>
    );
  }
}
