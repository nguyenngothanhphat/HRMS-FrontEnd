import React, { PureComponent } from 'react';
import { Form, Select, Input, Button, Row, Col, DatePicker } from 'antd';
import { connect } from 'umi';

import styles from './index.less';

const { Option } = Select;

const documentCategory = [
  {
    group: 'Hiring Documents',
    subGroup: ['Consent Forms', 'Tax Documents', 'Offer Letter', 'Employment Eligibility'],
  },
  {
    group: 'Qualifications/Certification',
    subGroup: ['Certificates'],
  },
  {
    group: 'Handbooks & Agreements',
    subGroup: ['Employee Handbook', 'Agreement'],
  },
  {
    group: 'PR Reports',
    subGroup: ['Agreement'],
  },
  {
    group: 'Indentification Documents',
    subGroup: ['Identity'],
  },
];

@connect(({ loading, documentsManagement }) => ({
  loadingUploadDocument: loading.effects['documentsManagement/uploadDocument'],
  loadingEmployeeData: loading.effects['documentsManagement/fetchEmployeeData'],
  documentsManagement,
}))
class InformationUploadForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      documentGroup: '',
      documentType: '',
      identityType: '',
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'documentsManagement/clearEmployeeDetail',
    });
  };

  onDocumentGroupChange = (value) => {
    this.setState({
      documentGroup: value,
      documentType: '',
      identityType: '',
    });
  };

  onIdentityTypeChange = (value) => {
    this.setState({
      identityType: value,
    });
  };

  onDocumentTypeChange = (value) => {
    this.setState({
      documentType: value,
    });
  };

  getEmployeeName = (e) => {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'documentsManagement/clearEmployeeDetail',
    });
    dispatch({
      type: 'documentsManagement/fetchEmployeeDetail',
      payload: value,
    });
  };

  onFinish = (fieldsValue) => {
    // const { dispatch } = this.props;
    // eslint-disable-next-line no-console
    console.log('fieldsValue', fieldsValue);
  };

  render() {
    const { documentGroup = '', documentType = '', identityType = '' } = this.state;
    const {
      documentsManagement: {
        employeeDetail: { generalInfo: { firstName = '', lastName = '' } = {} } = '',
      },
    } = this.props;
    return (
      <div className={styles.InformationUploadForm}>
        <div className={styles.formTitle}>
          <span>Document Information</span>
        </div>
        <Form name="uploadForm" layout="vertical" onFinish={this.onFinish}>
          <Row gutter={['20', '20']}>
            <Col span={12}>
              <Form.Item
                label="Employee ID"
                name="employeeId"
                rules={[
                  {
                    required: true,
                    message: 'Please input employee ID!',
                  },
                ]}
              >
                <Input onChange={this.getEmployeeName} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Employee Name" name="employeeName">
                <Input placeholder={`${firstName} ${lastName}`} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={['20', '20']}>
            <Col span={12}>
              <Form.Item
                label="Company"
                name="company"
                rules={[{ required: true, message: 'Please select company!' }]}
              >
                <Select onChange={() => {}}>
                  <Option value="Company A">Company A</Option>
                  <Option value="Company B">Company B</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Document Name"
                name="documentName"
                rules={[{ required: true, message: 'Please input document name!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={['20', '20']}>
            <Col span={12}>
              <Form.Item
                label="Document Group"
                name="documentGroup"
                rules={[{ required: true, message: 'Please select document group!' }]}
              >
                <Select onChange={this.onDocumentGroupChange}>
                  {documentCategory.map((each) => {
                    return <Option value={each.group}>{each.group}</Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Document Type"
                name="documentType"
                rules={[{ required: true, message: 'Please select document type!' }]}
              >
                <Select onChange={this.onDocumentTypeChange} value={documentType}>
                  {documentCategory.map((each) => {
                    const { group, subGroup } = each;
                    if (group === documentGroup) {
                      return subGroup.map((sub) => <Option value={sub}>{sub}</Option>);
                    }
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {documentType === 'Identity' && (
            <Row gutter={['20', '20']}>
              <Col span={12}>
                <Form.Item
                  label="Identity Type"
                  name="identityType"
                  rules={[{ required: true, message: 'Please select identity type!' }]}
                >
                  <Select onChange={this.onIdentityTypeChange}>
                    <Option value="Visa">Visa</Option>
                    <Option value="Passport">Passport</Option>
                    <Option value="Adhaar Card">Adhaar Card</Option>
                  </Select>
                </Form.Item>
              </Col>
              {identityType === 'Adhaar Card' && (
                <Col span={12}>
                  <Form.Item
                    name="adhaarNumber"
                    label="Adhaar Number"
                    rules={[
                      {
                        required: true,
                        pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                        message: 'Invalid Adhaar Number',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              )}
            </Row>
          )}

          {identityType === 'Visa' && (
            <div>
              <Row gutter={['20', '20']}>
                <Col span={12}>
                  <Form.Item
                    name="visaNumber"
                    label="Visa Number"
                    rules={[
                      {
                        required: true,
                        pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                        message: 'Invalid Visa Number',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="visaType"
                    label="Visa Type"
                    rules={[{ required: true, message: 'Please select visa type!' }]}
                  >
                    <Select onChange={() => {}}>
                      <Option value="Type 1">Type 1</Option>
                      <Option value="Type 2">Type 2</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={['20', '20']}>
                <Col span={12}>
                  <Form.Item
                    name="country"
                    label="Country"
                    rules={[{ required: true, message: 'Please select country!' }]}
                  >
                    <Select onChange={() => {}}>
                      <Option value="US">US</Option>
                      <Option value="India">India</Option>
                      <Option value="Vietnam">Vietnam</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="entryType"
                    label="Entry Type"
                    rules={[{ required: true, message: 'Please select entry type!' }]}
                  >
                    <Select onChange={() => {}}>
                      <Option value="Type 1">Type 1</Option>
                      <Option value="Type 2">Type 2</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={['20', '20']}>
                <Col span={12}>
                  <Form.Item
                    name="issuedOn"
                    label="Issued On"
                    rules={[{ required: true, message: 'Please select issued time!' }]}
                  >
                    <DatePicker />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="validStill"
                    label="Valid Still"
                    rules={[{ required: true, message: 'Please select expired time!' }]}
                  >
                    <DatePicker />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          {identityType === 'Passport' && (
            <div>
              <Row gutter={['20', '20']}>
                <Col span={12}>
                  <Form.Item
                    name="passportNumber"
                    label="Passport Number"
                    rules={[
                      {
                        required: true,
                        pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                        message: 'Invalid Passport Number',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="country"
                    label="Country"
                    rules={[{ required: true, message: 'Please select country!' }]}
                  >
                    <Select onChange={() => {}}>
                      <Option value="US">US</Option>
                      <Option value="India">India</Option>
                      <Option value="Vietnam">Vietnam</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={['20', '20']}>
                <Col span={12}>
                  <Form.Item
                    name="issuedOn"
                    label="Issued On"
                    rules={[{ required: true, message: 'Please select issued time!' }]}
                  >
                    <DatePicker />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="validStill"
                    label="Valid Still"
                    rules={[{ required: true, message: 'Please select expired time!' }]}
                  >
                    <DatePicker />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Upload
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default InformationUploadForm;
