/* eslint-disable no-unused-vars */
import React, { Fragment, Component } from 'react';
import { Form, Input, Select, Row, Col, Checkbox, Button } from 'antd';
import { connect } from 'umi';
import s from './index.less';

const { Option } = Select;

@connect(({ country: { listState = [], listCountry = [] } = {}, signup = {} }) => ({
  listState,
  listCountry,
  signup,
}))
class Screen1 extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.formRefLegal = React.createRef();
  }

  componentDidMount() {
    this.removeAutocomplete();
  }

  removeAutocomplete = () => {
    const searchInputs = document.querySelectorAll(`input[type='search']`);

    searchInputs.forEach((element) => element.setAttribute('autocomplete', 'nope'));
  };

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
    const { dispatch, signup } = this.props;
    const { checkLegalSameHeadQuarter = false } = signup;
    dispatch({
      type: 'signup/saveHeadQuarterAddress',
      payload: { ...changedValues },
    });

    if (checkLegalSameHeadQuarter) {
      // Update the same values for legal address
      dispatch({
        type: 'signup/saveLegalAddress',
        payload: { ...changedValues },
      });
      this.formRefLegal.current.setFieldsValue({
        ...changedValues,
      });
    }
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
      !name.trim() ||
      !dba.trim() ||
      !ein.trim() ||
      !addressHead.trim() ||
      !countryHead.trim() ||
      !stateHead.trim() ||
      !zipCodeHead.trim() ||
      !addressLegal.trim() ||
      !country.trim() ||
      !stateLegal.trim() ||
      !zipCodeLegal.trim();

    const listStateHead = this.findListState(countryHead) || [];
    const listStateLegal = this.findListState(country) || [];

    return (
      <div className={s.root}>
        <div className={s.root__form}>
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
            <>
              <p className={s.root__form__title}>Enter company details</p>
              <p className={s.root__form__description}>
                We need to collect some basic information so that we can identify your company and
                contact you easily.
              </p>

              <Form.Item label="Legal Business Name*" name="name">
                <Input />
              </Form.Item>
              <Form.Item label="Doing Business As (DBA)*" name="dba">
                <Input />
              </Form.Item>
              <Form.Item label="EIN*" name="ein">
                <Input />
              </Form.Item>
            </>
          </Form>
        </div>
        <div className={s.root__form} style={{ marginTop: '41px' }}>
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
            <>
              <p className={s.root__form__title}>Headquarter address</p>
              <Form.Item label="Address*" name="address">
                <Input />
              </Form.Item>
              <Form.Item label="Country" name="country">
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
                  <Form.Item label="State" name="state">
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
                  <Form.Item label="Zip Code" name="zipCode">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </>
          </Form>
        </div>
        <div className={s.root__form} style={{ marginTop: '41px' }}>
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
            <>
              <div className={s.viewRow}>
                <p className={s.root__form__title}>Legal address</p>
                <Checkbox
                  onChange={this.onChangeCheckbox}
                  defaultChecked={checkLegalSameHeadQuarter}
                >
                  Same as Headquarters address
                </Checkbox>
              </div>

              <Form.Item label="Address*" name="address">
                <Input disabled={checkLegalSameHeadQuarter} />
              </Form.Item>
              <Form.Item label="Country" name="country">
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
                  <Form.Item label="State" name="state">
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
                  <Form.Item label="Zip Code" name="zipCode">
                    <Input disabled={checkLegalSameHeadQuarter} />
                  </Form.Item>
                </Col>
              </Row>
            </>
          </Form>
        </div>
        <div className={s.root__viewBtnNext}>
          <Button
            className={s.btnNext}
            type="primary"
            onClick={this.handleNext}
            disabled={checkDisableBtnNext}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }
}

export default Screen1;
