import React, { PureComponent } from 'react';
import { Form, Select, Input, Button, Row, Col, notification } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import AdhaarCardForm from './components/AdhaarCardForm';
import VisaForm from './components/VisaForm';
import PassportForm from './components/PassportForm';
import styles from './index.less';

const { Option } = Select;
const groupData = [
  'Hiring Documents',
  'Qualifications/Certification',
  'Handbooks & Agreements',
  'PR Reports',
  'Indentification Documents',
];
const subData = {
  'Hiring Documents': ['Consent Forms', 'Tax Documents', 'Offer Letter', 'Employment Eligibility'],
  'Qualifications/Certification': ['Certificates'],
  'Handbooks & Agreements': ['Employee Handbook', 'Agreement'],
  'PR Reports': ['Agreement'],
  'Indentification Documents': ['Identity'],
};

@connect(({ loading, documentsManagement }) => ({
  loadingUploadDocument: loading.effects['documentsManagement/uploadDocument'],
  loadingEmployeeData: loading.effects['documentsManagement/fetchEmployeeData'],
  documentsManagement,
}))
class InformationUploadForm extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      // documentGroup: '',
      // documentType: '',
      identityType: '',
      checkEmployeeExists: false,
      hasTyped: false,
      passportExisted: false,
      type: subData[groupData[0]],
      secondType: subData[groupData[0]][0],
    };
    this.typingTimeoutRef = React.createRef(null);
  }

  componentDidMount = () => {
    this.formRef.current.setFieldsValue({
      documentType: subData[groupData[0]][0],
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'documentsManagement/clearEmployeeDetail',
    });
  };

  handleDocumentGroupChange = (value) => {
    this.formRef.current.setFieldsValue({
      documentType: subData[value][0],
    });
    this.setState({
      type: subData[value],
      secondType: subData[value][0],
      identityType: null,
    });
  };

  handleDocumentTypeChange = (value) => {
    this.setState({
      secondType: value,
    });
  };

  onIdentityTypeChange = (value) => {
    this.setState({
      identityType: value,
    });
  };

  getEmployeeDetail = (value) => {
    this.setState({
      hasTyped: true,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'documentsManagement/clearEmployeeDetail',
    });
    dispatch({
      type: 'documentsManagement/fetchEmployeeDetailByShortId',
      employeeId: value,
    }).then((statusCode) => {
      if (statusCode === 200) {
        this.setState({
          checkEmployeeExists: true,
        });
      } else {
        this.setState({
          checkEmployeeExists: false,
        });
      }
    });
  };

  addDocument = (fieldsValue, attachmentId, addDoc) => {
    const {
      dispatch,
      documentsManagement: { employeeDetail: { employee = '' } = {} },
    } = this.props;
    const { secondType } = this.state;
    const { documentName = '', documentGroup = '' } = fieldsValue;
    const documentData = {
      key: documentName,
      employeeGroup: secondType,
      parentEmployeeGroup: documentGroup,
      attachment: attachmentId,
      employee,
    };
    dispatch({
      type: 'documentsManagement/uploadDocument',
      data: documentData,
    }).then((uploadedDocument) => {
      const { _id = '' } = uploadedDocument;
      addDoc(fieldsValue, _id);
    });
  };

  refreshPage = () => {
    setTimeout(() => {
      window.location.reload(false);
    }, 3000);
  };

  addDocumentSuccessfully = () => {
    notification.success({ message: 'Add document successfully! Refreshing page...' });
    this.refreshPage();
  };

  addPassport = (fieldsValue, documentId) => {
    const { dispatch, employeeDetail: { employee = '' } = {} } = this.props;
    const { country = '', issuedOn = '', passportNumber = '', validTill = '' } = fieldsValue;

    const formatIssuedOn = moment(issuedOn);
    const formatValidTill = moment(validTill);
    // console.log('uploadedDocumentId', documentId);
    const passportData = {
      passportNumber,
      passportIssuedCountry: country,
      passportIssuedOn: formatIssuedOn,
      passportValidTill: formatValidTill,
      employee,
      document: documentId,
    };

    dispatch({
      type: 'documentsManagement/addPassport',
      data: passportData,
    }).then((statusCode) => {
      if (statusCode !== 200) {
        dispatch({
          type: 'documentsManagement/deleteDocument',
          id: documentId,
        });
      } else {
        this.refreshPage();
      }
    });
  };

  addVisa = (fieldsValue, documentId) => {
    const {
      dispatch,
      documentsManagement: { employeeDetail: { employee = '' } = {} },
    } = this.props;
    const {
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
      employee,
    };

    dispatch({
      type: 'documentsManagement/addVisa',
      data: visaData,
    }).then((statusCode) => {
      if (statusCode !== 200) {
        dispatch({
          type: 'documentsManagement/deleteDocument',
          id: documentId,
        });
      } else {
        this.refreshPage();
      }
    });
  };

  addAdhaarCard = (fieldsValue, documentId) => {
    // const { dispatch } = this.props;
    // const { employeeId = '', adhaarCardNumber = '' } = fieldsValue;
    // const adhaarCardData = {
    // };
    // dispatch({
    //   type: 'documentsManagement/addVisa',
    //   data: visaData,
    // });
  };

  handleInput = (event) => {
    const { value } = event.target;
    if (this.typingTimeoutRef.current) {
      clearTimeout(this.typingTimeoutRef.current);
    }
    this.typingTimeoutRef.current = setTimeout(() => {
      this.getEmployeeDetail(value);
    }, 500);
  };

  onFinish = (fieldsValue) => {
    console.log('fieldsValue', fieldsValue);
    const { secondType, identityType, checkEmployeeExists } = this.state;
    const { attachmentId = '' } = this.props;
    if (!checkEmployeeExists) {
      notification.error({ message: 'Employee does not exists!' });
    } else if (attachmentId === '') {
      notification.error({ message: 'Please choose file to upload!' });
    } else if (secondType !== 'Identity') {
      this.addDocument(fieldsValue, attachmentId, this.addDocumentSuccessfully);
    } else if (secondType === 'Identity' && identityType === 'Passport') {
      this.addDocument(fieldsValue, attachmentId, this.addPassport);
    } else if (secondType === 'Identity' && identityType === 'Visa') {
      this.addDocument(fieldsValue, attachmentId, this.addVisa);
      // } else if (documentType === 'Identity' && identityType === 'Adhaar Card') {
      //   this.addDocument(fieldsValue, attachmentId, this.addAdhaarCard);
    }
  };

  checkPassportExists = (passportNo) => {
    const { secondType, identityType } = this.state;
    const passportExisted = passportNo !== '';
    if (secondType === 'Identity' && identityType === 'Passport') {
      this.setState({
        passportExisted,
      });
    } else {
      this.setState({
        passportExisted: false,
      });
    }
  };

  render() {
    const {
      type,
      secondType,
      identityType,
      checkEmployeeExists,
      hasTyped,
      passportExisted,
    } = this.state;
    const {
      documentsManagement: {
        employeeDetail: { firstName = '', lastName = '', passportNo = '' } = '',
      },
    } = this.props;

    this.checkPassportExists(passportNo);

    return (
      <div className={styles.InformationUploadForm}>
        <div className={styles.formTitle}>
          <span>Document Information</span>
        </div>
        <Form
          name="uploadForm"
          ref={this.formRef}
          initialValues={{ documentGroup: groupData[0] }}
          layout="vertical"
          onFinish={this.onFinish}
        >
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
                <Input
                  className={
                    checkEmployeeExists || !hasTyped
                      ? styles.employeeExists
                      : styles.employeeNotExists
                  }
                  onChange={this.handleInput}
                />
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
                <Select onChange={this.handleDocumentGroupChange}>
                  {groupData.map((each) => (
                    <Option key={each}>{each}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Document Type"
                name="documentType"
                rules={[{ required: true, message: 'Please select document type!' }]}
              >
                <Select onChange={this.handleDocumentTypeChange}>
                  {type.map((each) => (
                    <Option key={each}>{each}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {secondType === 'Identity' && (
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
                    <Option value="Adhaar Card" disabled>
                      Adhaar Card
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              {identityType === 'Adhaar Card' && <AdhaarCardForm />}
            </Row>
          )}

          {identityType === 'Visa' && <VisaForm />}
          {identityType === 'Passport' && passportNo === '' && <PassportForm />}
          {identityType === 'Passport' && passportNo !== '' && (
            <p style={{ fontStyle: 'italic', color: 'red' }}>
              The passport of this employee is already existed
            </p>
          )}
          <Form.Item>
            {passportExisted ? (
              <Button type="primary" htmlType="submit" disabled>
                Upload
              </Button>
            ) : (
              <Button type="primary" htmlType="submit">
                Upload
              </Button>
            )}
            {/* <Button type="primary" htmlType="submit"> */}
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default InformationUploadForm;
