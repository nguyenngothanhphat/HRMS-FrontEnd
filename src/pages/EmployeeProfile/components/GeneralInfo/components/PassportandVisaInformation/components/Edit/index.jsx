import React, { PureComponent } from 'react';
import { Row, Input, Form, DatePicker, Select, Button } from 'antd';
import { connect, formatMessage } from 'umi';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import UploadImage from '@/components/UploadImage';
import moment from 'moment';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeProfile: {
      countryList,
      originData: { passportvisaData: passportvisaDataOrigin = {} } = {},
      tempData: { passportvisaData = {}, generalData = {} } = {},
    } = {},
  }) => ({
    loading: loading.effects['employeeProfile/updatePassPortVisa'],
    countryList,
    passportvisaDataOrigin,
    passportvisaData,
    generalData,
  }),
)
class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { upFile: '', dropdown: false };
  }

  handleDropdown = (open) => {
    this.setState({ dropdown: open });
  };

  handleChange = (changedValues) => {
    const { dispatch, passportvisaData, passportvisaDataOrigin } = this.props;
    const getPassportVisaData = {
      ...passportvisaData,
      ...changedValues,
    };
    const isModified =
      JSON.stringify(getPassportVisaData) !== JSON.stringify(passportvisaDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { passportvisaData: getPassportVisaData },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  processDataChanges = () => {
    const { passportvisaData: passportvisaDataTemp } = this.props;
    const {
      number = '',
      issuedCountry = '',
      issuedOn = '',
      validTill = '',
      // visaNo = '',
      // visaType = '',
      // visaCountry = '',
      // visaEntryType = '',
      // visaIssuedOn = '',
      // visaValidTill = '',
      _id: id = '',
    } = passportvisaDataTemp;
    const payloadChanges = {
      id,
      number,
      issuedCountry,
      issuedOn,
      validTill,
      // visaNo,
      // visaType,
      // visaCountry,
      // visaEntryType,
      // visaIssuedOn,
      // visaValidTill,
    };
    return payloadChanges;
  };

  processDataAdd = () => {
    const { passportvisaData: passportvisaDataTemp, generalData } = this.props;
    const { employee = '' } = generalData;
    const {
      number = '',
      issuedCountry = '',
      issuedOn = '',
      validTill = '',
      // visaNo = '',
      // visaType = '',
      // visaCountry = '',
      // visaEntryType = '',
      // visaIssuedOn = '',
      // visaValidTill = '',
    } = passportvisaDataTemp;
    const payloadChanges = {
      number,
      issuedCountry,
      issuedOn,
      validTill,
      // visaNo,
      // visaType,
      // visaCountry,
      // visaEntryType,
      // visaIssuedOn,
      // visaValidTill,
      employee,
    };
    return payloadChanges;
  };

  processDataKept = () => {
    const { passportvisaData } = this.props;
    const newObj = { ...passportvisaData };
    const listKey = [
      'number',
      'issuedCountry',
      'issuedOn',
      'validTill',
      // 'visaNo',
      // 'visaType',
      // 'visaCountry',
      // 'visaEntryType',
      // 'visaIssuedOn',
      // 'visaValidTill',
    ];
    listKey.forEach((item) => delete newObj[item]);
    return newObj;
  };

  handleSave = () => {
    const { dispatch, passportvisaData = {} } = this.props;
    const { _id = '' } = passportvisaData;
    const payloadAdd = this.processDataAdd() || {};
    const payloadUpdate = this.processDataChanges() || {};
    const dataTempKept = this.processDataKept() || {};
    if (_id) {
      return dispatch({
        type: 'employeeProfile/updatePassPortVisa',
        payload: payloadUpdate,
        dataTempKept,
        key: 'openPassportandVisa',
      });
    }
    return dispatch({
      type: 'employeeProfile/addPassPortVisa',
      payload: payloadAdd,
      dataTempKept,
      key: 'openPassportandVisa',
    });
  };

  handleUpLoadFile = (resp) => {
    const { statusCode, data = [] } = resp;
    if (statusCode === 200) {
      const [first] = data;
      this.setState({ upFile: first.url });
    }
  };

  handleCanCelIcon = () => {
    const { dispatch } = this.props;
    this.setState({ upFile: '' });
    dispatch({
      type: 'upload/uploadFile',
    });
  };

  render() {
    const { Option } = Select;
    const { passportvisaData, handleCancel = () => {}, loading, countryList } = this.props;
    const formatCountryList = countryList.map((item) => {
      const { _id: value, name } = item;
      return {
        value,
        name,
      };
    });
    const { upFile } = this.state;
    const splitURL = upFile.split('/');
    const {
      number = '',
      issuedCountry = '',
      issuedOn = '',
      validTill = '',
      visaNo = '',
      visaType = '',
      visaCountry = '',
      visaEntryType = '',
      visaIssuedOn = '',
      visaValidTill = '',
    } = passportvisaData;
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
    const formatDatePassportIssueOn = issuedOn && moment(issuedOn);
    const formatDatePassportValidTill = validTill && moment(validTill);
    const formatDateVisaIssuedOn = visaIssuedOn && moment(visaIssuedOn);
    const formatDateVisaValidTill = visaValidTill && moment(visaValidTill);
    const dateFormat = 'Do MMM YYYY';
    // const listVisa = [
    //   {
    //     labelnumber: 'Visa Number',
    //     nameNumber: 'visaNo',
    //     labelType: 'Visa Type',
    //     nameType: 'visaType',
    //     labelCountry: 'Country',
    //     nameCountry: 'visaCountry',
    //     labelEntryType: 'Entry Type',
    //     nameEntryType: 'visaEntryType',
    //     labelIssuedOn: 'Issued On',
    //     nameIssuedOn: 'visaIssuedOn',
    //     labelValidTill: 'Valid Till',
    //     nameValidTill: 'visaValidTill',
    //   },
    // ];
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        <Form
          className={styles.Form}
          {...formItemLayout}
          initialValues={{
            number,
            issuedCountry: issuedCountry._id,
            issuedOn: formatDatePassportIssueOn,
            validTill: formatDatePassportValidTill,
            visaNo,
            visaType,
            visaCountry,
            visaEntryType,
            visaIssuedOn: formatDateVisaIssuedOn,
            visaValidTill: formatDateVisaValidTill,
          }}
          onValuesChange={(changedValues) => this.handleChange(changedValues)}
          onFinish={this.handleSave}
        >
          <div className={styles.styleUpLoad}>
            <Form.Item
              label="Passport Number"
              name="number"
              rules={[
                {
                  pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                  message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
                },
              ]}
            >
              <Input className={styles.inputForm} />
            </Form.Item>
            {upFile === '' ? (
              <div className={styles.textUpload}>
                <UploadImage content="Choose file" getResponse={this.handleUpLoadFile} />
              </div>
            ) : (
              <div className={styles.viewUpLoadData}>
                <a
                  href={upFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewUpLoadDataURL}
                >
                  fileName
                </a>
                <p className={styles.viewUpLoadDataText}>Uploaded</p>
                <img
                  src={cancelIcon}
                  alt=""
                  onClick={this.handleCanCelIcon}
                  className={styles.viewUpLoadDataIconCancel}
                />
              </div>
            )}
          </div>
          {upFile !== '' ? (
            <Form.Item label="Uploaded file:" className={styles.labelUpload}>
              <a
                href={upFile}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.urlUpload}
              >
                {splitURL[6]}
              </a>
            </Form.Item>
          ) : (
            ''
          )}
          <Form.Item label="Issued Country" name="issuedCountry">
            <Select
              allowClear
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
              {formatCountryList.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="Issued On" name="issuedOn">
            <DatePicker
              format={dateFormat}
              onChange={this.handleChangeDate}
              className={styles.dateForm}
            />
          </Form.Item>
          <Form.Item label="Valid Till" name="validTill">
            <DatePicker
              format={dateFormat}
              onChange={this.handleChangeDate}
              className={styles.dateForm}
            />
          </Form.Item>

          <div className={styles.line} />
          {/* {listVisa.map((item,index))} */}
          <div className={styles.styleUpLoad}>
            <Form.Item
              label="Visa Number"
              name="visaNo"
              rules={[
                {
                  pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                  message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
                },
              ]}
            >
              <Input className={styles.inputForm} />
            </Form.Item>
            {upFile === '' ? (
              <div className={styles.textUpload}>
                <UploadImage content="Choose file" getResponse={this.handleUpLoadFile} />
              </div>
            ) : (
              <div className={styles.viewUpLoadData}>
                <a
                  href={upFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewUpLoadDataURL}
                >
                  fileName
                </a>
                <p className={styles.viewUpLoadDataText}>Uploaded</p>
                <img
                  src={cancelIcon}
                  alt=""
                  onClick={this.handleCanCelIcon}
                  className={styles.viewUpLoadDataIconCancel}
                />
              </div>
            )}
          </div>
          {upFile !== '' ? (
            <Form.Item label="Visa:" className={styles.labelUpload}>
              <a
                href={upFile}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.urlUpload}
              >
                {splitURL[6]}
              </a>
            </Form.Item>
          ) : (
            ''
          )}
          <Form.Item label="Visa Type" name="visaType">
            <Select
              allowClear
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
              <Option value="India">B1</Option>
              <Option value="nothing">nothing...</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Country" name="visaCountry">
            <Select
              allowClear
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
              <Option value="India">India</Option>
              <Option value="USA">USA</Option>
              <Option value="VietNam">Viet Nam</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Entry Type" name="visaEntryType">
            <Select
              allowClear
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
              <Option value="India">Single Entry</Option>
              <Option value="nothing">nothing....</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Issued On" name="visaIssuedOn">
            <DatePicker
              format={dateFormat}
              onChange={this.handleChangeDate}
              className={styles.dateForm}
            />
          </Form.Item>
          <Form.Item label="Valid Till" name="visaValidTill">
            <DatePicker
              format={dateFormat}
              onChange={this.handleChangeDate}
              className={styles.dateForm}
            />
          </Form.Item>
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
