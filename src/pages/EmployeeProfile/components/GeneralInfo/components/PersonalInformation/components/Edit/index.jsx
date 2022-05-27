/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Row, Checkbox, Input, Form, Select, Button, Spin } from 'antd';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeProfile: {
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
      countryList = [],
    } = {},
  }) => ({
    loadingGeneral: loading.effects['employeeProfile/updateGeneralInfo'],
    loadingStates: loading.effects['employeeProfile/fetchCountryStates'],
    generalDataOrigin,
    generalData,
    countryList,
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
    const { generalData: generalDataTemp } = this.props;
    const { currentAddress, residentAddress } = this.state;

    const {
      personalNumber = '',
      personalEmail = '',
      Blood = '',
      maritalStatus = '',
      nationality = '',
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
      nationality,
      residentAddress,
      currentAddress,
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
      'nationality',
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
      key: 'openPersonalInfo',
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

  handleSameAddress = (e) => {
    const {
      target: { checked = false },
    } = e;

    const {
      residentAddress: {
        addressLine1: Addressline1 = '',
        addressLine2: Addressline2 = '',
        city: City = '',
        country: { name: countryName = '' } = {},
        state = '',
        zipCode = '',
      } = {},
      residentAddress = {},
    } = this.state;

    let payload = {
      c_Addressline1: Addressline1,
      c_Addressline2: Addressline2,
      c_City: City,
      c_countryName: countryName,
      c_state: state,
      c_zipCode: zipCode,
    };

    if (!checked) {
      payload = {
        c_Addressline1: '',
        c_Addressline2: '',
        c_City: '',
        c_countryName: '',
        c_state: '',
        c_zipCode: '',
      };
    } else {
      this.setState({
        currentAddress: residentAddress,
      });
    }
    this.formRef.current.setFieldsValue(payload);
  };

  render() {
    const { Option } = Select;
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
      nationality = '',
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
      <Row gutter={[0, 24]} className={styles.root}>
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
            nationality,
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
              <Input className={styles.inputForm} placeholder="Enter the Personal Number" />
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
              <Input className={styles.inputForm} placeholder="Enter the Personal Email" />
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
              <Select
                showArrow
                className={styles.selectForm}
                placeholder="Select the Marital Status"
              >
                <Option value="Single">Single</Option>
                <Option value="Married">Married</Option>
                <Option value="Rather not mention">Rather not mention</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Nationality" name="nationality">
              <Input className={styles.inputForm} placeholder="Enter the Nationality" />
            </Form.Item>
            <div className={styles.addressTitle}>Permanent Address</div>
            <Form.Item label="Address Line 1" name="r_Addressline1">
              <Input
                placeholder="Enter the Address Line 1"
                className={styles.inputForm}
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
            <Form.Item label="Address Line 2" name="r_Addressline2">
              <Input
                placeholder="Enter the Address Line 2"
                className={styles.inputForm}
                // eslint-disable-next-line camelcase
                defaultValue={r_Addressline2}
                onChange={(e) => this.handleChangeAddress('r_Addressline2', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="City name" name="r_City">
              <Input
                placeholder="Enter the City"
                // eslint-disable-next-line camelcase
                defaultValue={r_City}
                onChange={(e) => this.handleChangeAddress('r_city', e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Country" name="r_countryName">
              <Select
                className={styles.selectForm}
                // eslint-disable-next-line camelcase
                defaultValue={r_countryName}
                placeholder="Select the Country"
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
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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

            <Form.Item label="State" name="r_state">
              <Select
                showArrow
                className={styles.selectForm}
                // eslint-disable-next-line camelcase
                defaultValue={r_state}
                placeholder="Select the State"
                onChange={(e) => this.handleChangeAddress('r_state', e)}
                showSearch
                loading={loadingStates}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {reListStates.map((item, index) => {
                  return (
                    <Option key={`${index + 1}`} value={item}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item label="Zip/Postal Code" name="r_zipCode">
              <Input
                className={styles.selectForm}
                // eslint-disable-next-line camelcase
                defaultValue={r_zipCode}
                placeholder="Enter the Zip/Postal Code"
                onChange={(e) => this.handleChangeAddress('r_zipCode', e.target.value)}
              />
            </Form.Item>

            {/* ///////////////////////////////////////////////////////// */}
            <div className={styles.addressTitle}>
              Current Address
              <Checkbox onChange={this.handleSameAddress}>Same as above</Checkbox>
            </div>
            <Form.Item label="Address line 1" name="c_Addressline1">
              <Input
                className={styles.inputForm}
                placeholder="Enter the Address Line 1"
                // eslint-disable-next-line camelcase
                defaultValue={c_Addressline1}
                onChange={(e) => this.handleChangeAddress('c_Addressline1', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Address line 2" name="c_Addressline2">
              <Input
                className={styles.inputForm}
                placeholder="Enter the Address Line 2"
                // eslint-disable-next-line camelcase
                defaultValue={c_Addressline2}
                onChange={(e) => this.handleChangeAddress('c_Addressline2', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="City name" name="c_City">
              <Input
                placeholder="Enter the City"
                // eslint-disable-next-line camelcase
                defaultValue={c_City}
                onChange={(e) => this.handleChangeAddress('c_city', e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Country" name="c_countryName">
              <Select
                showArrow
                className={styles.selectForm}
                // eslint-disable-next-line camelcase
                defaultValue={c_countryName}
                onChange={(value) => this.handleChangeAddress('c_countryName', value)}
                placeholder="Select the Country"
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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

            <Form.Item label="State" name="c_state">
              <Select
                showArrow
                className={styles.selectForm}
                // eslint-disable-next-line camelcase
                defaultValue={c_state}
                onChange={(value) => this.handleChangeAddress('c_state', value)}
                placeholder="Select the State"
                showSearch
                loading={loadingStates}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {curListStates.map((item, index) => {
                  return (
                    <Option key={`${index + 1}`} value={item}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item label="Zip/Postal Code" name="c_zipCode">
              <Input
                className={styles.selectForm}
                // eslint-disable-next-line camelcase
                defaultValue={c_zipCode}
                placeholder="Enter the Zip/Postal Code"
                onChange={(e) => this.handleChangeAddress('c_zipCode', e.target.value)}
              />
            </Form.Item>
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
