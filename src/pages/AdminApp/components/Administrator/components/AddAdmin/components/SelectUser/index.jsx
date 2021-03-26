import React, { PureComponent } from 'react';
import { Button, Row, Col, Radio, Select, Input, Form } from 'antd';
import styles from './index.less';

const { Option } = Select;

export default class SelectUser extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      isCompanyWorker: true,
    };
  }

  renderTitle = () => {
    const { handleAddAdmin = () => {} } = this.props;
    return (
      <div className={styles.titleContainer}>
        <span className={styles.title}>Who’s your new admin?</span>
        <div className={styles.cancelBtn} onClick={() => handleAddAdmin(false)}>
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
    onContinue(2, values);
  };

  renderContent = () => {
    const { isCompanyWorker } = this.state;
    return (
      <div className={styles.assignUser}>
        <Form
          name="basic"
          ref={this.formRef}
          id="myForm"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
        >
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <span>Terralogic Information Systems Service, Inc. Worker?</span>
            </Col>
            <Col span={16}>
              <Form.Item name="isCompanyWorker">
                <Radio.Group onChange={this.isCompanyWorkerChange} value={isCompanyWorker}>
                  <Radio value>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          {isCompanyWorker && (
            <Row align="middle" gutter={[24, 24]}>
              <Col span={8}>Name</Col>
              <Col span={12}>
                <Form.Item name="name">
                  <Select
                    allowClear
                    placeholder="Search by name or select a person"
                    showArrow
                    showSearch
                  >
                    <Option value="ABC">Lewis Nguyen</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4} />
            </Row>
          )}

          {!isCompanyWorker && (
            <Row align="middle" gutter={[24, 24]}>
              <Col span={8}>Email</Col>
              <Col span={12}>
                <Form.Item name="email">
                  <Input placeholder="Type email" />
                </Form.Item>
              </Col>
              <Col span={4} />
            </Row>
          )}
        </Form>
      </div>
    );
  };

  renderMainForm = () => {
    return (
      <div className={styles.mainForm}>
        <div className={styles.header}>
          <span>New Admin</span>
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
