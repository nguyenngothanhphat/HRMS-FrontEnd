import React, { PureComponent } from 'react';
import { Form, Select, Input, Button, Row, Col } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import AdhaarCardForm from './components/AdhaarCardForm';
import VisaForm from './components/VisaForm';
import PassportForm from './components/PassportForm';
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
      documentType: null,
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

  addDocument = (fieldsValue, attachmentId, addDoc) => {
    const { dispatch } = this.props;
    const { documentType } = this.state;
    const { documentName = '', documentGroup = '', employeeId = '' } = fieldsValue;
    const documentData = {
      key: documentName,
      employeeGroup: documentType,
      parentEmployeeGroup: documentGroup,
      attachment: attachmentId,
      employee: employeeId,
    };
    dispatch({
      type: 'documentsManagement/uploadDocument',
      data: documentData,
    }).then((uploadedDocument) => {
      const { _id } = uploadedDocument;
      addDoc(fieldsValue, _id);
    });
  };

  addPassport = (fieldsValue, documentId) => {
    const { dispatch } = this.props;
    const {
      country = '',
      employeeId = '',
      issuedOn = '',
      passportNumber = '',
      validTill = '',
    } = fieldsValue;

    const formatIssuedOn = moment(issuedOn);
    const formatValidTill = moment(validTill);
    // console.log('uploadedDocumentId', documentId);
    const passportData = {
      passportNumber,
      passportIssuedCountry: country,
      passportIssuedOn: formatIssuedOn,
      passportValidTill: formatValidTill,
      employee: employeeId,
      document: documentId,
    };

    dispatch({
      type: 'documentsManagement/addPassport',
      data: passportData,
    });
  };

  addVisa = (fieldsValue, documentId) => {
    const { dispatch } = this.props;
    const {
      employeeId = '',
      country = '',
      visaNumber = '',
      visaType = '',
      entryType = '',
      issuedOn = '',
      validTill = '',
    } = fieldsValue;

    const formatIssuedOn = moment(issuedOn);
    const formatValidTill = moment(validTill);
    // console.log('uploadedDocumentId', documentId);
    const visaData = {
      visaNumber,
      visaIssuedCountry: country,
      visaIssuedOn: formatIssuedOn,
      visaValidTill: formatValidTill,
      visaType,
      visaEntryType: entryType,
      document: documentId,
      employee: employeeId,
    };

    dispatch({
      type: 'documentsManagement/addVisa',
      data: visaData,
    });
  };

  onFinish = (fieldsValue) => {
    // eslint-disable-next-line no-console
    console.log('fieldsValue', fieldsValue);
    const { documentType, identityType } = this.state;
    const { attachmentId } = this.props;
    if (documentType !== 'Identity' && attachmentId !== '') {
      this.addDocument(fieldsValue, attachmentId, () => {});
    } else if (documentType === 'Identity' && identityType === 'Passport') {
      this.addDocument(fieldsValue, attachmentId, this.addPassport);
    } else if (documentType === 'Identity' && identityType === 'Visa') {
      this.addDocument(fieldsValue, attachmentId, this.addVisa);
    }
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
                <Select value={documentType} onChange={this.onDocumentTypeChange}>
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
              {identityType === 'Adhaar Card' && <AdhaarCardForm />}
            </Row>
          )}

          {identityType === 'Visa' && <VisaForm />}

          {identityType === 'Passport' && <PassportForm />}

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
