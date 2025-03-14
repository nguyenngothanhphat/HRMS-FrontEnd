/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { Form, Input, Skeleton, Select, Button, Checkbox, Row, Col } from 'antd';
import classnames from 'classnames';
import { connect } from 'umi';
import { CloseOutlined } from '@ant-design/icons';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import EditIcon from '@/assets/editBtnBlue.svg';
import s from './index.less';

const { Option } = Select;

@connect(
  ({
    loading,
    country: { listCountry = [] } = {},
    user: { currentUser: { email = '' } = {}, companiesOfUser: listCompany = [] } = {},
    upload: { urlImage = '' } = {},
    companiesManagement: {
      originData: { companyDetails } = {},
      companyTypeList = [],
      industryList = [],
    } = {},
  }) => ({
    listCountry,
    listCompany,
    companyDetails,
    urlImage,
    loadingUpdate: loading.effects['companiesManagement/updateCompany'],
    loadingAdd: loading.effects['companiesManagement/addCompanyReducer'],
    loadingGetCompanyDetails: loading.effects['companiesManagement/fetchCompanyDetails'],
    email,
    companyTypeList,
    industryList,
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
      isEditCompanyDetails: false,
      isEditAddresses: false,
      isEditContactInformation: false,
    };
  }

  componentDidMount = async () => {
    const { companyDetails = {} } = this.props;

    const {
      headQuarterAddress: { country: countryHeadquarter } = {},
      legalAddress: { country: countryLegal } = {},
    } = companyDetails;

    this.setState({
      countryHeadquarter,
      countryLegal,
    });

    this.compareHeadquarterLegalAddress();
  };

  // componentWillUnmount = () => {
  //   this.fetchData();
  // };

  onChangeCountry = (value, name) => {
    const stateName = name === 'countryHeadquarterProps' ? 'countryHeadquarter' : 'countryLegal';
    // console.log('name', stateName);
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
        cityHeadquarter,
        countryHeadquarterProps,
        stateHeadquarter,
        zipHeadquarter,
      } = this.formRef.current.getFieldsValue();
      this.formRef.current.setFieldsValue({
        legalAddressLine1: headquarterAddressLine1,
        legalAddressLine2: headquarterAddressLine2,
        cityLegal: cityHeadquarter,
        countryLegalProps: countryHeadquarterProps,
        stateLegal: stateHeadquarter,
        zipLegal: zipHeadquarter,
      });
      // console.log('ref', this.formRef.current.getFieldsValue());
    } else {
      this.formRef.current.setFieldsValue({
        legalAddressLine1: undefined,
        legalAddressLine2: undefined,
        cityLegal: undefined,
        countryLegalProps: undefined,
        stateLegal: undefined,
        zipLegal: undefined,
      });
    }
    this.setState({
      checkLegalSameHeadQuarter: checked,
    });
  };

  onFinish = async (values) => {
    const {
      dispatch,
      companyId,
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
      cityHeadquarter,
      cityLegal,
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
      industry,
      companyType,
    } = values;

    const { listCompany = [] } = this.props;
    let parentTenantId = listCompany.find((company) => company?._id === parentCompany);
    parentTenantId = parentTenantId?.tenant;

    const tenantId = getCurrentTenant();
    let payload = {
      // id: companyId || '',
      company: {
        name,
        dba,
        ein,
        website,
        industry,
        companyType,
        logoUrl: newLogo,
        headQuarterAddress: {
          addressLine1: headquarterAddressLine1,
          addressLine2: headquarterAddressLine2 || '',
          city: cityHeadquarter,
          country: countryHeadquarterProps,
          state: stateHeadquarter,
          zipCode: zipHeadquarter,
        },
        legalAddress: {
          addressLine1: checkLegalSameHeadQuarter ? headquarterAddressLine1 : legalAddressLine1,
          addressLine2: checkLegalSameHeadQuarter
            ? headquarterAddressLine2 || ''
            : legalAddressLine2 || '',
          city: checkLegalSameHeadQuarter ? cityHeadquarter : cityLegal,
          country: checkLegalSameHeadQuarter ? countryHeadquarterProps : countryLegalProps,
          state: checkLegalSameHeadQuarter ? stateHeadquarter : stateLegal,
          zipCode: checkLegalSameHeadQuarter ? zipHeadquarter : zipLegal,
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
          name,
          headQuarterAddress: {
            addressLine1: headquarterAddressLine1,
            addressLine2: headquarterAddressLine2,
            city: cityHeadquarter,
            country: countryHeadquarterProps,
            state: stateHeadquarter,
            zipCode: zipHeadquarter,
          },
          legalAddress: {
            addressLine1: checkLegalSameHeadQuarter ? headquarterAddressLine1 : legalAddressLine1,
            addressLine2: checkLegalSameHeadQuarter
              ? headquarterAddressLine2 || ''
              : legalAddressLine2 || '',
            city: checkLegalSameHeadQuarter ? cityHeadquarter : cityLegal,
            country: checkLegalSameHeadQuarter ? countryHeadquarterProps : countryLegalProps,
            state: checkLegalSameHeadQuarter ? stateHeadquarter : stateLegal,
            zipCode: checkLegalSameHeadQuarter ? zipHeadquarter : zipLegal,
          },
          isHeadquarter: true,
        },
      ],
      isNewTenant: false,
      childOfCompany: parentCompany,
      parentTenantId,
    };
    if (companyId) {
      payload = {
        ...payload?.company,
        id: companyId,
        tenantId,
        childOfCompany: parentCompany,
        // tenant: parentTenantId,
      };
      const res = await dispatch({
        type: 'companiesManagement/updateCompany',
        payload,
        dataTempKept: {},
        isAccountSetup: true,
      });
      const { statusCode = 0, data = {} } = res;
      if (statusCode === 200) {
        dispatch({
          type: 'companiesManagement/saveOrigin',
          payload: { companyDetails: { company: data } },
        });
        this.setState({
          isEditAddresses: false,
          isEditCompanyDetails: false,
          isEditContactInformation: false,
        });
      }
    } else {
      dispatch({
        type: 'companiesManagement/addCompanyReducer',
        payload,
        dataTempKept: {},
        isAccountSetup: true,
      });
    }
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
        return /^(?=.{0,25}$)((?:(?:\(?(?:00|\+)([1-4]\d\d|[0-9]\d?)\)?)?[\-\.\ ]?)?((?:\(?\d{1,}\)?[\-\.\ ]?){0,})(?:[\-\.\ ]?(?:#|ext\.?|extension|x)[\-\.\ ]?(\d+))?)$/gm;
      // return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
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

  compareHeadquarterLegalAddress = () => {
    const { companyDetails = {} } = this.props;
    const {
      company: {
        headQuarterAddress: {
          addressLine1: headquarterAddressLine1 = '',
          addressLine2: headquarterAddressLine2 = '',
          country: countryHeadquarterProps = '',
          state: stateHeadquarter = '',
          zipCode: zipHeadquarter = '',
          city: cityHeadquarter = '',
        } = {},
        legalAddress: {
          addressLine1: legalAddressLine1 = '',
          addressLine2: legalAddressLine2 = '',
          country: countryLegalProps = '',
          state: stateLegal = '',
          zipCode: zipLegal = '',
          city: cityLegal = '',
        } = {},
        // isHeadquarter,
      } = {},
    } = companyDetails;

    const check =
      headquarterAddressLine1 === legalAddressLine1 &&
      headquarterAddressLine2 === legalAddressLine2 &&
      cityHeadquarter === cityLegal &&
      countryHeadquarterProps === countryLegalProps &&
      stateHeadquarter === stateLegal &&
      zipHeadquarter === zipLegal;

    this.setState({
      checkLegalSameHeadQuarter: check,
    });
  };

  componentDidUpdate = (prevProps) => {
    const { companyDetails = {} } = this.props;
    if (JSON.stringify(prevProps.companyDetails) !== JSON.stringify(companyDetails)) {
      this.compareHeadquarterLegalAddress();
    }
  };

  handleCancel = (key) => {
    const { companyDetails = {}, email = '' } = this.props;
    const {
      company: {
        name,
        dba,
        ein,
        industry,
        companyType,
        website,
        // logoUrl,
        headQuarterAddress: {
          addressLine1: headquarterAddressLine1,
          addressLine2: headquarterAddressLine2,
          city: cityHeadquarter,
          country: countryHeadquarterProps,
          state: stateHeadquarter,
          zipCode: zipHeadquarter,
        } = {},
        legalAddress: {
          addressLine1: legalAddressLine1,
          addressLine2: legalAddressLine2,
          city: cityLegal,
          country: countryLegalProps,
          state: stateLegal,
          zipCode: zipLegal,
        } = {},
        hrContactEmail: hrEmail,
        hrContactName: hrName,
        hrContactPhone: hrPhone,
        childOfCompany = undefined,
        // isHeadquarter,
      } = {},
    } = companyDetails;

    switch (key) {
      case 1:
        this.formRef.current.setFieldsValue({
          name,
          dba,
          ein,
          industry,
          companyType,
          website,
          parentCompany: childOfCompany,
        });
        break;
      case 2:
        this.formRef.current.setFieldsValue({
          headquarterAddressLine1,
          headquarterAddressLine2,
          cityHeadquarter,
          countryHeadquarterProps,
          stateHeadquarter,
          zipHeadquarter,
          legalAddressLine1,
          legalAddressLine2,
          cityLegal,
          countryLegalProps,
          stateLegal,
          zipLegal,
        });
        this.compareHeadquarterLegalAddress();
        break;
      case 3:
        this.formRef.current.setFieldsValue({
          ownerEmail: email,
          hrName,
          hrEmail,
          hrPhone,
        });
        break;
      default:
        break;
    }
  };

  handleEdit = (key) => {
    const { isEditContactInformation, isEditCompanyDetails, isEditAddresses } = this.state;
    switch (key) {
      case 1:
        if (isEditCompanyDetails) this.handleCancel(1);
        this.setState({
          isEditCompanyDetails: !isEditCompanyDetails,
        });
        break;
      case 2:
        if (isEditAddresses) this.handleCancel(2);
        this.setState({
          isEditAddresses: !isEditAddresses,
        });
        break;
      case 3:
        if (isEditContactInformation) this.handleCancel(3);
        this.setState({
          isEditContactInformation: !isEditContactInformation,
        });
        break;
      default:
        break;
    }
  };

  onChangeState = (value) => {
    if (value) {
      this.formRef.current.setFieldsValue({
        zipHeadquarter: '',
      });
    }
  };

  render() {
    const {
      countryHeadquarter = '',
      countryLegal = '',
      checkLegalSameHeadQuarter = false,
      isEditContactInformation,
      isEditCompanyDetails,
      isEditAddresses,
    } = this.state;
    const {
      listCountry = [],
      listCompany = [],
      companyDetails = {},
      loadingUpdate,
      loadingAdd,
      companyId,
      email,
      companyTypeList = [],
      industryList = [],
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
        industry,
        companyType,
        // logoUrl,
        headQuarterAddress: {
          addressLine1: headquarterAddressLine1,
          addressLine2: headquarterAddressLine2,
          city: cityHeadquarter,
          country: countryHeadquarterProps,
          state: stateHeadquarter,
          zipCode: zipHeadquarter,
        } = {},
        legalAddress: {
          addressLine1: legalAddressLine1,
          addressLine2: legalAddressLine2,
          city: cityLegal,
          country: countryLegalProps,
          state: stateLegal,
          zipCode: zipLegal,
        } = {},
        isSameAsHeadquarter,
        hrContactEmail: hrEmail,
        hrContactName: hrName,
        hrContactPhone: hrPhone,
        childOfCompany = '',
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
    const currentCompany = getCurrentCompany();
    return (
      <Form
        className={s.root}
        ref={this.formRef}
        onFinish={this.onFinish}
        // onFinish={(values) => console.log('values', values)}
        autoComplete="off"
        validateMessages={validateMessages}
        initialValues={{
          name,
          dba,
          ein,
          website,
          industry,
          companyType,
          headquarterAddressLine1,
          headquarterAddressLine2,
          cityHeadquarter,
          countryHeadquarterProps,
          stateHeadquarter,
          zipHeadquarter,
          legalAddressLine1,
          legalAddressLine2,
          cityLegal,
          countryLegalProps,
          stateLegal,
          zipLegal,
          ownerEmail: email,
          isSameAsHeadquarter,
          hrName,
          hrEmail,
          hrPhone,
          isNewTenant: false,
          isHeadquarter: true,
          parentCompany: childOfCompany || undefined,
          // logoUrl,
        }}
      >
        <div className={s.blockContent}>
          <div className={s.content__viewTop}>
            <p className={s.title}>Company Details</p>
            <div className={s.editBtn} onClick={() => this.handleEdit(1)}>
              {isEditCompanyDetails ? (
                <div className={s.wrapBtn}>
                  <CloseOutlined className={s.buttonIcon} />
                  <span className={s.cancelText}>Cancel</span>
                </div>
              ) : (
                <div className={s.wrapBtn}>
                  <img src={EditIcon} alt="edit" />
                  <span>Edit</span>
                </div>
              )}
            </div>
          </div>
          <div className={s.content__viewBottom}>
            <Row className={s.content__viewBottom__row}>
              <Col span={8}>
                <p className={s.content__viewBottom__row__textLabel}>Industry</p>
              </Col>
              <Col span={16}>
                <Form.Item name="industry">
                  <Select
                    placeholder="Select Industry"
                    showArrow
                    showSearch
                    allowClear
                    disabled={!isEditCompanyDetails}
                    className={s.parentCompanySelect}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {industryList.map((item) => (
                      <Option key={item._id}>{item.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row className={s.content__viewBottom__row}>
              <Col span={8}>
                <p className={s.content__viewBottom__row__textLabel}>Company Type</p>
              </Col>
              <Col span={16}>
                <Form.Item name="companyType">
                  <Select
                    placeholder="Select Company Type"
                    showArrow
                    showSearch
                    allowClear
                    disabled={!isEditCompanyDetails}
                    // defaultValue=""
                    className={s.parentCompanySelect}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {companyTypeList.map((item) => (
                      <Option key={item._id}>{item.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
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
                      <Input disabled={!isEditCompanyDetails} placeholder={label} />
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
                    disabled={!isEditCompanyDetails}
                    className={s.parentCompanySelect}
                    // onChange={(value) => this.onChangeCountry(value, 'countryLegal')}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {listCompany.map((item) => (
                      <Option
                        disabled={currentCompany === item?.childOfCompany || item._id === companyId}
                        key={item._id}
                      >
                        {item.name}
                      </Option>
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
            <div className={s.editBtn} onClick={() => this.handleEdit(2)}>
              {isEditAddresses ? (
                <div className={s.wrapBtn}>
                  <CloseOutlined className={s.buttonIcon} />
                  <span className={s.cancelText}>Cancel</span>
                </div>
              ) : (
                <div className={s.wrapBtn}>
                  <img src={EditIcon} alt="edit" />
                  <span>Edit</span>
                </div>
              )}
            </div>
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
                  <Input disabled={!isEditAddresses} placeholder="Address Line 1" />
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
                  <Input disabled={!isEditAddresses} placeholder="Address Line 2" />
                </Form.Item>
              </Col>
            </Row>
            <Row className={s.content__viewBottom__row}>
              <Col span={8}>
                <p className={s.content__viewBottom__row__textLabel}>City Name*</p>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="cityHeadquarter"
                  label={false}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter City Name!',
                    },
                  ]}
                >
                  <Input disabled={!isEditAddresses} placeholder="City Name" />
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
                  Country*
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
                    disabled={!isEditAddresses}
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
                  State*
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
                    onChange={this.onChangeState}
                    showArrow
                    showSearch
                    disabled={!countryHeadquarter || !isEditAddresses}
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
                  Zip / Postal Code*
                </p>
                <Form.Item
                  name="zipHeadquarter"
                  label={false}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter Zip/Postal Code!',
                    },
                  ]}
                >
                  <Input disabled={!isEditAddresses} placeholder="Zip Code" />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div
            className={classnames(
              s.content__viewTop,
              s.content__viewTop__legalAddress,
              checkLegalSameHeadQuarter ? s.content__viewTopWithoutBorder : '',
            )}
          >
            <p className={s.title}>Legal Address</p>
            <Checkbox
              // defaultChecked={checkLegalSameHeadQuarter}
              disabled={!isEditAddresses}
              onChange={this.onChangeCheckbox}
              defaultChecked={isSameAsHeadquarter}
              checked={checkLegalSameHeadQuarter}
            >
              Same as Headquarters address
            </Checkbox>
          </div>
          <div
            className={classnames(s.content__viewBottom, {
              [s.hidden]: checkLegalSameHeadQuarter,
            })}
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
                      message: 'Please enter Address Line 1!',
                    },
                  ]}
                >
                  <Input disabled={!isEditAddresses} placeholder="Address Line 1" />
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
                      message: 'Please enter Address Line 2!',
                    },
                  ]}
                >
                  <Input disabled={!isEditAddresses} placeholder="Address Line 2" />
                </Form.Item>
              </Col>
            </Row>
            <Row className={s.content__viewBottom__row}>
              <Col span={8}>
                <p className={s.content__viewBottom__row__textLabel}>City Name*</p>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="cityLegal"
                  label={false}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter City Name!',
                    },
                  ]}
                >
                  <Input disabled={!isEditAddresses} placeholder="City Name" />
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
                  Country*
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
                    disabled={!isEditAddresses}
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
                  State*
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
                    disabled={!isEditAddresses || !countryLegal}
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
                  Zip / Postal Code*
                </p>
                <Form.Item
                  name="zipLegal"
                  label={false}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter Zip/Postal Code!',
                    },
                  ]}
                >
                  <Input disabled={!isEditAddresses} placeholder="Zip/Postal Code" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
        <div className={s.blockContent} style={{ marginTop: '24px' }}>
          <div className={s.content__viewTop}>
            <p className={s.title}>Contact information</p>
            <div className={s.editBtn} onClick={() => this.handleEdit(3)}>
              {isEditContactInformation ? (
                <div className={s.wrapBtn}>
                  <CloseOutlined className={s.buttonIcon} />
                  <span className={s.cancelText}>Cancel</span>
                </div>
              ) : (
                <div className={s.wrapBtn}>
                  <img src={EditIcon} alt="edit" />
                  <span>Edit</span>
                </div>
              )}
            </div>
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
                        disabled={!isEditContactInformation}
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
            disabled={!(isEditAddresses || isEditCompanyDetails || isEditContactInformation)}
            loading={companyId ? loadingUpdate : loadingAdd}
          >
            Save
          </Button>
        </div>
      </Form>
    );
  }
}

export default CompanyDetails;
