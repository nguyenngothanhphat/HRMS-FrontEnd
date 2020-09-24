import React, { Fragment, PureComponent } from 'react';
import { Row, Input, Form, DatePicker, Select, Button, Col } from 'antd';
import { connect, formatMessage } from 'umi';
import { UpOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import UploadImage from '@/components/UploadImage';
import moment from 'moment';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import styles from './index.less';

@connect(
  ({
    loading,
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
  }),
)
class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      upFile: '',
      dropdown: false,
      listVisa: [
        {
          labelnumber: 'Visa Number',
          nameNumber: 'number',
          labelType: 'Visa Type',
          nameType: 'visaType',
          labelCountry: 'Country',
          nameCountry: 'issuedCountry',
          labelEntryType: 'Entry Type',
          nameEntryType: 'entryType',
          labelIssuedOn: 'Issued On',
          nameIssuedOn: 'issuedOn',
          labelValidTill: 'Valid Till',
          nameValidTill: 'validTill',
        },
      ],
    };
  }

  handleDropdown = (open) => {
    this.setState({ dropdown: open });
  };

  handleAddBtn = () => {
    const { listVisa } = this.state;
    const newObj = listVisa[0];
    console.log([...listVisa, newObj]);
    this.setState({ listVisa: [...listVisa, newObj] });
  };

  handleChange = (changedValues) => {
    console.log(changedValues);
    const { dispatch, passportData, passportDataOrigin, visaData, visaDataOrigin } = this.props;
    const getPassportData = {
      ...passportData,
      ...changedValues,
    };
    const getVisatData = {
      ...visaData,
      ...changedValues,
    };
    const isModified =
      JSON.stringify(getPassportData) !== JSON.stringify(passportDataOrigin) ||
      JSON.stringify(getVisatData) !== JSON.stringify(visaDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { passportData: getPassportData, visaData: getVisatData },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  processDataChanges = () => {
    const { passportData: passportDataTemp } = this.props;
    const {
      number = '',
      issuedCountry = '',
      issuedOn = '',
      validTill = '',
      _id: id = '',
    } = passportDataTemp;
    const payloadChanges = {
      id,
      number,
      issuedCountry,
      issuedOn,
      validTill,
    };
    return payloadChanges;
  };

  processDataChangesVisa = () => {
    const { visaData: visaDataTemp } = this.props;
    const {
      number = '',
      issuedCountry = '',
      issuedOn = '',
      validTill = '',
      _id: id = '',
    } = visaDataTemp;
    const payloadChanges = {
      id,
      number,
      issuedCountry,
      issuedOn,
      validTill,
    };
    return payloadChanges;
  };

  processDataAdd = () => {
    const { passportData: passportDataTemp, generalData } = this.props;
    const { employee = '' } = generalData;
    const { number = '', issuedCountry = '', issuedOn = '', validTill = '' } = passportDataTemp;
    const payloadChanges = {
      number,
      issuedCountry,
      issuedOn,
      validTill,
      employee,
    };
    return payloadChanges;
  };

  processDataAddVisa = () => {
    const { visaData: visaDataTemp, generalData } = this.props;
    const { employee = '' } = generalData;
    const {
      number = '',
      issuedCountry = '',
      issuedOn = '',
      validTill = '',
      entryType = '',
      visaType = '',
    } = visaDataTemp;
    const payloadChanges = {
      number,
      issuedCountry,
      issuedOn,
      validTill,
      entryType,
      visaType,
      employee,
    };
    return payloadChanges;
  };

  processDataKept = () => {
    const { passportData } = this.props;
    const newObj = { ...passportData };
    const listKey = ['number', 'issuedCountry', 'issuedOn', 'validTill'];
    listKey.forEach((item) => delete newObj[item]);
    return newObj;
  };

  processDataKeptVisa = () => {
    const { visaData } = this.props;
    const newObj = { ...visaData };
    const listKey = ['number', 'issuedCountry', 'issuedOn', 'validTill'];
    listKey.forEach((item) => delete newObj[item]);
    return newObj;
  };

  handleSave = () => {
    const { dispatch, passportData = {}, visaData = {} } = this.props;
    const { _id: idPassPort = '' } = passportData;
    const { _id: idVisa = '' } = visaData;
    const payloadAddVisa = this.processDataAddVisa() || {};
    const payloadAddPassPort = this.processDataAdd() || {};
    const payloadUpdateVisa = this.processDataChangesVisa() || {};
    const payloadUpdatePassPort = this.processDataChanges() || {};
    const dataTempKept = this.processDataKept() || {};
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
        dataTempKept,
        key: 'openPassportandVisa',
      });
    }
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
    const { listVisa } = this.state;
    const { passportData, handleCancel = () => {}, loading, countryList } = this.props;
    const formatCountryList = countryList.map((item) => {
      const { _id: value, name } = item;
      return {
        value,
        name,
      };
    });
    const { upFile } = this.state;
    const splitURL = upFile.split('/');
    // const { number, issuedCountry, issuedOn = '', validTill = '', entryType, visaType } = visaData;
    const { number = '', issuedCountry = '', issuedOn = '', validTill = '' } = passportData;
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
    // const formatDateVisaIssuedOn = visaIssuedOn && moment(visaIssuedOn);
    // const formatDateVisaValidTill = visaValidTill && moment(visaValidTill);
    const dateFormat = 'Do MMM YYYY';

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
            // visaNo,
            // visaType,
            // visaCountry,
            // visaEntryType,
            // visaIssuedOn: formatDateVisaIssuedOn,
            // visaValidTill: formatDateVisaValidTill,
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
          {listVisa.map((item, index) => {
            return (
              <Fragment key={`${index + 1}`}>
                <div className={styles.line} />
                <div className={styles.styleUpLoad}>
                  <Form.Item
                    label={item.labelnumber}
                    name={item.nameNumber}
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
                <Form.Item label={item.labelType} name={item.nameType}>
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
                    <Option value="B1">B1</Option>
                    <Option value="nothing">nothing...</Option>
                  </Select>
                </Form.Item>
                <Form.Item label={item.labelCountry} name={item.nameCountry}>
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
                <Form.Item label={item.labelEntryType} name={item.nameEntryType}>
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
                <Form.Item label={item.labelIssuedOn} name={item.nameIssuedOn}>
                  <DatePicker
                    format={dateFormat}
                    onChange={this.handleChangeDate}
                    className={styles.dateForm}
                  />
                </Form.Item>
                <Form.Item label={item.labelValidTill} name={item.nameValidTill}>
                  <DatePicker
                    format={dateFormat}
                    onChange={this.handleChangeDate}
                    className={styles.dateForm}
                  />
                </Form.Item>
              </Fragment>
            );
          })}
          <Col span={9} offset={6}>
            <div onClick={this.handleAddBtn}>
              <PlusOutlined />
              Add more
            </div>
          </Col>
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
