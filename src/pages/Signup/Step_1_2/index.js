import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Row, Col, Radio, Tooltip } from 'antd';
import { isEmail } from '@/utils/utils';
import SignUpInput from '../components/Input';
import SignUpBtn from '../components/Button';
import SignUpSelect from '../components/Select';

import LocationDialog from '../../Reimbursement/ViewReport/components/DialogConfirm';

import styles from './index.less';

const FormItem = Form.Item;

@connect(({ signup, setting, locations, currency: { list = [] } }) => ({
  setting,
  locations,
  list,
  signup,
}))
@Form.create()
class Step0102 extends React.Component {
  state = {
    finishing: false,
    openDialog: false,
    locationCount: 0,
    locationTemp: {},
    locationTempRender: {},
    locationListRender: [],
    locationList: [],
    onSave: false,
    onEdit: false,
    locationIndex: false,
  };

  componentWillReceiveProps(nextProps) {
    const {
      form,
      signup: { validLocation = false },
    } = nextProps;
    const {
      locationTemp = {},
      locationList = [],
      locationTempRender = {},
      locationListRender = [],
      onEdit = false,
      locationIndex = false,
    } = this.state;
    this.setState({
      onSave: false,
    });
    let data = locationList;
    let dataRender = locationListRender;
    if (
      validLocation &&
      // !validAdmin &&
      // !validCompany &&
      Object.keys(locationTemp).length > 0 &&
      Object.keys(locationTempRender).length > 0
    ) {
      if (onEdit) {
        data[locationIndex] = locationTemp;
        dataRender[locationIndex] = locationTempRender;
      } else {
        data = [...data, locationTemp];
        dataRender = [...dataRender, locationTempRender];
      }
      this.setState(
        {
          locationList: data,
          locationCount: data.length,
          locationListRender: dataRender,
          locationTemp: {},
          locationTempRender: {},
          onEdit: false,
        },
        () => {
          form.validateFieldsAndScroll(err => {
            if (!err) {
              this.setState({
                finishing: true,
              });
            }
          });
        }
      );
    }
    // if (validAdmin && validCompany && validLocation) {
    //   console.log('ok');
    // }
  }

  checkEmail = (_rule, value, callback) => {
    let msg;
    try {
      if (value.trim() !== '' && !isEmail(value))
        throw new Error(formatMessage({ id: 'signup.validation.email.required' }));
    } catch ({ message }) {
      msg = message;
    }
    callback(msg);
  };

  checkName = (_rule, value = '', callback) => {
    let msg;
    try {
      if (value.trim() !== '' && value.trim().length < 1)
        throw new Error(formatMessage({ id: 'signup.step_4.locationName.description' }));
    } catch ({ message }) {
      msg = message;
    }
    callback(msg);
  };

  checkCompanyName = (_rule, value = '', callback) => {
    let msg;
    try {
      if (value.trim() !== '' && value.trim().length < 1)
        throw new Error(formatMessage({ id: 'signup.step_03.companyName.description' }));
    } catch ({ message }) {
      msg = message;
    }
    callback(msg);
  };

  checkCurrency = (_rule, value = '', callback) => {
    let msg;
    try {
      if (value.trim() !== '' && value.length < 1)
        throw new Error(formatMessage({ id: 'signup.step_4.currency.description' }));
    } catch ({ message }) {
      msg = message;
    }
    callback(msg);
  };

  checkCountry = (_rule, value = '', callback) => {
    let msg;
    try {
      if (value.trim() !== '' && value.length < 1)
        throw new Error(formatMessage({ id: 'signup.step_4.country.description' }));
    } catch ({ message }) {
      msg = message;
    }
    callback(msg);
  };

