/* eslint-disable react/jsx-fragments */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-unused-vars */
import React, { Fragment, Component } from 'react';
import { Form, Input, Select, Row, Col, Checkbox, Button } from 'antd';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

const { Option } = Select;

@connect(({ country: { listState = [], listCountry = [] } = {}, signup = {} }) => ({
  listState,
  listCountry,
  signup,
}))
class Step1 extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.formRefLegal = React.createRef();
  }

  onChangeCountryHeadquarter = (value) => {
    const { dispatch } = this.props;
    this.formRef.current.setFieldsValue({
      state: undefined,
    });
    dispatch({
      type: 'signup/saveHeadQuarterAddress',
      payload: { state: '' },
    });
  };

  onChangeSelectLegal = (value) => {
    const { dispatch } = this.props;
    this.formRefLegal.current.setFieldsValue({
      state: undefined,
    });
    dispatch({
      type: 'signup/saveLegalAddress',
      payload: { state: '' },
    });
  };

  handleFormCompanyChange = (changedValues) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'signup/saveCompany',
      payload: { ...changedValues },
    });
  };

  handleFormHeadquarter = (changedValues) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'signup/saveHeadQuarterAddress',
      payload: { ...changedValues },
    });
  };

  handleFormLegal = (changedValues) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'signup/saveLegalAddress',
      payload: { ...changedValues },
    });
  };

  onChangeCheckbox = (e) => {
    const { dispatch, signup: { headQuarterAddress = {} } = {} } = this.props;
    dispatch({
      type: 'signup/save',
      payload: {
        checkLegalSameHeadQuarter: e.target.checked,
      },
    });
    if (e.target.checked) {
      dispatch({
        type: 'signup/saveLegalAddress',
        payload: { ...headQuarterAddress },
      });
      this.formRefLegal.current.setFieldsValue({
        ...headQuarterAddress,
      });
    }
  };

  handleNext = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'signup/save',
      payload: {
        currentStep: 1,
      },
    });
  };

  findListState = (idCountry) => {
    const { listCountry = [] } = this.props;
    const itemCountry = listCountry.find((item) => item._id === idCountry) || {};
    const listState = itemCountry.states || [];
    return listState;
  };

  render() {
    const { listCountry = [], signup = {} } = this.props;
    const {
      company: { name = '', dba = '', ein = '' } = {},
      headQuarterAddress: {
        address: addressHead = '',
        country: countryHead = '',
        state: stateHead = '',
        zipCode: zipCodeHead = '',
      } = {},
      legalAddress: {
        address: addressLegal = '',
        country = '',
        state: stateLegal = '',
        zipCode: zipCodeLegal = '',
      } = {},
      checkLegalSameHeadQuarter = false,
    } = signup;

    const checkDisableBtnNext =
      !name ||
      !dba ||
      !ein ||
      !addressHead ||
      !countryHead ||
      !stateHead ||
      !zipCodeHead ||
      !addressLegal ||
      !country ||
      !stateLegal ||
      !zipCodeLegal;

    const listStateHead = this.findListState(countryHead) || [];
    const listStateLegal = this.findListState(country) || [];

    return (
      <div className={styles.root}>
        <Row justify="center">
          <Row gutter={[30, 0]}>
            <Col>
              <div className={styles.root__form}>
                <Form
                  name="formCompany"
                  requiredMark={false}
                  layout="vertical"
                  colon={false}
                  initialValues={{
                    name,
                    dba,
                    ein,
                  }}
                  onValuesChange={this.handleFormCompanyChange}
                >
                  <Fragment>
                    <p className={styles.root__form__title}>Enter company details</p>
                    <p className={styles.root__form__description}>
                      We need to collect some basic information so that we can identify your company
                      and contact you easily.
                    </p>

                    <Form.Item
                      label="Legal Business Name*"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: formatMessage({ id: 'page.signUp.step1.lbnError' }),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Doing Business As (DBA)*"
                      name="dba"
                      rules={[
                        {
                          required: true,
                          message: formatMessage({ id: 'page.signUp.step1.dbaError' }),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="EIN*"
                      name="ein"
                      rules={[
                        {
                          required: true,
                          message: formatMessage({ id: 'page.signUp.step1.einError' }),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Fragment>
                </Form>
              </div>
              <div className={styles.root__form} style={{ marginTop: '41px' }}>
                <Form
                  name="formHeadQuarter"
                  requiredMark={false}
                  layout="vertical"
                  colon={false}
                  ref={this.formRef}
                  initialValues={{
                    address: addressHead,
                    country: countryHead,
                    state: stateHead,
                    zipCode: zipCodeHead,
                  }}
                  onValuesChange={this.handleFormHeadquarter}
                >
                  <Fragment>
                    <p className={styles.root__form__title}>Headquarter address</p>
                    <Form.Item
                      label="Address*"
                      name="address"
                      rules={[
                        {
                          required: true,
                          message: formatMessage({ id: 'page.signUp.step1.addressError' }),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Country"
                      name="country"
                      rules={[
                        {
                          required: true,
                          message: formatMessage({ id: 'page.signUp.step1.countryError' }),
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select Country"
                        showArrow
                        showSearch
                        onChange={this.onChangeCountryHeadquarter}
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {listCountry.map((item) => (
                          <Option key={item._id}>{item.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <Form.Item
                          label="State"
                          name="state"
                          rules={[
                            {
                              required: true,
                              message: formatMessage({ id: 'page.signUp.step1.stateError' }),
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select State"
                            showArrow
                            showSearch
                            disabled={!countryHead}
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
                      <Col span={12}>
                        <Form.Item
                          label="Zip/Postal Code"
                          name="zipCode"
                          rules={[
                            {
                              required: true,
                              message: formatMessage({ id: 'page.signUp.step1.zipCodeError' }),
                            },
                            {
                              pattern: /^[0-9]{6}$/,
                              message: formatMessage({ id: 'page.signUp.step1.zipCodeError2' }),
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Fragment>
                </Form>
              </div>
              <div className={styles.root__form} style={{ marginTop: '41px' }}>
                <Form
                  name="formLegalAddress"
                  requiredMark={false}
                  layout="vertical"
                  colon={false}
                  ref={this.formRefLegal}
                  initialValues={{
                    address: addressLegal,
                    country,
                    state: stateLegal,
                    zipCode: zipCodeLegal,
                  }}
                  onValuesChange={this.handleFormLegal}
                >
                  <Fragment>
                    <div className={styles.viewRow}>
                      <p className={styles.root__form__title}>Legal address</p>
                      <Checkbox
                        onChange={this.onChangeCheckbox}
                        defaultChecked={checkLegalSameHeadQuarter}
                      >
                        Same as Headquarters address
                      </Checkbox>
                    </div>

                    <Form.Item
                      label="Address*"
                      name="address"
                      rules={[
                        {
                          required: true,
                          message: formatMessage({ id: 'page.signUp.step1.addressError' }),
                        },
                      ]}
                    >
                      <Input disabled={checkLegalSameHeadQuarter} />
                    </Form.Item>
                    <Form.Item
                      label="Country"
                      name="country"
                      rules={[
                        {
                          required: true,
                          message: formatMessage({ id: 'page.signUp.step1.countryError' }),
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select Country"
                        showArrow
                        showSearch
                        onChange={this.onChangeSelectLegal}
                        disabled={checkLegalSameHeadQuarter}
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {listCountry.map((item) => (
                          <Option key={item._id}>{item.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <Form.Item
                          label="State"
                          name="state"
                          rules={[
                            {
                              required: true,
                              message: formatMessage({ id: 'page.signUp.step1.stateError' }),
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select State"
                            showArrow
                            showSearch
                            disabled={checkLegalSameHeadQuarter || !country}
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
                      <Col span={12}>
                        <Form.Item
                          label="Zip/Postal Code"
                          name="zipCode"
                          rules={[
                            {
                              required: true,
                              message: formatMessage({ id: 'page.signUp.step1.zipCodeError' }),
                            },
                            {
                              pattern: /^[0-9]{6}$/,
                              message: formatMessage({ id: 'page.signUp.step1.zipCodeError2' }),
                            },
                          ]}
                        >
                          <Input disabled={checkLegalSameHeadQuarter} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Fragment>
                </Form>
              </div>
              <div className={styles.root__viewBtnNext}>
                <Button
                  className={styles.btnNext}
                  type="primary"
                  onClick={this.handleNext}
                  disabled={checkDisableBtnNext}
                >
                  Next
                </Button>
              </div>
            </Col>
            <Col>
              <div className={styles.root__form__image}>
                <img src="/assets/images/Intranet_01@3x.png" alt="image_intranet" />
              </div>
            </Col>
          </Row>
        </Row>
      </div>
    );
  }
}

export default Step1;
