import React, { PureComponent } from 'react';
import { Row, Input, Form, DatePicker, Select, Button } from 'antd';
import { connect, formatMessage } from 'umi';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import UploadImage from '@/components/UploadImage';
import moment from 'moment';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import VisaGeneral from './components/Visa';
import styles from './index.less';

@connect(
  ({
    loading,
    upload: { passPortURL = '', visa0IDURL = '', visa1IDURL = '', passPortIDURL = '' },
    employeeProfile: {
      countryList,
      originData: { passportData: passportDataOrigin = {}, visaData: visaDataOrigin = {} } = {},
      tempData: { passportData = {}, generalData = {}, visaData = {} } = {},
    } = {},
  }) => ({
    loading: loading.effects['employeeProfile/updatePassPortVisa'],
    countryList,
    passportDataOrigin,
    passportData,
    generalData,
    visaDataOrigin,
    visaData,
    passPortURL,
    visa0IDURL,
    visa1IDURL,
    passPortIDURL,
  }),
)
class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dropdown: false,
    };
  }

  handleDropdown = (open) => {
    this.setState({ dropdown: open });
  };

  handleChange = (name, value) => {
    const { dispatch, passportData, passportDataOrigin } = this.props;
    const newItem = { [name]: value };
    const getPassportData = {
      ...passportData,
      ...newItem,
    };
    const isModified = JSON.stringify(getPassportData) !== JSON.stringify(passportDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { passportData: getPassportData },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  processDataChangesPassPort = () => {
    const { passportData: passportDataTemp } = this.props;
    const {
      passportNumber = '',
      passportIssuedCountry = '',
      passportIssuedOn = '',
      passportValidTill = '',
      _id: id = '',
    } = passportDataTemp;
    const payloadChanges = {
      id,
      passportNumber,
      passportIssuedCountry,
      passportIssuedOn,
      passportValidTill,
    };

    return payloadChanges;
  };

  processDataChangesVisa = () => {
    const { visaData } = this.props;
    if (visaData.length === 2) {
      const formatData = visaData.map((item) => {
        const {
          _id: id,
          visaNumber,
          visaIssuedCountry,
          visaIssuedOn,
          visaType,
          visaValidTill,
          visaEntryType,
        } = item;
        return {
          id,
          visaNumber,
          visaIssuedCountry,
          visaIssuedOn,
          visaType,
          visaValidTill,
          visaEntryType,
        };
      });
      return formatData;
    }
    const data1 = visaData[0];
    const {
      visaNumber = '',
      visaIssuedCountry = '',
      visaIssuedOn = '',
      visaValidTill = '',
      visaEntryType = '',
      visaType = '',
      _id: id = '',
    } = data1;
    const payloadChanges = {
      id,
      visaNumber,
      visaIssuedCountry,
      visaIssuedOn,
      visaValidTill,
      visaEntryType,
      visaType,
    };
    return payloadChanges;
  };

  processDataAddPassPort = () => {
    const { passportData: passportDataTemp, generalData, passPortIDURL = '' } = this.props;
    const { employee = '' } = generalData;
    const {
      passportNumber = '',
      passportIssuedCountry = '',
      passportIssuedOn = '',
      passportValidTill = '',
    } = passportDataTemp;
    const payloadChanges = {
      passportNumber,
      passportIssuedCountry,
      passportIssuedOn,
      passportValidTill,
      document: passPortIDURL,
      employee,
    };
    return payloadChanges;
  };

  processDataAddVisa = () => {
    const { visaData, generalData, visa0IDURL, visa1IDURL } = this.props;
    const { employee = '' } = generalData;
    if (visaData.length === 2) {
      const formatData = visaData.map((item, index) => {
        const {
          visaNumber,
          visaIssuedCountry,
          visaIssuedOn,
          visaType,
          visaValidTill,
          visaEntryType,
        } = item;
        const formVisa1 =
          index === 0
            ? {
                document: visa0IDURL,
                employee,
                visaNumber,
                visaIssuedCountry,
                visaIssuedOn,
                visaType,
                visaValidTill,
                visaEntryType,
              }
            : '';
        const formVisa2 =
          index === 0
            ? {
                document: visa1IDURL,
                employee,
                visaNumber,
                visaIssuedCountry,
                visaIssuedOn,
                visaType,
                visaValidTill,
                visaEntryType,
              }
            : '';
        return [formVisa1, formVisa2];
      });
      return formatData;
    }
    const itemData1 = visaData[0];
    const {
      visaNumber = '',
      visaIssuedCountry = '',
      visaIssuedOn = '',
      visaValidTill = '',
      visaEntryType = '',
      visaType = '',
    } = itemData1;
    const payloadChanges = {
      visaNumber,
      visaIssuedCountry,
      visaIssuedOn,
      visaValidTill,
      visaEntryType,
      visaType,
      document: visa0IDURL,
      employee,
    };
    return payloadChanges;
  };

  processDataKeptPassPort = () => {
    const { passportData } = this.props;
    const newObj = { ...passportData };
    const listKey = [
      'passportNumber',
      'passportIssuedCountry',
      'passportIssuedOn',
      'passportValidTill',
    ];
    listKey.forEach((item) => delete newObj[item]);
    return newObj;
  };

  processDataKeptVisa = () => {
    const { visaData } = this.props;
    const dataKeptVisa = visaData.map((itemdata) => {
      const newobj = { ...itemdata };
      const listKey = [
        'visaNumber',
        'visaIssuedCountry',
        'visaIssuedOn',
        'visaValidTill',
        'visaEntryType',
        'visaType',
      ];
      listKey.forEach((item) => delete newobj[item]);
      return newobj;
    });
    return dataKeptVisa;
  };

  handleSave = () => {
    const { dispatch, passportData = {}, visaData = [] } = this.props;
    const { _id: idPassPort = '' } = passportData;
    const datavisa1 = visaData[0];
    const { _id: idVisa = '' } = datavisa1;
    const payloadAddPassPort = this.processDataAddPassPort() || {};
    const payloadUpdatePassPort = this.processDataChangesPassPort() || {};
    const dataTempKept = this.processDataKeptPassPort() || {};
    const payloadAddVisa = this.processDataAddVisa() || {};
    const payloadUpdateVisa = this.processDataChangesVisa() || {};
    const dataTempKeptVisa = this.processDataKeptVisa() || {};
    if (idPassPort && idVisa) {
      dispatch({
        type: 'employeeProfile/updatePassPort',
        payload: payloadUpdatePassPort,
        dataTempKept,
        key: 'openPassportandVisa',
      });
      dispatch({
        type: 'employeeProfile/updateVisa',
        payload: payloadUpdateVisa,
        dataTempKeptVisa,
        key: 'openPassportandVisa',
      });
    } else {
      dispatch({
        type: 'employeeProfile/addPassPort',
        payload: payloadAddPassPort,
        dataTempKept,
        key: 'openPassportandVisa',
      });
      dispatch({
        type: 'employeeProfile/addVisa',
        payload: payloadAddVisa,
        dataTempKeptVisa,
        key: 'openPassportandVisa',
      });
    }
  };

  handleCanCelIcon = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'upload/cancelUpload',
      payload: { passPortURL: '' },
    });
  };

  render() {
    const { Option } = Select;
    const {
      passportData = {},
      handleCancel = () => {},
      loading,
      countryList,
      visaData = [],
    } = this.props;
    const dataVisa1 = visaData[0] ? visaData[0] : [];
    const formatCountryList = countryList.map((item) => {
      const { _id: value, name } = item;
      return {
        value,
        name,
      };
    });
    const { passPortURL } = this.props;
    const splitURL = passPortURL.split('/');
    const nameDataURL = splitURL[splitURL.length - 1];
    const {
      passportNumber = '',
      passportIssuedCountry,
      passportIssuedOn = '',
      passportValidTill = '',
    } = passportData;
    const {
      visaNumber = '',
      visaIssuedCountry,
      visaIssuedOn = '',
      visaValidTill = '',
      visaEntryType = '',
      visaType = '',
    } = dataVisa1;
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
    const formatDatePassportIssueOn = passportIssuedOn && moment(passportIssuedOn);
    const formatDatePassportValidTill = passportValidTill && moment(passportValidTill);
    const formatDateVisaIssueOn = visaIssuedOn && moment(visaIssuedOn);
    const formatDateVisaValidTill = visaValidTill && moment(visaValidTill);
    const dateFormat = 'Do MMM YYYY';

    return (
      <Row gutter={[0, 16]} className={styles.root}>
        <Form
          className={styles.Form}
          {...formItemLayout}
          initialValues={{
            passportNumber,
            passportIssuedCountry: passportIssuedCountry ? passportIssuedCountry._id : '',
            passportIssuedOn: formatDatePassportIssueOn,
            passportValidTill: formatDatePassportValidTill,
            visaNumber0: visaNumber,
            visaIssuedCountry0: visaIssuedCountry ? visaIssuedCountry._id : '',
            visaIssuedOn0: formatDateVisaIssueOn,
            visaValidTill0: formatDateVisaValidTill,
            visaEntryType0: visaEntryType,
            visaType0: visaType,
          }}
          onFinish={this.handleSave}
        >
          <div className={styles.styleUpLoad}>
            <Form.Item
              label="Passport Number"
              name="passportNumber"
              rules={[
                {
                  pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                  message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
                },
              ]}
            >
              <Input
                className={styles.inputForm}
                onChange={(event) => {
                  const { value: fieldValue } = event.target;
                  this.handleChange('passportNumber', fieldValue);
                }}
              />
            </Form.Item>
            {passPortURL === '' ? (
              <div className={styles.textUpload}>
                <UploadImage content="Choose file" name="passport" />
              </div>
            ) : (
              <div className={styles.viewUpLoadData}>
                <a
                  href={passPortURL}
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
          {passPortURL !== '' ? (
            <Form.Item label="Uploaded file:" className={styles.labelUpload}>
              <a
                href={passPortURL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.urlUpload}
              >
                {nameDataURL}
              </a>
            </Form.Item>
          ) : (
            ''
          )}
          <Form.Item label="Issued Country" name="passportIssuedCountry">
            <Select
              className={styles.selectForm}
              onDropdownVisibleChange={this.handleDropdown}
              onChange={(value) => {
                this.handleChange('passportIssuedCountry', value);
              }}
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
          <Form.Item label="Issued On" name="passportIssuedOn">
            <DatePicker
              format={dateFormat}
              onChange={(dates) => {
                this.handleChange('passportIssuedOn', dates);
              }}
              className={styles.dateForm}
            />
          </Form.Item>
          <Form.Item label="Valid Till" name="passportValidTill">
            <DatePicker
              format={dateFormat}
              onChange={(dates) => {
                this.handleChange('passportValidTill', dates);
              }}
              className={styles.dateForm}
            />
          </Form.Item>
          <VisaGeneral />
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
