/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import styles from './index.less';

class AddEmployeeForm extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {};
  }

  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState({}, () => handleCancel());
  };

  handleChangeAddEmployee = () => {};

  handleSubmitEmployee = (values) => {
    console.log('Success:', values);
  };

  renderHeaderModal = () => {
    const { titleModal = 'Your title' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
      </div>
    );
  };

  renderAddEmployeeForm = () => {
    const formLayout = {
      labelCol: { span: 8 },
      //   wrapperCol: { span: 14 },
    };
    return (
      <div className={styles.addEmployee__form}>
        <Form
          name="formAddEmployee"
          requiredMark={false}
          colon={false}
          labelAlign="left"
          ref={this.formRef}
          id="addEmployeeForm"
          onValuesChange={this.handleChangeAddEmployee}
          onFinish={this.handleSubmitEmployee}
          {...formLayout}
        >
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Personal Email" name="personalEmail">
            <Input />
          </Form.Item>
          <Form.Item label="Work Email" name="workEmail">
            <Input />
          </Form.Item>
          <Form.Item label="Company" name="company">
            <Input />
          </Form.Item>
          <Form.Item label="Location" name="location">
            <Input />
          </Form.Item>
          <Form.Item label="Department" name="department">
            <Input />
          </Form.Item>
          <Form.Item label="Job Title" name="jobTitle">
            <Input />
          </Form.Item>
          <Form.Item label="Reporting Manager" name="reportingManager">
            <Input />
          </Form.Item>
        </Form>
      </div>
    );
  };

  handleRemoveToServer = () => {
    console.log('handleRemoveToServer');
  };

  render() {
    const { visible = false, loading } = this.props;
    return (
      <Modal
        className={styles.addEmployee}
        visible={visible}
        title={this.renderHeaderModal()}
        onOk={this.handleRemoveToServer}
        onCancel={this.handleCancel}
        style={{ top: 50 }}
        destroyOnClose
        footer={[
          <div key="cancel" className={styles.btnCancel} onClick={this.handleCancel}>
            Cancel
          </div>,
          <Button
            key="submit"
            htmlType="submit"
            type="primary"
            form="addEmployeeForm"
            loading={loading}
            className={styles.btnSubmit}
          >
            Submit
          </Button>,
        ]}
      >
        {this.renderAddEmployeeForm()}
      </Modal>
    );
  }
}

export default AddEmployeeForm;
