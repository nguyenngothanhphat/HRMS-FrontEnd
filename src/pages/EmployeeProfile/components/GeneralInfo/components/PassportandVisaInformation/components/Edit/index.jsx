import React, { Component } from 'react';
import { Row, Input, Form, DatePicker, Select, Button, Spin, Col } from 'antd';
import { connect, formatMessage } from 'umi';
import { UpOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import ModalReviewImage from '@/components/ModalReviewImage';
import moment from 'moment';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import removeIcon from './assets/removeIcon.svg';
import UploadImage from '../UploadImage';
import VisaGeneral from './components/Visa';
import styles from './index.less';

@connect(
  ({
    loading,
    upload: {
      passPortURL = '',
      visa0IDURL = '',
      visa1IDURL = '',
      passPortIDURL = '',
      loadingPassPort = false,
    },
    employeeProfile: {
      countryList,
      idCurrentEmployee,
      originData: { passportData: passportDataOrigin = {}, visaData: visaDataOrigin = [] } = {},
      tempData: { passportData = {}, generalData = {}, visaData = [], document = {} } = {},
    } = {},
  }) => ({
    loading: loading.effects['upload/uploadFile'],
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
    document,
    idCurrentEmployee,
    loadingPassPort,
  }),
)
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdown: false,
      isLt5M: true,
      getContent: true,
      isDate: true,
      isCheckDateVisa: true,
      visible: false,
      linkImage: '',
      passportArr: [],
    };
  }

  componentDidMount() {
    const { passportData = {} } = this.props;
    const {
      // urlFile = '',
      passportNumber: _passportNumber = '',
      passportIssuedCountry: _passportIssuedCountry,
      passportIssuedOn = '',
      passportValidTill = '',
    } = passportData;
    const formatDatePassportIssueOn = passportIssuedOn && moment(passportIssuedOn);
    const formatDatePassportValidTill = passportValidTill && moment(passportValidTill);
    const newArr = [];

    const newPassportData = {
      passportNumber: _passportNumber,
      passportIssuedCountry: _passportIssuedCountry,
      passportIssuedOn: formatDatePassportIssueOn,
      passportValidTill: formatDatePassportValidTill,
    };

    newArr.push(newPassportData);
    this.setState({ passportArr: newArr });
  }

  handleDropdown = (open) => {
    this.setState({ dropdown: open });
  };

  validateDate = (getPassportData) => {
    if (getPassportData === {}) return;
    const { passportDataOrigin } = this.props;
    const formatDatePassportIssueOn =
      passportDataOrigin.passportIssuedOn && moment(passportDataOrigin.passportIssuedOn);
    const DatePassportIssueOn =
      getPassportData.passportIssuedOn && moment(getPassportData.passportIssuedOn);
    const formatDatePassportValidTill =
      passportDataOrigin.passportValidTill && moment(passportDataOrigin.passportValidTill);
    const DatePassportValidTill =
      getPassportData.passportValidTill && moment(getPassportData.passportValidTill);
    const IssuedOn = DatePassportIssueOn || formatDatePassportIssueOn;
    const ValidTill = DatePassportValidTill || formatDatePassportValidTill;
    if (IssuedOn > ValidTill) {
      this.setState({ isDate: false });
    } else {
      this.setState({ isDate: true });
    }
  };

  handleChange = (name, value) => {
    const { dispatch, passportData, passportDataOrigin } = this.props;
    const newItem = { [name]: value };

    const getPassportData = {
      ...passportData,
      ...newItem,
    };
    this.validateDate(getPassportData);
    const isModified = JSON.stringify(getPassportData) !== JSON.stringify(passportDataOrigin);

    console.log('passportData: ', passportData);
    console.log('newItem: ', newItem);
    console.log('getPassportData: ', getPassportData);

    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { passportData: getPassportData },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  handleGetUpLoad = (resp) => {
    const { data = [] } = resp;
    const [first] = data;
    const value = { id: first ? first.id : '', url: first ? first.url : '' };
    this.handleChange('urlFile', value);
  };

  handleAddPassPortAllField = () => {
    const { dispatch, idCurrentEmployee, passportData } = this.props;
    const { document: documentPassPort, urlFile } = passportData;
    let getFile = '';
    if (urlFile) {
      getFile = urlFile;
    }
    if (documentPassPort) {
      const dataPassport = { id: documentPassPort._id, attachment: getFile.id };
      dispatch({
        type: 'employeeProfile/fetchDocumentUpdate',
        payload: dataPassport,
      });
    } else {
      dispatch({
        type: 'employeeProfile/fetchDocumentAdd',
        payload: {
          key: 'PassPort',
          attachment: getFile.id,
          employeeGroup: 'Identity',
          parentEmployeeGroup: 'Indentification Documents',
          employee: idCurrentEmployee,
        },
      }).then((id) => this.handleAddPassPort(id));
    }
  };

  handleAddPassPort = (id) => {
    const { dispatch } = this.props;
    const dataTempKept = this.processDataKeptPassPort() || {};
    const payloadAddPassPort = this.processDataAddPassPort(id) || {};
    dispatch({
      type: 'employeeProfile/addPassPort',
      payload: payloadAddPassPort,
      dataTempKept,
      key: 'openPassportandVisa',
    });
  };

  processDataChangesPassPort = () => {
    const { passportData: passportDataTemp } = this.props;
    const {
      urlFile = '',
      document = '',
      passportNumber = '',
      passportIssuedCountry = '',
      passportIssuedOn = '',
      passportValidTill = '',
      _id: id = '',
    } = passportDataTemp;
    const payloadChanges = {
      id,
      document: document ? document._id : urlFile.id,
      passportNumber,
      passportIssuedCountry,
      passportIssuedOn,
      passportValidTill,
    };

    return payloadChanges;
  };

  processDataChangesVisa = (item) => {
    const { generalData } = this.props;
    const { employee = '' } = generalData;
    const {
      _id: id,
      document,
      visaNumber,
      visaIssuedCountry,
      visaIssuedOn,
      visaType,
      visaValidTill,
      visaEntryType,
    } = item;
    const formVisa = {
      id,
      document: document ? document._id : '',
      employee,
      visaNumber,
      visaIssuedCountry,
      visaIssuedOn,
      visaType,
      visaValidTill,
      visaEntryType,
    };

    return formVisa;
  };

  processDataAddPassPort = (id) => {
    const { passportData: passportDataTemp, generalData } = this.props;
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
      document: id,
      employee,
    };
    return payloadChanges;
  };

  handleAddVisaAllField = (item, index) => {
    const { dispatch, idCurrentEmployee } = this.props;
    const { urlFile, document: documentVisa } = item;
    let getFile = '';
    if (urlFile) {
      getFile = urlFile;
    }
    if (documentVisa) {
      const dataVisa = { id: documentVisa._id, attachment: getFile.id, key: `Visa${index + 1}` };
      dispatch({
        type: 'employeeProfile/fetchDocumentUpdate',
        payload: dataVisa,
      });
    } else {
      dispatch({
        type: 'employeeProfile/fetchDocumentAdd',
        payload: {
          key: `Visa${index + 1}`,
          attachment: getFile.id,
          employeeGroup: 'Identity',
          parentEmployeeGroup: 'Indentification Documents',
          employee: idCurrentEmployee,
        },
      }).then((id) => this.handleAddVisa(id, index, item));
    }
  };

  handleAddVisa = (id, index, item) => {
    const { dispatch } = this.props;
    const dataTempKept = this.processDataKeptVisa() || {};
    const payloadAddPassPort = this.processDataAddVisa(id, item) || {};
    dispatch({
      type: 'employeeProfile/addVisa',
      payload: payloadAddPassPort,
      dataTempKept,
      key: 'openPassportandVisa',
    });
  };

  processDataAddVisa = (id, item) => {
    const { generalData } = this.props;
    const { employee = '' } = generalData;
    const {
      visaNumber,
      visaIssuedCountry,
      visaIssuedOn,
      visaType,
      visaValidTill,
      visaEntryType,
    } = item;
    const formVisa = {
      document: id,
      employee,
      visaNumber,
      visaIssuedCountry,
      visaIssuedOn,
      visaType,
      visaValidTill,
      visaEntryType,
    };
    return formVisa;
  };

  processDataKeptPassPort = () => {
    const { passportData } = this.props;
    const newObj = { ...passportData };
    const listKey = [
      'urlFile',
      'passportNumber',
      'passportIssuedCountry',
      'passportIssuedOn',
      'passportValidTill',
      'document',
    ];
    listKey.forEach((item) => delete newObj[item]);
    return newObj;
  };

  processDataKeptVisa = (item) => {
    const newobj = { ...item };
    const listKey = [
      'visaNumber',
      'urlFile',
      'visaIssuedCountry',
      'visaIssuedOn',
      'visaValidTill',
      'visaEntryType',
      'visaType',
      'document',
    ];
    listKey.forEach((itemVisa) => delete newobj[itemVisa]);
    return newobj;
  };

  handleUpdateVisaGroup = (item, index) => {
    const payloadUpdateVisa = this.processDataChangesVisa(item) || {};
    const dataTempKeptVisa = this.processDataKeptVisa(item) || {};
    const { dispatch } = this.props;
    this.handleAddVisaAllField(item, index);
    dispatch({
      type: 'employeeProfile/updateVisa',
      payload: payloadUpdateVisa,
      dataTempKeptVisa,
      key: 'openPassportandVisa',
    });
  };

  handleSave = async () => {
    const { dispatch, passportData = {}, visaData = [] } = this.props;
    const payloadUpdatePassPort = this.processDataChangesPassPort() || {};
    const dataTempKept = this.processDataKeptPassPort() || {};
    let idPassPort = '';

    if (passportData) {
      idPassPort = passportData._id;
    }

    if (idPassPort) {
      this.handleAddPassPortAllField();
      dispatch({
        type: 'employeeProfile/updatePassPort',
        payload: payloadUpdatePassPort,
        dataTempKept,
        key: 'openPassportandVisa',
      });
    } else {
      this.handleAddPassPortAllField();
    }
    visaData.map((item, index) => {
      let idVisa = '';
      const { _id } = item;
      if (_id) {
        idVisa = _id;
      }
      if (idVisa) {
        return this.handleUpdateVisaGroup(item, index);
      }
      return this.handleAddVisaAllField(item, index);
    });
  };

  handleCanCelIcon = () => {
    const { dispatch, passportData, passportDataOrigin } = this.props;
    const item = { ...passportData, urlFile: '' };
    const isModified = JSON.stringify(item) !== JSON.stringify(passportDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { passportData: item },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  handleGetSetSizeImage = (isLt5M) => {
    this.setState({ isLt5M });
  };

  getConfirmContent = (setContent) => {
    if (setContent) {
      this.setState({ getContent: setContent.isLt5M });
    }
  };

  getcheckArrayVisa = (getCheck) => {
    const isCheckVisa = (currentValue) => currentValue === true;
    const getIsCheckVisa = getCheck.every(isCheckVisa);
    this.setState({ isCheckDateVisa: getIsCheckVisa });
  };

  handleOpenModalReview = (linkImage) => {
    this.setState({
      visible: true,
      linkImage,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      linkImage: '',
    });
  };

  handleAddBtn = () => {
    const { passportArr } = this.state;
    const newPassportArr = [...passportArr];
    const newObj = {
      passportNumber: '',
      passportIssuedCountry: {},
      passportIssuedOn: '',
      passportValidTill: '',
    };

    newPassportArr.push(newObj);

    this.setState({ passportArr: newPassportArr });
  };

  onRemoveCondition = (index) => {
    const { passportArr } = this.state;
    const newPassportArr = [...passportArr];

    newPassportArr.splice(index, 1);
    console.log('remove index: ', index);
    console.log('newPassportArr: ', newPassportArr);

    // newPassportArr.forEach((item, itemIndex) => {
    //   console.log(`item ${itemIndex}: `, item);
    // });
    this.setState({
      passportArr: newPassportArr,
    });
  };

  render() {
    const {
      isLt5M,
      getContent,
      isDate,
      isCheckDateVisa,
      visible,
      linkImage,
      passportArr,
    } = this.state;

    const newPassportArr = [...passportArr];
    console.log('RENDER newPassportArr: ', newPassportArr);

    const { Option } = Select;
    const {
      passportData = {},
      handleCancel = () => {},
      countryList,
      loading,
      loadingPassPort,
    } = this.props;
    const formatCountryList = countryList.map((item) => {
      const { _id: value, name } = item;
      return {
        value,
        name,
      };
    });

    const {
      urlFile = '',
      passportNumber = '',
      passportIssuedCountry,
      passportIssuedOn = '',
      passportValidTill = '',
    } = passportData;
    const splitURL = urlFile ? urlFile.url.split('/') : '';
    const nameDataURL = splitURL[splitURL.length - 1];

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
    const dateFormat = 'Do MMM YYYY';

    return (
      <Row gutter={[0, 16]} className={styles.root}>
        <Form className={styles.Form} {...formItemLayout} onFinish={this.handleSave}>
          {passportArr ? (
            <>
              {newPassportArr.map((item, index) => {
                const {
                  passportNumber,
                  passportIssuedCountry,
                  passportIssuedOn,
                  passportValidTill,
                } = item;
                return (
                  <div key={index}>
                    {index > 0 ? <div className={styles.line} /> : null}

                    <div className={styles.styleUpLoad}>
                      <Form.Item
                        label="Passport Number"
                        name={`passportNumber ${index}`}
                        rules={[
                          {
                            pattern: /^[a-zA-Z0-9]{0,12}$/,
                            message: formatMessage({
                              id: 'pages.employeeProfile.validatePassPortNumber',
                            }),
                          },
                        ]}
                      >
                        <Input
                          className={isLt5M ? styles.inputForm : styles.inputFormImageValidate}
                          defaultValue={passportNumber}
                          onChange={(event) => {
                            const { value: fieldValue } = event.target;
                            this.handleChange('passportNumber', fieldValue);
                          }}
                        />
                      </Form.Item>
                      {index >= 1 ? (
                        <div>
                          <img
                            className={styles.removeIcon}
                            onClick={() => this.onRemoveCondition(index)}
                            src={removeIcon}
                            alt="remove"
                          />
                        </div>
                      ) : null}
                      {!urlFile ? (
                        <div className={styles.textUpload}>
                          {loadingPassPort === false ? (
                            <UploadImage
                              content={isLt5M ? 'Choose file' : `Retry`}
                              setSizeImageMatch={(isImage5M) =>
                                this.handleGetSetSizeImage(isImage5M)
                              }
                              getResponse={(resp) => this.handleGetUpLoad(resp)}
                              loading={loading}
                              name="passport"
                            />
                          ) : (
                            <Spin loading={loadingPassPort} active="true" />
                          )}
                        </div>
                      ) : (
                        <div className={styles.viewUpLoadData}>
                          <p
                            onClick={() => this.handleOpenModalReview(urlFile ? urlFile.url : '')}
                            className={styles.viewUpLoadDataURL}
                          >
                            fileName
                          </p>
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
                    {urlFile !== '' ? (
                      <Form.Item label="Uploaded file:" className={styles.labelUpload}>
                        <p
                          onClick={() => this.handleOpenModalReview(urlFile ? urlFile.url : '')}
                          className={styles.urlUpload}
                        >
                          {nameDataURL}
                        </p>
                      </Form.Item>
                    ) : (
                      ''
                    )}
                    <Form.Item label="Issued Country" name={`passportIssuedCountry ${index}`}>
                      <Select
                        className={styles.selectForm}
                        onDropdownVisibleChange={this.handleDropdown}
                        defaultValue={passportIssuedCountry ? passportIssuedCountry._id : ''}
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
                    <Form.Item label="Issued On" name={`passportIssuedOn ${index}`}>
                      <DatePicker
                        format={dateFormat}
                        defaultValue={passportIssuedOn}
                        onChange={(dates) => {
                          this.handleChange('passportIssuedOn', dates);
                        }}
                        className={styles.dateForm}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Valid Till"
                      name={`passportValidTill ${index}`}
                      validateStatus={isDate === false ? 'error' : 'success'}
                      help={
                        isDate === false
                          ? formatMessage({
                              id: 'pages.employeeProfile.validateDate',
                            })
                          : ''
                      }
                    >
                      <DatePicker
                        format={dateFormat}
                        defaultValue={passportValidTill}
                        onChange={(dates) => {
                          this.handleChange('passportValidTill', dates);
                        }}
                        className={isDate === false ? styles.dateFormValidate : styles.dateForm}
                      />
                    </Form.Item>
                  </div>
                );
              })}
            </>
          ) : null}

          <Col span={9} offset={1} className={styles.addMoreButton}>
            <div onClick={this.handleAddBtn}>
              <PlusOutlined className={styles.addMoreButtonIcon} />
              Add more
            </div>
          </Col>

          <VisaGeneral
            setConfirmContent={this.getConfirmContent}
            checkArrayVisa={this.getcheckArrayVisa}
          />
          <div className={styles.spaceFooter}>
            <div className={styles.cancelFooter} onClick={handleCancel}>
              Cancel
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.buttonFooter}
              disabled={
                isLt5M === false ||
                getContent === false ||
                isDate === false ||
                isCheckDateVisa === false
              }
            >
              Save
            </Button>
          </div>
          <ModalReviewImage visible={visible} handleCancel={this.handleCancel} link={linkImage} />
        </Form>
      </Row>
    );
  }
}

export default Edit;