  onCheckFinishing = () => {
    const { form } = this.props;
    const { locationCount = 0 } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const { email, firstName, companyName } = values;
      if (!err && email && firstName && companyName && locationCount > 0) {
        this.setState({
          finishing: true,
        });
      } else {
        this.setState({
          finishing: false,
        });
      }
    });
  };

  onSubmit = () => {
    const {
      form,
      setting: { locationLimit = 0 },
      onChangeStep = () => {},
    } = this.props;
    const { locationCount = 0, locationList = [] } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err && locationCount <= locationLimit && locationCount > 0) {
        const { email, firstName, companyName } = values;
        const data = {
          email,
          firstName,
        };
        const dataCompany = {
          name: companyName,
          address: '',
          phone: '',
          companyEmail: '',
          website: '',
        };
        onChangeStep(data, dataCompany, locationList);
      }
    });
  };

  splitData = (data, type) => {
    let n = 0;
    const result = {};
    if (type === 'currency') {
      n = data.indexOf('-');
    } else if (type === 'country') {
      n = data.indexOf('*');
    }
    result.id = data.substr(0, n);
    result.name = data.substr(n + 1, data.length - 1);
    return result;
  };

  onSave = () => {
    const { form, dispatch } = this.props;
    this.setState({
      onSave: true,
    });
    form.validateFieldsAndScroll((err, values) => {
      const { name, currency, country, distanceUnit } = values;
      if (!err || (!err.name && !err.currency && !err.country && !err.distanceUnit)) {
        // if (!err) {
        const data = {
          name,
          currency: this.splitData(currency, 'currency').id,
          country: this.splitData(country, 'country').id,
          distanceUnit,
        };
        const dataRender = {
          ...data,
          curencyName: this.splitData(currency, 'currency').name,
          countryName: this.splitData(country, 'country').name,
        };
        this.setState({
          locationTemp: data,
          locationTempRender: dataRender,
        });
        dispatch({ type: 'signup/validLocation', payload: data });
        // form.resetFields();
        form.setFieldsValue({
          name: '',
          currency: '',
          country: '',
          distanceUnit: 'km',
        });
        this.setState({
          openDialog: false,
        });
      }
    });
  };

  onBack = () => {
    const { onBack = () => {}, email = '' } = this.props;
    onBack(0, email);
  };

  onEdit = (index, data) => {
    const { form } = this.props;
    this.setState({
      onEdit: true,
      openDialog: true,
      locationIndex: index,
    });
    form.setFieldsValue({
      name: data.name || '',
      currency: `${data.currency}-${data.curencyName}` || '',
      country: `${data.country}*${data.countryName}` || '',
      distanceUnit: data.distanceUnit || '',
    });
  };

  onRemove = index => {
    const {
      setting: { locationLimit = 0 },
    } = this.props;
    const { locationListRender = [], locationList = [], locationCount = 0 } = this.state;
    const resultRender = locationListRender.filter((_item, rIndex) => {
      return rIndex !== index;
    });
    const result = locationList.filter((_item, rIndex) => {
      return rIndex !== index;
    });
    this.setState(
      {
        locationListRender: resultRender,
        locationList: result,
        locationCount: locationCount - 1,
      },
      () => {
        if (locationCount - 1 <= 0 || locationCount - 1 > locationLimit) {
          // dispatch({ type: 'signup/resetData' });
          this.setState({
            finishing: false,
          });
        }
      }
    );
  };

  getCurrency = item => {
    const { list } = this.props;
    if (item.currency) {
      const currencySymbol = list.filter(nItem => {
        return nItem._id === item.currency;
      });
      return (currencySymbol[0] && currencySymbol[0].symbol) || '$';
    }
    return '$';
  };

  renderLocationDetail = (item, index) => {
    return (
      <div key={index} className={styles.signup_form_1_2_location_detail}>
        <ul>
          <li>
            <Tooltip title={item.name}>
              <p>{item.name}</p>
            </Tooltip>
          </li>
          <li>
            <Tooltip title={item.countryName}>
              <p style={{ display: 'flex' }}>
                {formatMessage({ id: 'signup.step_1_2.country.title' })}:{'  '}
                <div className={styles.signup_form_1_2_location_countryName}>
                  {item.countryName}
                </div>
              </p>
            </Tooltip>
            <p>
              {formatMessage({ id: 'signup.step_4.currency.title' })}:{' '}
              <b>
                {item.currency}
                {`(${this.getCurrency(item)})`}
              </b>
            </p>
            <p>
              {formatMessage({ id: 'signup.step_4.distance.title' })}: <b>{item.distanceUnit}</b>
            </p>
          </li>
          <li>
            <p
              style={{ color: '#3168F8' }}
              onClick={() => {
                this.onEdit(index, item);
              }}
            >
              {formatMessage({ id: 'signin.edit' })}
            </p>
            <p
              onClick={() => {
                this.onRemove(index);
              }}
              style={{ color: '#FF0000' }}
            >
              {formatMessage({ id: 'signin.remove' })}
            </p>
          </li>
        </ul>
      </div>
    );
  };

  render() {
    const {
      form: { getFieldDecorator },
      email = '',
      firstName = '',
      setting: { locationLimit = 0 },
      locations: { countryList = [] },
      list,
      company = {},
    } = this.props;
    const {
      finishing = false,
      openDialog = false,
      locationCount = 0,
      locationListRender = [],
      onSave = false,
    } = this.state;

    const content = (
      <Row>
        <Col span={24}>
          <FormItem
            label={formatMessage({ id: 'signup.step_4.locationName.title' })}
            className={styles.signup_form_1}
          >
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  validator: this.checkName,
                },
              ],
              initialValue: '',
            })(<SignUpInput size="large" />)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem
            label={formatMessage({ id: 'signup.step_4.currency.title' })}
            className={styles.signup_form_2}
          >
            {getFieldDecorator('currency', {
              rules: [
                {
                  required: true,
                  validator: this.checkCurrency,
                },
              ],
              initialValue: '',
            })(<SignUpSelect style={{ width: '100%' }} data={list} type="currency" />)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem
            label={formatMessage({ id: 'signup.step_1_2.country.title' })}
            className={styles.signup_form_2}
          >
            {getFieldDecorator('country', {
              rules: [
                {
                  required: true,
                  validator: this.checkCountry,
                },
              ],
              initialValue: '',
            })(<SignUpSelect style={{ width: '100%' }} data={countryList} type="country" />)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem
            label={formatMessage({ id: 'signup.step_4.distance.title' })}
            className={styles.signup_form_1}
          >
            {getFieldDecorator('distanceUnit', {
              rules: [
                {
                  required: true,
                },
              ],
              initialValue: 'km',
            })(
              <Radio.Group name="radiogroup">
                <Radio value="km">Km</Radio>
                <Radio value="mile">Mile</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Col>
      </Row>
    );

    return (
      <Row style={{ maxWidth: '500px' }} className={styles.signup_step_2_component}>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <div className={styles.signup_step_2_header}>
                <h1>{formatMessage({ id: 'signup.step_1_2.title' })}</h1>
                <p>{formatMessage({ id: 'signup.step_1_2.description' })}</p>
              </div>
            </Col>
            <Col span={24}>
              <Form onChange={this.onCheckFinishing} onSubmit={this.onSubmit}>
                <Row>
                  <Col span={24}>
                    <FormItem
                      label={formatMessage({ id: 'signup.step_2.wordEmail.title' })}
                      className={styles.signup_form_1}
                    >
                      {getFieldDecorator('email', {
                        rules: [
                          {
                            required: true,
                            validator: this.checkEmail,
                          },
                        ],
                        initialValue: email,
                      })(
                        <SignUpInput
                          size="large"
                          disabled
                          suffix={
                            <span className={styles.link} onClick={this.onBack}>
                              {formatMessage({ id: 'signin.edit' })}
                            </span>
                          }
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label={formatMessage({ id: 'signup.step_2.firstName.title' })}
                      className={styles.signup_form_2}
                    >
                      {getFieldDecorator('firstName', {
                        rules: [
                          {
                            required: true,
                          },
                        ],
                        initialValue: firstName || '',
                      })(<SignUpInput size="large" />)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label={formatMessage({ id: 'signup.step_3.companyName.title' })}
                      className={styles.signup_form_3}
                    >
                      {getFieldDecorator('companyName', {
                        rules: [
                          {
                            // required: true,
                            validator: this.checkCompany,
                          },
                        ],
                        initialValue: company.name || '',
                      })(<SignUpInput size="large" />)}
                    </FormItem>
                  </Col>
                  <Col span={24} className={styles.signup_form_1_2_location}>
                    <div className={styles.signup_form_1_2_ask_company}>
                      {formatMessage({ id: 'signup.step_1_2.askCompany.locationLimit.title' })}
                      &nbsp;
                      {`(${locationCount}/${locationLimit || 0})`}
                      {locationCount < locationLimit ? (
                        <span
                          className={styles.signup_form_1_2_ask_more}
                          onClick={() => {
                            this.setState({
                              openDialog: true,
                            });
                          }}
                        >
                          {formatMessage({ id: 'signup.step_1_2.askMore' })}
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className={styles.signup_form_1_2_ask_more_description}>
                      {formatMessage({ id: 'signup.step_1_2.askMore.description' })}
                    </div>
                    <div className={styles.signup_form_1_2_location_list}>
                      {locationCount > 0 ? (
                        locationListRender.map((item, index) =>
                          this.renderLocationDetail(item, index)
                        )
                      ) : (
                        <p className={styles.signup_form_1_2_no_location}>
                          {formatMessage({ id: 'signup.step_1_2.location.noList' })}
                        </p>
                      )}
                    </div>
                  </Col>
                </Row>
                <FormItem>
                  <SignUpBtn
                    size="large"
                    type="primary"
                    htmlType="submit"
                    disabled={!finishing}
                    onClick={this.onSubmit}
                    title={formatMessage({ id: 'signup.button.continue' })}
                  />
                </FormItem>
                <FormItem>
                  <SignUpBtn
                    size="large"
                    type="primary"
                    btnBack
                    onClick={this.onBack}
                    title={formatMessage({ id: 'signup.button.back' })}
                  />
                </FormItem>
              </Form>
            </Col>
          </Row>
        </Col>
        <LocationDialog
          open={openDialog}
          title={formatMessage({ id: 'signup.dialog.Location.title' })}
          onDialogClose={() => {
            this.setState({
              openDialog: false,
            });
          }}
          isDiabled={onSave}
          onConfirm={this.onSave}
          className={styles.signup_step_1_2_dialog}
          content={content}
          submit={formatMessage({ id: 'employee.report.view.button.save' })}
        />
      </Row>
    );
  }
}

export default Step0102;
