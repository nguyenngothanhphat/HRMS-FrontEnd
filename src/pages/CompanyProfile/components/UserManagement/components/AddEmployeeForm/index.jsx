/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-template-curly-in-string */
import { Button, Form, Input, Modal } from 'antd';
import React, { Component } from 'react';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

@connect()
class AddEmployeeForm extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate() {}

  handleCancel = () => {
    const { handleCancel = () => {} } = this.props;
    handleCancel();
  };

  handleSubmitEmployee = (values) => {
    const { handleSubmit = () => {} } = this.props;
    handleSubmit(values);
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
      wrapperCol: { span: 16 },
    };
    const validateMessages = {
      required: '${label} is required!',
      types: {
        email: '${label} is not validate email!',
        number: '${label} is not a validate number!',
      },
    };

    return (
      <div className={styles.addEmployee__form} id="addEmployee__form">
        <Form
          name="formAddEmployee"
          colon={false}
          labelAlign="left"
          layout="horizontal"
          ref={this.formRef}
          validateMessages={validateMessages}
          id="addEmployeeForm"
          onFinish={this.handleSubmitEmployee}
          {...formLayout}
        >
          <Form.Item
            label={formatMessage({ id: 'addEmployee.employeeID' })}
            name="employeeId"
            rules={[
              { required: true },
              {
                pattern: /^([a-zA-Z0-9]((?!__|--)[a-zA-Z0-9_\-\s])+[a-zA-Z0-9])$/,
                message: 'Employee ID is not a validate ID!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'addEmployee.name' })}
            name="firstName"
            rules={[
              { required: true },
              {
                pattern: /^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$/,
                message: 'Name is not a validate name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'addEmployee.personalEmail' })}
            name="personalEmail"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </div>
    );
  };

  render() {
    const { visible = false, loading } = this.props;
    return (
      <Modal
        className={styles.addEmployee}
        visible={visible}
        title={this.renderHeaderModal()}
        onCancel={this.handleCancel}
        style={{ top: 50 }}
        destroyOnClose
        footer={[
          <div key="cancel" className={styles.btnCancel} onClick={this.handleCancel}>
            {formatMessage({ id: 'employee.button.cancel' })}
          </div>,
          <Button
            key="submit"
            htmlType="submit"
            type="primary"
            form="addEmployeeForm"
            loading={loading}
            className={styles.btnSubmit}
          >
            {formatMessage({ id: 'employee.button.submit' })}
          </Button>,
        ]}
      >
        {this.renderAddEmployeeForm()}
      </Modal>
    );
  }
}

export default AddEmployeeForm;
