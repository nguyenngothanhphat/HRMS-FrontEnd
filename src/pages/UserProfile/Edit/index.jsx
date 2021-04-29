import React, { Component } from 'react';
import { Row, Form, Input, Button, Col } from 'antd';
import styles from './index.less';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
      },
      {
        label: 'Email',
        name: 'email',
      },
      {
        label: 'Password',
        name: 'password',
      },
      {
        label: 'Role',
        name: 'signInRole',
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
            {data.map(({ label, name: nameField }) => (
              <Row className={styles.formItem} key={nameField}>
                <Col span={6}>
                  <div className={styles.label}>{label}</div>
                </Col>
                <Col span={18}>
                  <Form.Item name={nameField}>
                    <Input className={styles.inputField} placeholder={label} />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          </Form>
          <Button onClick={() => handleCancel(false)}>Cancel</Button>
        </div>
      </div>
    );
  }
}

export default EditProfile;
