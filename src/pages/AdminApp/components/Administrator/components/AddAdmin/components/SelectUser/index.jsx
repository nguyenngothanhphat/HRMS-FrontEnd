import React, { PureComponent } from 'react';
import { Button, Row, Col, Radio, Select, Input, Form } from 'antd';
import { getCurrentCompany } from '@/utils/authority';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;
@connect(({ locationSelection: { listLocationsByCompany = [] } }) => ({
  listLocationsByCompany,
}))
class SelectUser extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      isCompanyWorker: true,
      listUsers: [],
    };
  }

  fetchUsers = async () => {
    const { dispatch } = this.props;
    const company = getCurrentCompany();
    const res = await dispatch({
      type: 'adminApp/fetchUsersListOfOwner',
      payload: {
        company,
      },
    });
    const { statusCode = 0, data = {} } = res;
    if (statusCode === 200) {
      this.setState({
        listUsers: data?.listUser || [],
      });
    }
  };

  componentDidMount = () => {
    this.fetchUsers();
    const { onBackValues: { firstName = '' } = {} } = this.props;
    if (firstName) {
      this.setState({
        isCompanyWorker: false,
      });
      this.formRef.current.setFieldsValue({
        isCompanyWorker: false,
      });
    }
  };

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
    let payload = {};
    const { isCompanyWorker, usermapId, location = [] } = values;
    if (isCompanyWorker) {
      const { listUsers } = this.state;
      const userObj = listUsers.find((user) => user?._id === usermapId);

      payload = {
        isCompanyWorker,
        name1: userObj?.usermap.firstName,
        email: userObj?.usermap.email,
        location,
        usermapId,
      };
    } else {
      payload = { ...values };
    }
    onContinue(1, payload);
  };

  renderContent = () => {
    const { isCompanyWorker, listUsers } = this.state;
    const {
      companyName = '',
      onBackValues: { firstName = '', email = '', usermapId = '', location = [] } = {},
      listLocationsByCompany = [],
    } = this.props;

    const formatListLocation = listLocationsByCompany.filter((loc) => {
      const { company: { _id = '' } = {} } = loc;
      return _id === getCurrentCompany();
    });
    return (
      <div className={styles.assignUser}>
        <Form
          name="basic"
          ref={this.formRef}
          id="myForm"
          initialValues={{
            isCompanyWorker,
            firstName,
            email: usermapId ? null : email,
            usermapId: usermapId === '' ? null : usermapId,
            location,
          }}
          onFinish={this.onFinish}
        >
          <Row gutter={[24, 24]}>
            <Col span={8} style={{ marginTop: '3px' }}>
              <span>{companyName} Worker?</span>
            </Col>
            <Col span={16}>
              <Form.Item name="isCompanyWorker">
                <Radio.Group onChange={this.isCompanyWorkerChange}>
                  <Radio value>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          {isCompanyWorker && (
            <Row align="middle" gutter={[24, 24]}>
              <Col span={8}>Name</Col>
              <Col span={14}>
                <Form.Item
                  name="usermapId"
                  rules={[{ required: true, message: 'Please select a person' }]}
                >
                  <Select
                    allowClear
                    placeholder="Search by name or select a person"
                    showArrow
                    showSearch
                    onSearch={this.fetchUsers}
                  >
                    {listUsers.map((user) => {
                      const {
                        usermap: { email: email1 = '', firstName: fn1 = '' },
                        _id = '',
                      } = user;
                      return (
                        <Option key={_id}>
                          {fn1} {email1 ? `(${email1})` : ''}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2} />
            </Row>
          )}

          {!isCompanyWorker && (
            <>
              <Row align="middle" gutter={[24, 24]}>
                <Col span={8}>Name</Col>
                <Col span={14}>
                  <Form.Item
                    name="firstName"
                    rules={[{ required: true, message: 'Please enter name' }]}
                  >
                    <Input placeholder="Type name" />
                  </Form.Item>
                </Col>
                <Col span={2} />
              </Row>
              <Row align="middle" gutter={[24, 24]}>
                <Col span={8}>Email</Col>
                <Col span={14}>
                  <Form.Item
                    name="email"
                    rules={[
                      { type: 'email', required: true, message: 'Please enter a valid email' },
                    ]}
                  >
                    <Input placeholder="Type email" />
                  </Form.Item>
                </Col>
                <Col span={2} />
              </Row>
            </>
          )}
          <Row align="top" gutter={[24, 24]}>
            <Col span={8} style={{ marginTop: '8px' }}>
              Manage Location
            </Col>
            <Col span={14}>
              <Form.Item
                name="location"
                rules={[
                  {
                    required: true,
                    message: 'Please select locations',
                  },
                ]}
              >
                <Select
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  allowClear
                  mode="multiple"
                  showArrow
                  placeholder="Select locations"
                >
                  {formatListLocation.map((location1) => {
                    const { name = '', _id = '' } = location1;
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
export default SelectUser;
