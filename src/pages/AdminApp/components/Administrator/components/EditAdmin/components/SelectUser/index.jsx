import React, { PureComponent } from 'react';
import { Button, Row, Col, Input, Form, Select } from 'antd';
import { connect } from 'umi';
import { getCurrentCompany } from '@/utils/authority';

import styles from './index.less';

const Option = { Select };

@connect(({ location: { companyLocationList = [] } = {} }) => ({
  companyLocationList,
}))
class SelectUser extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      // isCompanyWorker: true,
    };
  }

  renderTitle = () => {
    const { handleEditAdmin = () => {} } = this.props;
    return (
      <div className={styles.titleContainer}>
        <span className={styles.title}>Edit Administrator</span>
        <div className={styles.cancelBtn} onClick={() => handleEditAdmin(false)}>
          <span>Cancel</span>
        </div>
      </div>
    );
  };

  onFinish = (values) => {
    const { onContinue = () => {} } = this.props;
    onContinue(1, values);
  };

  renderContent = () => {
    const {
      dataAdmin: { manageLocation = [], usermap: { firstName = '', email: email1 = '' } = {} } = {},
      onBackValues: { name: newName = '', email: email2 = '', location = [] } = {} || {},
      companyLocationList = [],
    } = this.props;

    const currentCompany = getCurrentCompany();
    const filterListLocation = companyLocationList.filter(
      (item) => item.company._id === currentCompany,
    );

    return (
      <div className={styles.assignUser}>
        <Form
          name="basic"
          ref={this.formRef}
          id="myForm"
          initialValues={{
            name: newName === '' ? firstName : newName,
            email: email1 || email2,
            location: location.length === 0 ? manageLocation : location,
          }}
          onFinish={this.onFinish}
        >
          <Row className={styles.eachRow} align="middle">
            <Col span={8}>Email</Col>
            <Col span={14}>
              <Form.Item name="email">
                <Input disabled placeholder="Administrator Email" />
              </Form.Item>
            </Col>
            <Col span={2} />
          </Row>
          <Row className={styles.eachRow} align="middle">
            <Col span={8}>Administrator Name</Col>
            <Col span={14}>
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
            <Col span={2} />
          </Row>
          <Row className={styles.eachRow} align="middle">
            <Col span={8}>Manage Location</Col>
            <Col span={14}>
              <Form.Item
                name="location"
                rules={[
                  {
                    required: true,
                    message: 'Please select location !',
                  },
                ]}
              >
                <Select
                  placeholder="Select location"
                  showArrow
                  showSearch
                  allowClear
                  mode="multiple"
                  // onChange={(value) => this.onChangeSelect(value)}
                  filterOption={
                    (input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    // eslint-disable-next-line react/jsx-curly-newline
                  }
                >
                  {filterListLocation.map((item) => {
                    const { name = '', _id = '' } = item;
                    return (
                      <Option key={_id} value={_id}>
                        {name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={2} />
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

export default SelectUser;
