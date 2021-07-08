/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { Form, Input, Select, Button, Checkbox, Row, Col } from 'antd';
import classnames from 'classnames';
import { connect } from 'umi';
import s from './index.less';

const { Option } = Select;

@connect(
  ({
    loading,
    country: { listCountry = [] } = {},
    user: { currentUser: { email = '' } = {}, companiesOfUser: listCompany = [] } = {},
    upload: { urlImage = '' } = {},
    companiesManagement: { originData: { companyDetails } = {} } = {},
  }) => ({
    listCountry,
    listCompany,
    companyDetails,
    urlImage,
    loadingUpdate: loading.effects['companiesManagement/updateCompany'],
    loadingAdd: loading.effects['companiesManagement/addCompanyReducer'],
    email,
  }),
)
class CompanyDetails extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      countryHeadquarter: '',
      countryLegal: '',
      checkLegalSameHeadQuarter: false,
      isFilled: true,
    };
  }

  componentDidMount() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    const { companyDetails = {} } = this.props;
    const {
      company: {
        headQuarterAddress: { country: countryHeadquarter } = {},
        legalAddress: { country: countryLegal } = {},
      } = {},
    } = companyDetails;
    this.setState({
      countryHeadquarter,
      countryLegal,
    });
  }

  onChangeCountry = (value, name) => {
    const stateName = name === 'countryHeadquarterProps' ? 'countryHeadquarter' : 'countryLegal';
    this.setState({
      [stateName]: value,
    });
    const countryName = name === 'countryHeadquarterProps' ? 'stateHeadquarter' : 'stateLegal';
    this.formRef.current.setFieldsValue({
      [countryName]: undefined,
    });
  };

  findListState = (idCountry) => {
    const { listCountry = [] } = this.props;
    const itemCountry = listCountry.find((item) => item._id === idCountry) || {};
    const listState = itemCountry.states || [];
    return listState;
  };

  onChangeCheckbox = ({ target: { checked } = {} }) => {
    if (checked) {
      const {
        headquarterAddressLine1,
        headquarterAddressLine2,
        countryHeadquarterProps,
        stateHeadquarter,
        zipHeadquarter,
      } = this.formRef.current.getFieldsValue();

      this.formRef.current.setFieldsValue({
        legalAddressLine1: headquarterAddressLine1,
        legalAddressLine2: headquarterAddressLine2,
        countryLegalProps: countryHeadquarterProps,
        stateLegal: stateHeadquarter,
        zipLegal: zipHeadquarter,
      });
      // console.log('ref', this.formRef.current.getFieldsValue());
    } else {
      this.formRef.current.setFieldsValue({
        legalAddressLine1: undefined,
        legalAddressLine2: undefined,
        countryLegalProps: undefined,
        stateLegal: undefined,
        zipLegal: undefined,
      });
    }
    this.setState({
      checkLegalSameHeadQuarter: checked,
    });
  };

  onFinish = (values) => {
    const {
      dispatch,
      // companyId,
      companyDetails: { company: { logoUrl: newLogo } = {} },
    } = this.props;
    const { checkLegalSameHeadQuarter } = this.state;
    const {
      countryHeadquarterProps,
      countryLegalProps,
      dba,
      ein,
      headquarterAddressLine1,
      headquarterAddressLine2,
      legalAddressLine1,
      legalAddressLine2,
      name,
      stateHeadquarter,
      stateLegal,
      website,
      zipHeadquarter,
      zipLegal,
      ownerEmail,
      hrName,
      hrEmail,
      hrPhone,
      parentCompany,
      // logoUrl,
    } = values;

    const { listCompany = [] } = this.props;
    let parentTenantId = listCompany.find((company) => company?._id === parentCompany);
    parentTenantId = parentTenantId?.tenant;

    const payload = {
      // id: companyId || '',
      company: {
        name,
        dba,
        ein,
        website,
        logoUrl: newLogo,
        headQuarterAddress: {
          addressLine1: headquarterAddressLine1,
          addressLine2: headquarterAddressLine2 || '',
          country: countryHeadquarterProps,
          state: stateHeadquarter,
          zipCode: zipHeadquarter,
        },
        legalAddress: {
          addressLine1: legalAddressLine1,
          addressLine2: legalAddressLine2 || '',
          country: countryLegalProps,
          state: stateLegal,
          zipCode: zipLegal,
        },
        isSameAsHeadquarter: checkLegalSameHeadQuarter,
        contactEmail: ownerEmail,
        hrContactName: hrName,
        hrContactEmail: hrEmail,
        hrContactPhone: hrPhone,
        // isHeadquarter: true,
      },
      locations: [
        {
          name: 'Headquarter',
          headQuarterAddress: {
            addressLine1: headquarterAddressLine1,
            addressLine2: headquarterAddressLine2,
            country: countryHeadquarterProps,
            state: stateHeadquarter,
            zipCode: zipHeadquarter,
          },
          legalAddress: {
            addressLine1: headquarterAddressLine1,
            addressLine2: headquarterAddressLine2,
            country: countryLegalProps,
            state: stateLegal,
            zipCode: zipLegal,
          },
          isHeadQuarter: true,
        },
      ],
      isNewTenant: !parentCompany,
      childOfCompany: parentCompany,
      parentTenantId,
    };
    // if (companyId) {
    //   dispatch({
    //     type: 'companiesManagement/updateCompany',
    //     payload,
    //     dataTempKept: {},
    //     isAccountSetup: true,
    //   });
    // } else {
    // const payloadAddCompanyTenant = { ...payload };
    // dispatch({
    //   type: 'companiesManagement/addCompanyTenant',
    //   payload: payloadAddCompanyTenant,
    //   dataTempKept: {},
    //   isAccountSetup: true,
    // });

    dispatch({
      type: 'companiesManagement/addCompanyReducer',
      payload,
      dataTempKept: {},
      isAccountSetup: true,
    });
  };

  // COMPANY DETAILS REGEX
  getRegexPatternCompanyDetails = (index) => {
    switch (index) {
      case 2:
        return /^[0-9]*$/;
      // eslint-disable-next-line no-useless-escape
      case 3:
        return /(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,63}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?/;
      default:
        return '';
    }
  };

  getRegexMessageCompanyDetails = (index) => {
    switch (index) {
      case 2:
        return 'Number only';
      case 3:
        return 'Wrong format. Example: www.hrms.com or https://www.hrms.com/...';
      default:
        return '';
    }
  };

  // CONTACT INFORMATION REGEX
  getRegexPatternContact = (index) => {
    switch (index) {
      case 3:
        // eslint-disable-next-line no-useless-escape
        return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      default:
        return '';
    }
  };

  getRegexMessageContact = (index) => {
    switch (index) {
      case 3:
        // eslint-disable-next-line no-useless-escape
        return 'Wrong phone number format.';
      default:
        return '';
    }
  };

  getTypeContact = (index) => {
    switch (index) {
      case 0:
      case 2:
        return 'email';
      default:
        return '';
    }
  };

  onValuesChange = (field) => {
    if (
      field.headquarterAddressLine1 ||
      field.countryHeadquarterProps ||
      field.stateHeadquarter ||
      field.zipHeadquarter
    ) {
      this.setState({ isFilled: false });
    }
  };

  render() {
    const {
      countryHeadquarter = '',
      countryLegal = '',
      checkLegalSameHeadQuarter = false,
      isFilled = false,
    } = this.state;
    const {
      listCountry = [],
      listCompany = [],
      companyDetails = {},
      loadingUpdate,
      loadingAdd,
      companyId,
      email,
    } = this.props;

    const fieldCompanyDetail = [
      {
        label: 'Legal Business Name*',
        name: 'name',
        required: true,
        message: 'Please enter Legal Business Name!',
      },
      {
        label: 'Doing Business As (DBA)*',
        name: 'dba',
        required: true,
        message: 'Please enter DBA!',
      },
      {
        label: 'Employer Identification Number (EIN)*',
        name: 'ein',
        required: true,
        message: 'Please enter EIN!',
      },
      { label: 'Company Website', name: 'website' },
    ];

    const fieldContactInformation = [
      {
        label: 'Primary contact',
        name: 'ownerEmail',
        placeholder: "Company owner's email",
        // defaultValue: email,
      },
      {
        label: 'HR contact',
        name: 'hrName',
        placeholder: "HR Manager's name",
      },
      {
        label: '',
        name: 'hrEmail',
        placeholder: "HR Manager's email",
      },
      {
        label: '',
        name: 'hrPhone',
        placeholder: "HR Manager's phone",
      },
    ];
    const listStateHead = this.findListState(countryHeadquarter) || [];
    const listStateLegal = this.findListState(countryLegal) || [];
    const {
      company: {
        name,
        dba,
        ein,
        website,
        // logoUrl,
        headQuarterAddress: {
          addressLine1: headquarterAddressLine1,
          addressLine2: headquarterAddressLine2,
          country: countryHeadquarterProps,
          state: stateHeadquarter,
          zipCode: zipHeadquarter,
        } = {},
        legalAddress: {
          addressLine1: legalAddressLine1,
          addressLine2: legalAddressLine2,
          country: countryLegalProps,
          state: stateLegal,
          zipCode: zipLegal,
        } = {},
        hrContactEmail: hrEmail,
        hrContactName: hrName,
        hrContactPhone: hrPhone,
        // isHeadquarter,
      } = {},
      // locations: [
      //   {
      //     headQuarterAddress: {
      //       addressLine1,
      //       addressLine2,
      //       country: { _id } = {},
      //       state,
      //       zipCode,
      //     } = {},
      //     legalAddress: {
      //       addressLine1,
      //       addressLine2,
      //       country: { _id } = {},
      //       state,
      //       zipCode,
      //     } = {},
      //   },
      // ],
      // isNewTenant,
    } = companyDetails;
    const validateMessages = {
      types: {
        // eslint-disable-next-line no-template-curly-in-string
        email: 'Wrong email format!',
      },
    };

    return (
      <Form
        className={s.root}
        ref={this.formRef}
        onFinish={this.onFinish}
        onValuesChange={this.onValuesChange}
        autoComplete="off"
        validateMessages={validateMessages}
        initialValues={{
          name,
          dba,
          ein,
          website,
          headquarterAddressLine1,
          headquarterAddressLine2,
          countryHeadquarterProps,
          stateHeadquarter,
          zipHeadquarter,
          legalAddressLine1,
          legalAddressLine2,
          countryLegalProps,
          stateLegal,
          zipLegal,
          ownerEmail: email,
          hrName,
          hrEmail,
          hrPhone,
          isNewTenant: false,
          isHeadQuarter: true,
          // logoUrl,
        }}
      >
        <div className={s.blockContent}>
          <div className={s.content__viewTop}>
            <p className={s.title}>Company Details</p>
          </div>
          <div className={s.content__viewBottom}>
            {fieldCompanyDetail.map(
              ({ label, name: nameField, required = false, message }, index) => (
                <Row key={nameField} className={s.content__viewBottom__row}>
                  <Col span={8}>
                    <p className={s.content__viewBottom__row__textLabel}>{label}</p>
                  </Col>
                  <Col span={16}>
                    <Form.Item
                      name={nameField}
                      rules={[
                        {
                          required,
                          message,
                        },
                        {
                          pattern: this.getRegexPatternCompanyDetails(index),
                          message: this.getRegexMessageCompanyDetails(index),
                        },
                      ]}
                    >
                      <Input autoComplete="off" placeholder={label} />
                    </Form.Item>
                  </Col>
                </Row>
              ),
            )}
            <Row className={s.content__viewBottom__row}>
              <Col span={8}>
                <p className={s.content__viewBottom__row__textLabel}>Parent Company</p>
              </Col>
              <Col span={16}>
                <Form.Item name="parentCompany">
                  <Select
                    placeholder="Select Parent Company"
                    showArrow
                    showSearch
                    allowClear
                    defaultValue=""
                    className={s.parentCompanySelect}
                    // onChange={(value) => this.onChangeCountry(value, 'countryLegal')}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option
                      key=""
                      value=""
                      style={{ borderBottom: 'solid 1px #e6e6e6', color: '#666' }}
                    >
                      None
                    </Option>
                    {listCompany.map((item) => (
                      <Option key={item._id}>{item.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
        <div className={s.blockContent} style={{ marginTop: '24px' }}>
          <div className={s.content__viewTop}>
            <p className={s.title}>Headquarter Address</p>
          </div>
          <div className={s.content__viewBottom}>
            <Row className={s.content__viewBottom__row}>
              <Col span={8}>
                <p className={s.content__viewBottom__row__textLabel}>Address Line 1*</p>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="headquarterAddressLine1"
                  label={false}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter Address!',
                    },
                  ]}
                >
                  <Input autoComplete="off" placeholder="Address Line 1" />
                </Form.Item>
              </Col>
            </Row>
            <Row className={s.content__viewBottom__row}>
              <Col span={8}>
                <p className={s.content__viewBottom__row__textLabel}>Address Line 2</p>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="headquarterAddressLine2"
                  label={false}
                  rules={[
                    {
                      required: false,
                      message: 'Please enter Address!',
                    },
                  ]}
                >
                  <Input autoComplete="off" placeholder="Address Line 2" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 24]} className={s.content__viewBottom__row}>
              <Col span={8} className={s.viewFormVertical}>
                <p
                  className={classnames(
                    s.content__viewBottom__row__textLabel,
                    s.content__viewBottom__row__textLabelVertical,
                  )}
                >
                  Country
                </p>
                <Form.Item
                  name="countryHeadquarterProps"
                  label={false}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter Country!',
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Country"
                    showArrow
                    showSearch
                    onChange={(value) => this.onChangeCountry(value, 'countryHeadquarterProps')}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {listCountry.map((item) => (
                      <Option key={item._id}>{item.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} className={s.viewFormVertical}>
                <p
                  className={classnames(
                    s.content__viewBottom__row__textLabel,
                    s.content__viewBottom__row__textLabelVertical,
                  )}
                >
                  State
                </p>
                <Form.Item
                  name="stateHeadquarter"
                  label={false}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter State!',
                    },
                  ]}
                >
                  <Select
                    placeholder="Select State"
                    showArrow
                    showSearch
                    disabled={!countryHeadquarter}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {listStateHead.map((item) => (
                      <Option key={item}>{item}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} className={s.viewFormVertical}>
                <p
                  className={classnames(
                    s.content__viewBottom__row__textLabel,
                    s.content__viewBottom__row__textLabelVertical,
                  )}
                >
                  Zip
                </p>
                <Form.Item
                  name="zipHeadquarter"
                  label={false}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter Zip Code!',
                    },
                  ]}
                >
                  <Input autoComplete="off" placeholder="Zip Code" />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className={classnames(s.content__viewTop, s.content__viewTop__legalAddress)}>
            <p className={s.title}>Legal Address</p>
            <Checkbox disabled={isFilled} onChange={this.onChangeCheckbox}>
              Same as Headquarters address
            </Checkbox>
          </div>
          <div
            className={classnames(s.content__viewBottom, { [s.hidden]: checkLegalSameHeadQuarter })}
          >
            <Row className={s.content__viewBottom__row}>
              <Col span={8}>
                <p className={s.content__viewBottom__row__textLabel}>Address Line 1*</p>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="legalAddressLine1"
                  label={false}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter Address!',
                    },
                  ]}
                >
                  <Input autoComplete="off" placeholder="Address Line 1" />
                </Form.Item>
              </Col>
            </Row>
            <Row className={s.content__viewBottom__row}>
              <Col span={8}>
                <p className={s.content__viewBottom__row__textLabel}>Address Line 2</p>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="legalAddressLine2"
                  label={false}
                  rules={[
                    {
                      required: false,
                      message: 'Please enter Address!',
                    },
                  ]}
                >
                  <Input autoComplete="off" placeholder="Address Line 2" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 24]} className={s.content__viewBottom__row}>
              <Col span={8} className={s.viewFormVertical}>
                <p
                  className={classnames(
                    s.content__viewBottom__row__textLabel,
                    s.content__viewBottom__row__textLabelVertical,
                  )}
                >
                  Country
                </p>
                <Form.Item
                  name="countryLegalProps"
                  label={false}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter Country!',
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Country"
                    showArrow
                    showSearch
                    onChange={(value) => this.onChangeCountry(value, 'countryLegalProps')}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {listCountry.map((item) => (
                      <Option key={item._id}>{item.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} className={s.viewFormVertical}>
                <p
                  className={classnames(
                    s.content__viewBottom__row__textLabel,
                    s.content__viewBottom__row__textLabelVertical,
                  )}
                >
                  State
                </p>
                <Form.Item
                  name="stateLegal"
                  label={false}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter State!',
                    },
                  ]}
                >
                  <Select
                    placeholder="Select State"
                    showArrow
                    showSearch
                    disabled={!countryLegal}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {listStateLegal.map((item) => (
                      <Option key={item}>{item}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} className={s.viewFormVertical}>
                <p
                  className={classnames(
                    s.content__viewBottom__row__textLabel,
                    s.content__viewBottom__row__textLabelVertical,
                  )}
                >
                  Zip
                </p>
                <Form.Item
                  name="zipLegal"
                  label={false}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter Zip Code!',
                    },
                  ]}
                >
                  <Input autoComplete="off" placeholder="Zip Code" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
        <div className={s.blockContent} style={{ marginTop: '24px' }}>
          <div className={s.content__viewTop}>
            <p className={s.title}>Contact information</p>
          </div>
          <div className={s.content__viewBottom}>
            {fieldContactInformation.map(
              (
                { label, name: nameField, required = false, message, placeholder, defaultValue },
                index,
              ) => (
                <Row key={nameField} className={s.content__viewBottom__row}>
                  <Col span={8}>
                    <p className={s.content__viewBottom__row__textLabel}>{label}</p>
                  </Col>
                  <Col span={16}>
                    <Form.Item
                      name={nameField}
                      rules={[
                        {
                          required,
                          message,
                        },
                        {
                          pattern: this.getRegexPatternContact(index),
                          message: this.getRegexMessageContact(index),
                        },
                        {
                          type: this.getTypeContact(index),
                        },
                      ]}
                    >
                      <Input
                        autoComplete="off"
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ),
            )}
          </div>
        </div>
        <div className={s.viewBtn}>
          <Button
            className={s.btnSubmit}
            htmlType="submit"
            loading={companyId ? loadingUpdate : loadingAdd}
          >
            Next
          </Button>
        </div>
      </Form>
    );
  }
}

export default CompanyDetails;
