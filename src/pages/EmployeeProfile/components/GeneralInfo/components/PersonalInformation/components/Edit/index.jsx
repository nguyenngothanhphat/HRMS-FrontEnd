import React, { PureComponent } from 'react';
import { Row, Col, Input, Form, Select, Button, Spin } from 'antd';
import { connect, formatMessage } from 'umi';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
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
    this.state = { dropdown: false };
  }

  handleDropdown = (open) => {
    this.setState({ dropdown: open });
  };

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

  processDataChanges = () => {
    const { generalData: generalDataTemp } = this.props;
    const {
      personalNumber = '',
      personalEmail = '',
      Blood = '',
      maritalStatus = '',
      linkedIn = '',
      residentAddress = '',
      currentAddress = '',
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

    console.log('payload: ', payload);
    // console.log('dataTempKept: ', dataTempKept);
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
    const { dropdown } = this.state;
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
      residentAddress = '',
      currentAddress = '',
    } = generalData;
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        <Form
          className={styles.Form}
          {...formItemLayout}
          initialValues={{
            personalNumber,
            personalEmail,
            Blood,
            maritalStatus,
            linkedIn,
            residentAddress,
            currentAddress,
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
              onDropdownVisibleChange={this.handleDropdown}
              suffixIcon={
                dropdown ? (
                  <UpOutlined className={styles.arrowUP} />
                ) : (
                  <DownOutlined className={styles.arrowDown} />
                )
              }
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
              onDropdownVisibleChange={this.handleDropdown}
              suffixIcon={
                dropdown ? (
                  <UpOutlined className={styles.arrowUP} />
                ) : (
                  <DownOutlined className={styles.arrowDown} />
                )
              }
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
          <Form.Item label="Residence Address" name="residentAddress">
            <TextArea autoSize={{ minRows: 2, maxRows: 6 }} className={styles.areaForm} />
          </Form.Item>
          <Form.Item label="Address" name="currentAddress">
            <TextArea autoSize={{ minRows: 2, maxRows: 6 }} className={styles.areaForm} />
          </Form.Item>
          <Row gutter={[0, 24]} align="middle">
            <Col span={4} className={styles.address}>
              <Form.Item label="Country" name="country" className={styles.addressSection}>
                <Select
                  className={styles.selectForm}
                  onDropdownVisibleChange={this.handleDropdown}
                  onChange={(value) => {
                    this.handleFieldChange('country', value);
                  }}
                  suffixIcon={
                    dropdown ? (
                      <UpOutlined className={styles.arrowUP} />
                    ) : (
                      <DownOutlined className={styles.arrowDown} />
                    )
                  }
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
              <Form.Item label="State" name="stateCountry" className={styles.addressSection}>
                <Select
                  className={styles.selectForm}
                  onDropdownVisibleChange={this.handleDropdown}
                  suffixIcon={
                    dropdown ? (
                      <UpOutlined className={styles.arrowUP} />
                    ) : (
                      <DownOutlined className={styles.arrowDown} />
                    )
                  }
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
              <Form.Item label="Zip Code" name="zipCode" className={styles.addressSection}>
                <Select
                  className={styles.selectForm}
                  onDropdownVisibleChange={this.handleDropdown}
                  suffixIcon={
                    dropdown ? (
                      <UpOutlined className={styles.arrowUP} />
                    ) : (
                      <DownOutlined className={styles.arrowDown} />
                    )
                  }
                >
                  <Option value="Single">123</Option>
                  <Option value="Married">456</Option>
                  <Option value="Rather not mention">768</Option>
                </Select>
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
