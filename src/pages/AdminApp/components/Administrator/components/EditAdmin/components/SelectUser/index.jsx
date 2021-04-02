import React, { PureComponent } from 'react';
import { Button, Row, Col, Input, Form } from 'antd';
import styles from './index.less';

export default class SelectUser extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      isCompanyWorker: true,
    };
  }

  renderTitle = () => {
    const { handleEditAdmin = () => {} } = this.props;
    return (
      <div className={styles.titleContainer}>
        <span className={styles.title}>Who’s your new admin?</span>
        <div className={styles.cancelBtn} onClick={() => handleEditAdmin(false)}>
          <span>Cancel</span>
        </div>
      </div>
    );
  };

  isCompanyWorkerChange = (e) => {
    this.setState({
      isCompanyWorker: e?.target?.value,
    });
  };

  onFinish = (values) => {
    const { onContinue = () => {} } = this.props;
    onContinue(1, values);
  };

  renderContent = () => {
    const { dataAdmin: { usermap: { firstName = '', email = '' } = {} } = {} } = this.props;
    return (
      <div className={styles.assignUser}>
        <Form
          name="basic"
          ref={this.formRef}
          id="myForm"
          initialValues={{
            name: firstName,
            email,
          }}
          onFinish={this.onFinish}
        >
          <Row align="middle" gutter={[24, 24]}>
            <Col span={8}>Email</Col>
            <Col span={12}>
              <Form.Item name="email">
                <Input disabled placeholder="Administrator Email" />
              </Form.Item>
            </Col>
            <Col span={4} />
          </Row>
          <Row align="middle" gutter={[24, 24]}>
            <Col span={8}>Administrator Name</Col>
            <Col span={12}>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Please input your name !',
                  },
                ]}
              >
                <Input placeholder="Type name" />
              </Form.Item>
            </Col>
            <Col span={4} />
          </Row>
        </Form>
      </div>
    );
  };

  renderMainForm = () => {
    return (
      <div className={styles.mainForm}>
        <div className={styles.header}>
          <span>Edit Admin</span>
        </div>
        <div className={styles.content}>{this.renderContent()}</div>
        <div className={styles.nextBtn}>
          <Button key="submit" type="primary" form="myForm" htmlType="submit">
            Continue
          </Button>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className={styles.SelectUser}>
        {this.renderTitle()}
        {this.renderMainForm()}
      </div>
    );
  }
}
