import React, { Component } from 'react';
import { Row, Form, Input, Button, Col } from 'antd';
import styles from './index.less';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (value) => {
    console.log(value);
  };

  handleSave = (value) => {
    console.log(value);
  };

  render() {
    const {
      handleCancel = () => {},
      currentUser: { email = '', firstName = '', signInRole = [], password = '' } = {},
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 9 },
        sm: { span: 12 },
      },
    };

    const data = [
      {
        label: 'Name',
        name: 'firstName',
        disabled: false,
      },
      {
        label: 'Email',
        name: 'email',
        disabled: true,
      },
      {
        label: 'Password',
        name: 'password',
        disabled: false,
      },
      {
        label: 'Role',
        name: 'signInRole',
        disabled: true,
      },
    ];

    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.header__title}>User Infomation</div>
        </div>
        <div className={styles.userInfo}>
          <Form
            className={styles.rootForm}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...formItemLayout}
            autoComplete="off"
            onValuesChange={this.handleChange}
            onFinish={this.handleSave}
            initialValues={{
              firstName,
              email,
              password,
              signInRole,
            }}
          >
            {data.map(({ label, name: nameField, disabled }) => (
              <Row className={styles.formItem} key={nameField}>
                <Col span={6}>
                  <div className={styles.textLabel}>{label}</div>
                </Col>
                <Col span={18}>
                  <Form.Item name={nameField}>
                    <Input disabled={disabled} className={styles.inputField} placeholder={label} />
                  </Form.Item>
                </Col>
              </Row>
            ))}

            <div className={styles.btnActions}>
              <Button className={styles.btnCancel} onClick={() => handleCancel(false)}>
                Cancel
              </Button>
              <Button className={styles.btnSave} htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default EditProfile;
