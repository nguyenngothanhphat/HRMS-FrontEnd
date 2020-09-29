import React, { Fragment, Component } from 'react';
import { Form, Input, Select, Row, Col, Checkbox, Button } from 'antd';
import { connect } from 'umi';
import s from './index.less';

const { Option } = Select;

@connect(({ loading, country: { listState = [], listCountry = [] } = {}, signup = {} }) => ({
  loadingGetState: loading.effects['country/fetchListState'],
  listState,
  listCountry,
  signup,
}))
class Screen1 extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.formRefLegal = React.createRef();
    this.state = {
      countryHeadquarter: '',
      countryLegal: '',
      checkSame: false,
    };
  }

  onChangeCountryHeadquarter = (value) => {
    // const { dispatch } = this.props;
    this.setState({ countryHeadquarter: value });
    this.formRef.current.setFieldsValue({
      state: undefined,
    });
    // const payload = { country: value };
    // dispatch({
    //   type: 'country/fetchListState',
    //   payload,
    // });
  };

  onChangeSelectLegal = (value) => {
    // const { dispatch } = this.props;
    this.setState({ countryLegal: value });
    this.formRefLegal.current.setFieldsValue({
      state: undefined,
    });
    // const payload = { country: value };
    // dispatch({
    //   type: 'country/fetchListState',
    //   payload,
    // });
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
    this.setState({
      checkSame: e.target.checked,
    });
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

  render() {
    const { listCountry = [], loadingGetState, signup = {} } = this.props;
    const { countryHeadquarter = '', countryLegal = '', checkSame } = this.state;
    const dummyState = [
      { _id: 'HoChiMinh', name: 'TP. Ho Chi Minh' },
      { _id: 'HaNoi', name: 'TP. Ha Noi' },
      { _id: 'DaNang', name: 'TP. Da Nang' },
    ];
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
    } = signup;
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
            <Fragment>
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
            </Fragment>
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
            <Fragment>
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
                      loading={loadingGetState}
                      showSearch
                      disabled={!countryHeadquarter}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {dummyState.map((item) => (
                        <Option key={item._id}>{item.name}</Option>
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
            </Fragment>
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
            <Fragment>
              <div className={s.viewRow}>
                <p className={s.root__form__title}>Legal address</p>
                <Checkbox onChange={this.onChangeCheckbox}>Same as Headquarters address</Checkbox>
              </div>

              <Form.Item label="Address*" name="address">
                <Input disabled={checkSame} />
              </Form.Item>
              <Form.Item label="Country" name="country">
                <Select
                  placeholder="Select Country"
                  showArrow
                  showSearch
                  onChange={this.onChangeSelectLegal}
                  disabled={checkSame}
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
                      loading={loadingGetState}
                      showSearch
                      disabled={checkSame || !countryLegal}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {dummyState.map((item) => (
                        <Option key={item._id}>{item.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Zip Code" name="zipCode">
                    <Input disabled={checkSame} />
                  </Form.Item>
                </Col>
              </Row>
            </Fragment>
          </Form>
        </div>
        <div className={s.root__viewBtnNext}>
          <Button className={s.btnNext} type="primary" onClick={this.handleNext}>
            Next
          </Button>
        </div>
      </div>
    );
  }
}

export default Screen1;
