/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Row, Col, Input, Form, Select, Button, Spin } from 'antd';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeProfile: {
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
      countryList = [],
      tenantCurrentEmployee = '',
    } = {},
  }) => ({
    loadingGeneral: loading.effects['employeeProfile/updateGeneralInfo'],
    loadingStates: loading.effects['employeeProfile/fetchCountryStates'],
    generalDataOrigin,
    generalData,
    countryList,
    tenantCurrentEmployee,
  }),
)
class Edit extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      reListStates: [],
      curListStates: [],
      residentAddress: {
        addressLine1: '',
        addressLine2: '',
        country: {
          _id: '',
          name: '',
        },
        state: '',
        zipCode: '',
        city: '',
      },
      currentAddress: {
        addressLine1: '',
        addressLine2: '',
        country: {
          _id: '',
          name: '',
        },
        state: '',
        zipCode: '',
        city: '',
      },
    };
  }

  componentDidMount() {
    const { generalData } = this.props;
    const { residentAddress: residents = {}, currentAddress: current = {} } = generalData;

    this.setState({
      residentAddress: residents,
      currentAddress: current,
    });
  }

  handleChange = (changedValues) => {
    const { dispatch, generalData, generalDataOrigin } = this.props;

    const generalInfo = {
      ...generalData,
      ...changedValues,
    };
    const isModified = JSON.stringify(generalInfo) !== JSON.stringify(generalDataOrigin);

    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { generalData: generalInfo },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  getCountryObjData = (idCountry) => {
    const { countryList } = this.props;
    let _name = '';
    countryList.forEach((item) => {
      const { _id, name } = item;
      if (_id === idCountry) {
        _name = name;
      }
    });

    return {
      _id: idCountry,
      name: _name,
    };
  };

  handleChangeAddress = (name, value) => {
    const { dispatch } = this.props;

    switch (name) {
      case 'r_Addressline1':
        this.setState((prevState) => ({
          residentAddress: {
            ...prevState.residentAddress,
            addressLine1: value,
          },
        }));
        break;
      case 'r_Addressline2':
        this.setState((prevState) => ({
          residentAddress: {
            ...prevState.residentAddress,
            addressLine2: value,
          },
        }));
        break;
      case 'r_city':
        this.setState((prevState) => ({
          residentAddress: {
            ...prevState.residentAddress,
            city: value,
          },
        }));
        break;
      case 'r_countryName':
        dispatch({
          type: 'employeeProfile/fetchCountryStates',
          payload: {
            id: value,
          },
        }).then((data) => {
          this.setState({ reListStates: data });
        });
        // eslint-disable-next-line no-case-declarations
        // const reCountry = this.getCountryObjData(value);

        // this.setState((prevState) => ({
        //   residentAddress: {
        //     ...prevState.residentAddress,
        //     country: reCountry,
        //   },
        // }));
        this.setState((prevState) => ({
          residentAddress: {
            ...prevState.residentAddress,
            country: value,
          },
        }));
        break;
      case 'r_state':
        this.setState((prevState) => ({
          residentAddress: {
            ...prevState.residentAddress,
            state: value,
          },
        }));
        break;
      case 'r_zipCode':
        this.setState((prevState) => ({
          residentAddress: {
            ...prevState.residentAddress,
            zipCode: value,
          },
        }));
        break;
      case 'c_Addressline1':
        this.setState((prevState) => ({
          currentAddress: {
            ...prevState.currentAddress,
            addressLine1: value,
          },
        }));
        break;
      case 'c_Addressline2':
        this.setState((prevState) => ({
          currentAddress: {
            ...prevState.currentAddress,
            addressLine2: value,
          },
        }));
        break;
      case 'c_city':
        this.setState((prevState) => ({
          currentAddress: {
            ...prevState.currentAddress,
            city: value,
          },
        }));
        break;
      case 'c_countryName':
        dispatch({
          type: 'employeeProfile/fetchCountryStates',
          payload: {
            id: value,
          },
        }).then((data) => {
          this.setState({ curListStates: data });
        });

        // eslint-disable-next-line no-case-declarations
        // const curCountry = this.getCountryObjData(value);

        this.setState((prevState) => ({
          currentAddress: {
            ...prevState.currentAddress,
            country: value,
          },
        }));
        break;
      case 'c_state':
        this.setState((prevState) => ({
          currentAddress: {
            ...prevState.currentAddress,
            state: value,
          },
        }));
        break;
      default:
        this.setState((prevState) => ({
          currentAddress: {
            ...prevState.currentAddress,
            zipCode: value,
          },
        }));
        break;
    }
  };

  processDataChanges = () => {
    const { generalData: generalDataTemp, tenantCurrentEmployee = '' } = this.props;
    const { currentAddress, residentAddress } = this.state;

    const {
      personalNumber = '',
      personalEmail = '',
      Blood = '',
      maritalStatus = '',
      linkedIn = '',
      _id: id = '',
    } = generalDataTemp;
    const payloadChanges = {
      id,
      personalNumber,
      personalEmail,
      Blood,
      maritalStatus,
      linkedIn,
      residentAddress,
      currentAddress,
      tenantId: tenantCurrentEmployee,
    };
    return payloadChanges;
  };

  processDataKept = () => {
    const { generalData } = this.props;
    const newObj = { ...generalData };
    const listKey = [
      'personalNumber',
      'personalEmail',
      'Blood',
      'maritalStatus',
      'linkedIn',
      'residentAddress',
      'currentAddress',
    ];
    listKey.forEach((item) => delete newObj[item]);
    return newObj;
  };

  handleSave = () => {
    const { dispatch } = this.props;
    const payload = this.processDataChanges() || {};
    const dataTempKept = this.processDataKept() || {};

    dispatch({
      type: 'employeeProfile/updateGeneralInfo',
      payload,
      dataTempKept,
      key: 'openPersonnalInfor',
    });
  };

  handleFieldChange = (nameField, fieldValue) => {
    const { dispatch } = this.props;
    if (nameField === 'country') {
      dispatch({
        type: 'employeeProfile/fetchCountryStates',
        payload: {
          id: fieldValue,
        },
      });
    }
  };

  render() {
    const { Option } = Select;
    const { TextArea } = Input;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 9 },
        sm: { span: 12 },
      },
    };
    const {
      generalData,
      loading,
      handleCancel = () => {},
      countryList,
      // listStates,
      profileOwner = false,
      loadingStates,
    } = this.props;

    const { reListStates, curListStates } = this.state;

    const formatCountryList = countryList.map((item) => {
      const { _id: value, name } = item;
      return {
        value,
        name,
      };
    });

    const {
      personalNumber = '',
      personalEmail = '',
      Blood = '',
      maritalStatus = '',
      linkedIn = '',
      residentAddress: {
        addressLine1: r_Addressline1 = '',
        addressLine2: r_Addressline2 = '',
        city: r_City = '',
        country: { name: r_countryName = '' } = {},
        state: r_state = '',
        zipCode: r_zipCode = '',
      } = {},
      currentAddress: {
        addressLine1: c_Addressline1 = '',
        addressLine2: c_Addressline2 = '',
        city: c_City = '',
        country: { name: c_countryName = '' } = {},
        state: c_state = '',
        zipCode: c_zipCode = '',
      } = {},
    } = generalData;
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        <Form
          className={styles.Form}
          name="personal_information"
          ref={this.formRef}
          id="myForm"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...formItemLayout}
          initialValues={{
            personalNumber,
            personalEmail,
            Blood,
            maritalStatus,
            linkedIn,
          }}
          onValuesChange={(changedValues) => this.handleChange(changedValues)}
          onFinish={this.handleSave}
        >
          <div className={styles.fieldsContainer}>
            <Form.Item
              label="Personal Number"
              name="personalNumber"
              rules={[
                {
                  pattern: /^[+]*[\d]{0,10}$/,
                  message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
                },
              ]}
            >
              <Input className={styles.inputForm} />
            </Form.Item>
            <Form.Item
              label="Personal Email"
              name="personalEmail"
              rules={[
                {
                  type: 'email',
                  message: formatMessage({ id: 'pages.employeeProfile.validateEmail' }),
                },
              ]}
            >
              <Input className={styles.inputForm} />
            </Form.Item>
            <Form.Item label="Blood Group" name="Blood">
              <Select showArrow className={styles.selectForm}>
                <Option value="O-">O-</Option>
                <Option value="O+">O+</Option>
                <Option value="A-">A-</Option>
                <Option value="A+">A+</Option>
                <Option value="B+">B+</Option>
                <Option value="B-">B-</Option>
                <Option value="AB+">AB+</Option>
                <Option value="AB-">AB-</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Marital Status" name="maritalStatus">
              <Select showArrow className={styles.selectForm}>
                <Option value="Single">Single</Option>
                <Option value="Married">Married</Option>
                <Option value="Rather not mention">Rather not mention</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Linkedin"
              name="linkedIn"
              rules={[
                {
                  type: 'url',
                  message: formatMessage({ id: 'pages.employeeProfile.validatelinkedIn' }),
                },
              ]}
            >
              <Input className={styles.inputForm} />
            </Form.Item>
            <div>Residence Address</div>
            <Form.Item label="Address line 1">
              <TextArea
                autoSize={{ minRows: 2, maxRows: 6 }}
                className={styles.areaForm}
                // eslint-disable-next-line camelcase
                defaultValue={r_Addressline1}
                onChange={(e) => this.handleChangeAddress('r_Addressline1', e.target.value)}
                rules={[
                  {
                    required: true,
                    message: 'Please input address',
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label="Address line 2">
              <TextArea
                autoSize={{ minRows: 2, maxRows: 6 }}
                className={styles.areaForm}
                // eslint-disable-next-line camelcase
                defaultValue={r_Addressline2}
                onChange={(e) => this.handleChangeAddress('r_Addressline2', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="City name">
              <Input
                // eslint-disable-next-line camelcase
                defaultValue={r_City}
                onChange={(e) => this.handleChangeAddress('r_city', e.target.value)}
              />
            </Form.Item>
            <Row gutter={[12, 24]} align="left">
              <Col span={8} className={styles.address}>
                <Form.Item label="Country" className={styles.addressSection}>
                  <Select
                    className={styles.selectForm}
                    // eslint-disable-next-line camelcase
                    defaultValue={r_countryName}
                    onChange={(value) => {
                      this.handleChangeAddress('r_countryName', value);
                    }}
                    rules={[
                      {
                        required: true,
                        message: 'Please choose country',
                        type: 'array',
                      },
                    ]}
                    showArrow
                  >
                    {formatCountryList.map((itemCountry) => {
                      return (
                        <Option key={itemCountry.value} value={itemCountry.value}>
                          {itemCountry.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} className={styles.address}>
                <Form.Item label="State" className={styles.addressSection}>
                  <Select
                    showArrow
                    className={styles.selectForm}
                    // eslint-disable-next-line camelcase
                    defaultValue={r_state}
                    onChange={(e) => this.handleChangeAddress('r_state', e)}
                  >
                    {loadingStates ? (
                      <div className={styles.selectForm_loading}>
                        <Spin size="large" />
                      </div>
                    ) : (
                      <>
                        {reListStates.map((item, index) => {
                          return (
                            <Option key={`${index + 1}`} value={item}>
                              {item}
                            </Option>
                          );
                        })}
                      </>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} className={styles.address}>
                <Form.Item label="Zip/Postal Code" className={styles.addressSection}>
                  <Input
                    className={styles.selectForm}
                    // eslint-disable-next-line camelcase
                    defaultValue={r_zipCode}
                    onChange={(e) => this.handleChangeAddress('r_zipCode', e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* ///////////////////////////////////////////////////////// */}
            <div>Current Address</div>
            <Form.Item label="Address line 1">
              <TextArea
                autoSize={{ minRows: 2, maxRows: 6 }}
                className={styles.areaForm}
                // eslint-disable-next-line camelcase
                defaultValue={c_Addressline1}
                onChange={(e) => this.handleChangeAddress('c_Addressline1', e.target.value)}
                disabled={profileOwner}
              />
            </Form.Item>
            <Form.Item label="Address line 2">
              <TextArea
                autoSize={{ minRows: 2, maxRows: 6 }}
                className={styles.areaForm}
                // eslint-disable-next-line camelcase
                defaultValue={c_Addressline2}
                onChange={(e) => this.handleChangeAddress('c_Addressline2', e.target.value)}
                disabled={profileOwner}
              />
            </Form.Item>
            <Form.Item label="City name">
              <Input
                // eslint-disable-next-line camelcase
                defaultValue={c_City}
                onChange={(e) => this.handleChangeAddress('c_city', e.target.value)}
              />
            </Form.Item>
            <Row gutter={[12, 24]} align="left">
              <Col span={8} className={styles.address}>
                <Form.Item label="Country" className={styles.addressSection}>
                  <Select
                    showArrow
                    className={styles.selectForm}
                    // eslint-disable-next-line camelcase
                    defaultValue={c_countryName}
                    onChange={(value) => this.handleChangeAddress('c_countryName', value)}
                    disabled={profileOwner}
                  >
                    {formatCountryList.map((itemCountry) => {
                      return (
                        <Option key={itemCountry.value} value={itemCountry.value}>
                          {itemCountry.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} className={styles.address}>
                <Form.Item label="State" className={styles.addressSection}>
                  <Select
                    showArrow
                    className={styles.selectForm}
                    // eslint-disable-next-line camelcase
                    defaultValue={c_state}
                    onChange={(value) => this.handleChangeAddress('c_state', value)}
                    disabled={profileOwner}
                  >
                    {loadingStates ? (
                      <div className={styles.selectForm_loading}>
                        <Spin size="large" />
                      </div>
                    ) : (
                      <>
                        {curListStates.map((item, index) => {
                          return (
                            <Option key={`${index + 1}`} value={item}>
                              {item}
                            </Option>
                          );
                        })}
                      </>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} className={styles.address}>
                <Form.Item label="Zip/Postal Code" className={styles.addressSection}>
                  <Input
                    className={styles.selectForm}
                    // eslint-disable-next-line camelcase
                    defaultValue={c_zipCode}
                    onChange={(e) => this.handleChangeAddress('c_zipCode', e.target.value)}
                    disabled={profileOwner}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className={styles.spaceFooter}>
            <div className={styles.cancelFooter} onClick={handleCancel}>
              Cancel
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.buttonFooter}
              loading={loading}
            >
              Save
            </Button>
          </div>
        </Form>
      </Row>
    );
  }
}

export default Edit;
