import React, { PureComponent } from 'react';
import { Row, Col, Input, Form, Select, Button, Spin } from 'antd';
import { connect, formatMessage } from 'umi';
import { DownOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeProfile: {
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
      countryList = [],
      listStates = [],
    } = {},
  }) => ({
    loadingGeneral: loading.effects['employeeProfile/updateGeneralInfo'],
    loadingStates: loading.effects['employeeProfile/fetchCountryStates'],
    generalDataOrigin,
    generalData,
    countryList,
    listStates,
  }),
)
class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      residentAddress: {
        address: '',
        country: {
          _id: '',
          name: '',
        },
        state: '',
        zipCode: '',
      },
      currentAddress: {
        address: '',
        country: {
          _id: '',
          name: '',
        },
        state: '',
        zipCode: '',
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
      case 'r_Address':
        this.setState((prevState) => ({
          residentAddress: {
            ...prevState.residentAddress,
            address: value,
          },
        }));
        break;
      case 'r_countryName':
        dispatch({
          type: 'employeeProfile/fetchCountryStates',
          payload: {
            id: value,
          },
        });
        const r_country = this.getCountryObjData(value);

        this.setState((prevState) => ({
          residentAddress: {
            ...prevState.residentAddress,
            country: r_country,
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
      case 'c_Address':
        this.setState((prevState) => ({
          currentAddress: {
            ...prevState.currentAddress,
            address: value,
          },
        }));
        break;
      case 'c_countryName':
        dispatch({
          type: 'employeeProfile/fetchCountryStates',
          payload: {
            id: value,
          },
        });
        const c_country = this.getCountryObjData(value);

        this.setState((prevState) => ({
          currentAddress: {
            ...prevState.currentAddress,
            country: c_country,
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
    const { residentAddress: addressState, currentAddress: _addressState } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 9 },
        sm: { span: 9 },
      },
    };
    const {
      generalData,
      loading,
      handleCancel = () => {},
      countryList,
      listStates,
      loadingStates,
    } = this.props;

    const formatCountryList = countryList.map((item) => {
      const { _id: value, name, states } = item;
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
      residentAddress = {},
      currentAddress = {},
      residentAddress: {
        address: r_Address = '',
        country: { name: r_countryName = '' } = {},
        state: r_state = '',
        zipCode: r_zipCode = '',
      } = {},
      currentAddress: {
        address: c_Address = '',
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
            <Select
              className={styles.selectForm}
              suffixIcon={<DownOutlined className={styles.arrowUP} />}
            >
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
              className={styles.selectForm}
              suffixIcon={<DownOutlined className={styles.arrowUP} />}
            >
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
          <Form.Item label="Residence Address">
            <TextArea
              autoSize={{ minRows: 2, maxRows: 6 }}
              className={styles.areaForm}
              defaultValue={r_Address}
              onChange={(e) => this.handleChangeAddress('r_Address', e.target.value)}
              rules={[
                {
                  required: true,
                  message: 'Please input address',
                },
              ]}
            />
          </Form.Item>
          <Row gutter={[0, 24]} align="middle">
            <Col span={4} className={styles.address}>
              <Form.Item label="Country" className={styles.addressSection}>
                <Select
                  className={styles.selectForm}
                  defaultValue={r_countryName}
                  onChange={(value) => {
                    this.handleChangeAddress('r_countryName', value);
                  }}
                  rules={[
                    {
                      required: true,
                      message: 'Please input address',
                      type: 'array',
                    },
                  ]}
                  suffixIcon={<DownOutlined className={styles.arrowUP} />}
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
            <Col span={4} className={styles.address}>
              <Form.Item label="State" className={styles.addressSection}>
                <Select
                  className={styles.selectForm}
                  defaultValue={r_state}
                  onChange={(e) => this.handleChangeAddress('r_state', e)}
                  suffixIcon={<DownOutlined className={styles.arrowUP} />}
                >
                  {loadingStates ? (
                    <div className={styles.selectForm_loading}>
                      <Spin size="large" />
                    </div>
                  ) : (
                    <>
                      {listStates.map((item, index) => {
                        return (
                          <Option key={index + 1} value={item}>
                            {item}
                          </Option>
                        );
                      })}
                    </>
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4} className={styles.address}>
              <Form.Item label="Zip Code" className={styles.addressSection}>
                <Input
                  className={styles.selectForm}
                  defaultValue={r_zipCode}
                  onChange={(e) => this.handleChangeAddress('r_zipCode', e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Current Address">
            <TextArea
              autoSize={{ minRows: 2, maxRows: 6 }}
              className={styles.areaForm}
              defaultValue={c_Address}
              onChange={(e) => this.handleChangeAddress('c_Address', e.target.value)}
            />
          </Form.Item>
          <Row gutter={[0, 24]} align="middle">
            <Col span={4} className={styles.address}>
              <Form.Item label="Country" className={styles.addressSection}>
                <Select
                  className={styles.selectForm}
                  defaultValue={c_countryName}
                  onChange={(value) => this.handleChangeAddress('c_countryName', value)}
                  suffixIcon={<DownOutlined className={styles.arrowUP} />}
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
            <Col span={4} className={styles.address}>
              <Form.Item label="State" className={styles.addressSection}>
                <Select
                  className={styles.selectForm}
                  defaultValue={c_state}
                  onChange={(value) => this.handleChangeAddress('c_state', value)}
                  suffixIcon={<DownOutlined className={styles.arrowUP} />}
                >
                  {loadingStates ? (
                    <div className={styles.selectForm_loading}>
                      <Spin size="large" />
                    </div>
                  ) : (
                    <>
                      {listStates.map((item, index) => {
                        return (
                          <Option key={index + 1} value={item}>
                            {item}
                          </Option>
                        );
                      })}
                    </>
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4} className={styles.address}>
              <Form.Item label="Zip Code" className={styles.addressSection}>
                <Input
                  className={styles.selectForm}
                  defaultValue={c_zipCode}
                  onChange={(e) => this.handleChangeAddress('c_zipCode', e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
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
        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default Edit;
