/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { Form, Input, Select, Button, Checkbox } from 'antd';
import classnames from 'classnames';
import s from './index.less';

const { Option } = Select;

const dummyListCountry = [
  { _id: '12345', name: 'Country 1', states: ['State 1', 'State 2'] },
  { _id: '45678', name: 'Country 2', states: ['State 3', 'State 4'] },
];

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
    const itemCountry = dummyListCountry.find((item) => item._id === idCountry) || {};
    const listState = itemCountry.states || [];
    return listState;
  };

  onChangeCheckbox = ({ target: { checked } = {} }) => {
    if (checked) {
      const {
        headquarterAddress,
        countryHeadquarter,
        stateHeadquarter,
        zipHeadquarter,
      } = this.formRef.current.getFieldsValue();
      this.formRef.current.setFieldsValue({
        legalAddress: headquarterAddress,
        countryLegal: countryHeadquarter,
        stateLegal: stateHeadquarter,
        zipLegal: zipHeadquarter,
      });
    } else {
      this.formRef.current.setFieldsValue({
        legalAddress: undefined,
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
    console.log('Success:', values);
  };

  render() {
    const {
      countryHeadquarter = '',
      countryLegal = '',
      checkLegalSameHeadQuarter = false,
    } = this.state;
    const fieldCompanyDetail = [
      {
        label: 'Legal Business Name*',
        name: 'legalBussinessName',
        required: true,
        message: 'Please enter Legal Business Name!',
      },
      {
        label: 'Doing Business As (DBA)*',
        name: 'DBA',
        required: true,
        message: 'Please enter DBA!',
      },
      { label: 'Employer Identification Number (EIN)', name: 'EIN' },
      { label: 'Compay Website', name: 'companyWebsite' },
    ];

    const listStateHead = this.findListState(countryHeadquarter) || [];
    const listStateLegal = this.findListState(countryLegal) || [];

    return (
      <Form className={s.root} ref={this.formRef} onFinish={this.onFinish}>
        <div className={s.blockContent}>
          <div className={s.content__viewTop}>
            <p className={s.title}>Company Details</p>
          </div>
          <div className={s.content__viewBottom}>
            {fieldCompanyDetail.map(({ label, name, required = false, message }) => (
              <div key={name} className={s.content__viewBottom__row}>
                <p className={s.content__viewBottom__row__textLabel}>{label}</p>
                <Form.Item
                  name={name}
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
              <p className={s.content__viewBottom__row__textLabel}>Address</p>
              <Form.Item
                name="headquarterAddress"
                label={false}
                rules={[
                  {
                    required: true,
                    message: 'Please enter Address!',
                  },
                ]}
              >
                <Input placeholder="Headquarter Address" />
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
                    {dummyListCountry.map((item) => (
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
              <p className={s.content__viewBottom__row__textLabel}>Address</p>
              <Form.Item
                name="legalAddress"
                label={false}
                rules={[
                  {
                    required: true,
                    message: 'Please enter Address!',
                  },
                ]}
              >
                <Input placeholder="Legal Address" />
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
                    {dummyListCountry.map((item) => (
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
        <div className={s.viewBtn}>
          <Button className={s.btnSubmit} htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    );
  }
}

export default CompanyDetails;
