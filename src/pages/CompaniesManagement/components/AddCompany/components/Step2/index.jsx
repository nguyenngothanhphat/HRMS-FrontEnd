/* eslint-disable no-console */
/* eslint-disable react/jsx-fragments */
/* eslint-disable react/jsx-curly-newline */
import React, { PureComponent, Fragment } from 'react';
import { Form, Input, Button, Row, Col, Select } from 'antd';
import { formatMessage, connect } from 'umi';
import LocationForm from './components/LocationForm/index';
import styles from './index.less';

const { Option } = Select;
@connect(
  ({
    // signup: { headQuarterAddress = {}, company: { name = '' } = {} } = {},
    companiesManagement: { locations = [] },
    country: { listCountry = [] } = {},
  }) => ({
    // name,
    // headQuarterAddress,
    locations,
    listCountry,
  }),
)
class Step2 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: props.locations.length,
      addressField: '',
      countryField: '',
    };
  }

  componentDidMount() {
    const { locations } = this.props;
    if (locations.length > 0) {
      this.setState({
        currentIndex: locations[locations.length - 1].index + 1,
      });
    }
  }

  navigateStep = (type) => {
    const { dispatch } = this.props;
    let step;
    if (type === 'previous') {
      step = 0;
    }
    if (type === 'next') {
      step = 2;
    }
    if (dispatch) {
      dispatch({
        type: 'signup/save',
        payload: { currentStep: step },
      });
    }
  };

  addLocation = () => {
    const { dispatch, locations } = this.props;
    const { currentIndex } = this.state;
    if (dispatch) {
      dispatch({
        type: 'companiesManagement/save',
        payload: {
          locations: [
            ...locations,
            {
              name: 'companyName',
              address: '',
              country: '',
              state: '',
              zipCode: '',
              isheadQuarter: false,
              index: currentIndex,
            },
          ],
        },
      });
    }
    this.setState({
      currentIndex: currentIndex + 1,
    });
  };

  removeLocation = (index) => {
    const { locations, dispatch } = this.props;
    let newLocations = locations;
    newLocations = newLocations.filter((location) => location.index !== index);
    if (dispatch) {
      dispatch({
        type: 'companiesManagement/save',
        payload: {
          locations: newLocations,
        },
      });
    }
  };

  render() {
    const { dispatch, locations, listCountry } = this.props;
    const { addressField, countryField } = this.state;

    const itemCountry = listCountry.find((item) => item._id === countryField) || {};
    const listStateByItemCountry = itemCountry.states || [];

    const checkDisableBtnNext = !addressField;

    return (
      <div className={styles.root}>
        <Row justify="center">
          <Row gutter={[30, 0]}>
            <Col>
              <div className={styles.root__form}>
                <Form
                  name="addLocation"
                  requiredMark={false}
                  layout="vertical"
                  colon={false}
                  initialValues={{
                    // remember: true,
                    // address: headQuarterAddress.address,
                    // country: headQuarterAddress.country,
                    // state: headQuarterAddress.state,
                    // zipCode: headQuarterAddress.zipCode,
                    // locations: [
                    //   {
                    //     address: 'a1',
                    //     country: '',
                    //     state: '',
                    //     zipCode: 'z1',
                    //   },
                    // ],
                    address: addressField,
                  }}
                  onValuesChange={this.handleFormCompanyChange}
                >
                  <Fragment>
                    <p className={styles.root__form__title}>Work Locations</p>
                    <p className={styles.root__form__description}>
                      We Need To Collect This Information To Assign Your Employees To The Right
                      Office. We Will Allow You To Office Specific Administrators, Filter Employees
                      Per Work Location.
                    </p>
                    <p className={styles.root__form__title}>Headquarter address</p>
                    <Form.Item
                      label="Address*"
                      name="address"
                      rules={[
                        {
                          required: true,
                          message: formatMessage({ id: 'page.signUp.step2.addressError' }),
                        },
                      ]}
                    >
                      <Input onChange={(e) => this.setState({ addressField: e.target.value })} />
                    </Form.Item>
                    <Form.Item
                      label="Country"
                      name="country"
                      rules={[
                        {
                          required: true,
                          message: formatMessage({ id: 'page.signUp.step2.countryError' }),
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select Country"
                        showArrow
                        showSearch
                        onChange={(value) => this.setState({ countryField: value })}
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
                              message: formatMessage({ id: 'page.signUp.step2.stateError' }),
                            },
                          ]}
                        >
                          <Select>
                            {listStateByItemCountry.map((item) => (
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
                              message: formatMessage({ id: 'page.signUp.step2.zipCodeError' }),
                            },
                            {
                              pattern: /^[0-9]{6}$/,
                              message: formatMessage({ id: 'page.signUp.step2.zipCodeError2' }),
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
              {locations.map((location) => {
                const formIndex = location.index;
                return (
                  <LocationForm
                    key={location.index}
                    dispatch={dispatch}
                    formIndex={formIndex}
                    locations={locations}
                    locationItem={location}
                    listCountry={listCountry}
                    removeLocation={this.removeLocation}
                  />
                );
              })}
              <Button className={styles.btn_addLocation} type="link" onClick={this.addLocation}>
                + Add work location
              </Button>

              <div className={styles.btnWrapper}>
                <Button className={styles.btn} onClick={() => this.navigateStep('previous')}>
                  {formatMessage({ id: 'page.signUp.step2.back' })}
                </Button>
                <Button
                  className={styles.btnNext}
                  type="primary"
                  onClick={() => this.navigateStep('next')}
                  disabled={checkDisableBtnNext}
                >
                  {formatMessage({ id: 'page.signUp.step2.next' })}
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

export default Step2;
