/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { Form, Input, Select, Button, Checkbox } from 'antd';
import classnames from 'classnames';
import { connect } from 'umi';
import s from './index.less';

const { Option } = Select;

@connect(
  ({
    loading,
    country: { listCountry = [] } = {},
    companiesManagement: { originData: { companyDetails } = {} } = {},
  }) => ({
    listCountry,
    companyDetails,
    loadingUpdate: loading.effects['companiesManagement/updateCompany'],
    loadingAdd: loading.effects['companiesManagement/addCompanyReducer'],
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
    };
  }

  componentDidMount() {
    const { companyDetails = {} } = this.props;
    const {
      headQuarterAddress: { country: { _id: countryHeadquarter } = {} } = {},
      legalAddress: { country: { _id: countryLegal } = {} } = {},
    } = companyDetails;
    this.setState({
      countryHeadquarter,
      countryLegal,
    });
  }

  onChangeCountry = (value, name) => {
    this.setState({
      [name]: value,
    });
    const fieldStateChange = name === 'countryHeadquarter' ? 'stateHeadquarter' : 'stateLegal';
    this.formRef.current.setFieldsValue({
      [fieldStateChange]: undefined,
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
        countryHeadquarter,
        stateHeadquarter,
        zipHeadquarter,
      } = this.formRef.current.getFieldsValue();
      this.formRef.current.setFieldsValue({
        legalAddressLine1: headquarterAddressLine1,
        legalAddressLine2: headquarterAddressLine2,
        countryLegal: countryHeadquarter,
        stateLegal: stateHeadquarter,
        zipLegal: zipHeadquarter,
      });
    } else {
      this.formRef.current.setFieldsValue({
        legalAddressLine1: undefined,
        legalAddressLine2: undefined,
        countryLegal: undefined,
        stateLegal: undefined,
        zipLegal: undefined,
      });
    }
    this.setState({
      checkLegalSameHeadQuarter: checked,
    });
  };

  onFinish = (values) => {
    const { dispatch, companyId } = this.props;
    console.log(companyId);
    const {
      countryHeadquarter,
      countryLegal,
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
    } = values;
    const payload = {
      // id: companyId || '',
      company: {
        name,
        dba,
        ein,
        website,
        headQuarterAddress: {
          addressLine1: headquarterAddressLine1,
          addressLine2: headquarterAddressLine2 || '',
          country: countryHeadquarter,
          state: stateHeadquarter,
          zipCode: zipHeadquarter,
        },
        legalAddress: {
          addressLine1: legalAddressLine1,
          addressLine2: legalAddressLine2 || '',
          country: countryLegal,
          state: stateLegal,
          zipCode: zipLegal,
        },
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
            country: countryHeadquarter,
            state: stateHeadquarter,
            zipCode: zipHeadquarter,
          },
          legalAddress: {
            addressLine1: headquarterAddressLine1,
            addressLine2: headquarterAddressLine2,
            country: countryLegal,
            state: stateLegal,
            zipCode: zipLegal,
          },
          isHeadquarter: true,
        },
      ],
      isNewTenant: false,
    };
    if (companyId) {
      dispatch({
        type: 'companiesManagement/updateCompany',
        payload,
        dataTempKept: {},
        isAccountSetup: true,
      });
    } else {
      console.log('payload add new company', payload);
      dispatch({
        type: 'companiesManagement/addCompanyReducer',
        payload,
        dataTempKept: {},
        isAccountSetup: true,
      });
    }
  };

  render() {
    const {
      countryHeadquarter = '',
      countryLegal = '',
      checkLegalSameHeadQuarter = false,
    } = this.state;
    const {
      listCountry = [],
      companyDetails = {},
      loadingUpdate,
      loadingAdd,
      companyId,
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
      { label: 'Employer Identification Number (EIN)', name: 'ein' },
      { label: 'Compay Website', name: 'website' },
    ];

    const fieldContactInformation = [
      {
        label: 'Primary contact',
        name: 'ownerEmail',
        placeholder: "Company owner's email",
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
      // company: {
      name,
      dba,
      ein,
      website,
      headQuarterAddress: {
        addressLine1: headquarterAddressLine1,
        addressLine2: headquarterAddressLine2,
        country: { _id: countryHeadquarterProps } = {},
        state: stateHeadquarter,
        zipCode: zipHeadquarter,
      } = {},
      legalAddress: {
        addressLine1: legalAddressLine1,
        addressLine2: legalAddressLine2,
        country: { _id: countryLegalProps } = {},
        state: stateLegal,
        zipCode: zipLegal,
      } = {},
      contactEmail: ownerEmail,
      hrContactEmail: hrEmail,
      hrContactName: hrName,
      hrContactPhone: hrPhone,
      // isHeadquarter,
      // },
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
    return (
      <Form
        className={s.root}
        ref={this.formRef}
        onFinish={this.onFinish}
        autoComplete="off"
        initialValues={{
          name,
          dba,
          ein,
          website,
          headquarterAddressLine1,
          headquarterAddressLine2,
          countryHeadquarter: countryHeadquarterProps,
          stateHeadquarter,
          zipHeadquarter,
          legalAddressLine1,
          legalAddressLine2,
          countryLegal: countryLegalProps,
          stateLegal,
          zipLegal,
          ownerEmail,
          hrName,
          hrEmail,
          hrPhone,
          isNewTenant: false,
          isHeadquarter: true,
        }}
      >
        <div className={s.blockContent}>
          <div className={s.content__viewTop}>
            <p className={s.title}>Company Details</p>
          </div>
          <div className={s.content__viewBottom}>
            {fieldCompanyDetail.map(({ label, name: nameField, required = false, message }) => (
              <div key={nameField} className={s.content__viewBottom__row}>
                <p className={s.content__viewBottom__row__textLabel}>{label}</p>
                <Form.Item
                  name={nameField}
                  rules={[
                    {
                      required,
                      message,
                    },
                  ]}
                >
                  <Input placeholder={label} />
                </Form.Item>
              </div>
            ))}
          </div>
        </div>
        <div className={s.blockContent} style={{ marginTop: '24px' }}>
          <div className={s.content__viewTop}>
            <p className={s.title}>Headquarter Address</p>
          </div>
          <div className={s.content__viewBottom}>
            <div className={s.content__viewBottom__row}>
              <p className={s.content__viewBottom__row__textLabel}>Address line 1*</p>
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
                <Input placeholder="Address Line 1" />
              </Form.Item>
            </div>
            <div className={s.content__viewBottom__row}>
              <p className={s.content__viewBottom__row__textLabel}>Address Line 2</p>
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
                <Input placeholder="Address Line 2" />
              </Form.Item>
            </div>
            <div className={s.content__viewBottom__row}>
              <div className={s.viewFormVertical}>
                <p
                  className={classnames(
                    s.content__viewBottom__row__textLabel,
                    s.content__viewBottom__row__textLabelVertical,
                  )}
                >
                  Country
                </p>
                <Form.Item
                  name="countryHeadquarter"
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
                    onChange={(value) => this.onChangeCountry(value, 'countryHeadquarter')}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {listCountry.map((item) => (
                      <Option key={item._id}>{item.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className={s.viewFormVertical}>
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
              </div>
              <div className={s.viewFormVertical}>
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
                  <Input placeholder="Zip Code" />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className={classnames(s.content__viewTop, s.content__viewTop__legalAddress)}>
            <p className={s.title}>Legal Address</p>
            <Checkbox onChange={this.onChangeCheckbox}>Same as Headquarters address</Checkbox>
          </div>
          <div
            className={classnames(s.content__viewBottom, { [s.hidden]: checkLegalSameHeadQuarter })}
          >
            <div className={s.content__viewBottom__row}>
              <p className={s.content__viewBottom__row__textLabel}>Address Line 1*</p>
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
                <Input placeholder="Address Line 1" />
              </Form.Item>
            </div>
            <div className={s.content__viewBottom__row}>
              <p className={s.content__viewBottom__row__textLabel}>Address Line 2</p>
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
                <Input placeholder="Address Line 2" />
              </Form.Item>
            </div>
            <div className={s.content__viewBottom__row}>
              <div className={s.viewFormVertical}>
                <p
                  className={classnames(
                    s.content__viewBottom__row__textLabel,
                    s.content__viewBottom__row__textLabelVertical,
                  )}
                >
                  Country
                </p>
                <Form.Item
                  name="countryLegal"
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
                    onChange={(value) => this.onChangeCountry(value, 'countryLegal')}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {listCountry.map((item) => (
                      <Option key={item._id}>{item.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className={s.viewFormVertical}>
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
              </div>
              <div className={s.viewFormVertical}>
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
                  <Input placeholder="Zip Code" />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
        <div className={s.blockContent} style={{ marginTop: '24px' }}>
          <div className={s.content__viewTop}>
            <p className={s.title}>Contact information</p>
          </div>
          <div className={s.content__viewBottom}>
            {fieldContactInformation.map(
              ({ label, name: nameField, required = false, message, placeholder }) => (
                <div key={nameField} className={s.content__viewBottom__row}>
                  <p className={s.content__viewBottom__row__textLabel}>{label}</p>
                  <Form.Item
                    name={nameField}
                    rules={[
                      {
                        required,
                        message,
                      },
                    ]}
                  >
                    <Input placeholder={placeholder} />
                  </Form.Item>
                </div>
              ),
            )}
          </div>
        </div>
        <div className={s.viewBtn}>
          <Button
            className={s.btnSubmit}
            htmlType="submit"
            loading={companyId ? loadingUpdate : loadingAdd}
            onClick={this.handleClick}
          >
            Save
          </Button>
        </div>
      </Form>
    );
  }
}

export default CompanyDetails;
