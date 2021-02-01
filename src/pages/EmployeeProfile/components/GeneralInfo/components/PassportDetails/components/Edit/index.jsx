/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { Row, Input, Form, DatePicker, Select, Button, Spin, Col } from 'antd';
import { connect, formatMessage } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import ModalReviewImage from '@/components/ModalReviewImage';
import moment from 'moment';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import removeIcon from './assets/removeIcon.svg';
import UploadImage from '../UploadImage';
import styles from './index.less';

@connect(
  ({
    loading,
    upload: {
      passPortURL = '',
      passport0URL = '',
      passport1URL = '',
      urlImage = '',
      loadingPassportTest = [],
      passPortIDURL = '',
      loadingPassPort = false,
    },
    employeeProfile: {
      countryList,
      idCurrentEmployee,
      originData: { passportData: passportDataOrigin = [] } = {},
      tempData: { passportData = [], generalData = {}, document = {} } = {},
    } = {},
  }) => ({
    loading: loading.effects['upload/uploadFile'],
    countryList,
    passportDataOrigin,
    passportData,
    generalData,
    passPortURL,
    passPortIDURL,
    document,
    idCurrentEmployee,
    loadingPassPort,
    passport0URL,
    passport1URL,
    urlImage,
    loadingPassportTest,
  }),
)
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dummyPassPorts: [{}],
      isLt5M: true,
      getContent: true,
      isDate: true,
      visible: false,
      linkImage: '',
      checkValidate: [{}],
    };
  }

  validateDate = (getPassportData, index) => {
    if (getPassportData === []) return;
    const { passportDataOrigin } = this.props;
    const formatDatePassportIssueOn =
      passportDataOrigin.passportIssuedOn && moment(passportDataOrigin.passportIssuedOn);
    const DatePassportIssueOn =
      getPassportData[index].passportIssuedOn && moment(getPassportData[index].passportIssuedOn);
    const formatDatePassportValidTill =
      passportDataOrigin.passportValidTill && moment(passportDataOrigin.passportValidTill);
    const DatePassportValidTill =
      getPassportData[index].passportValidTill && moment(getPassportData[index].passportValidTill);
    const IssuedOn = DatePassportIssueOn || formatDatePassportIssueOn;
    const ValidTill = DatePassportValidTill || formatDatePassportValidTill;

    const issueAfter3Year = moment(IssuedOn).add(3, 'years');
    if (moment(ValidTill).isSameOrBefore(moment(issueAfter3Year))) {
      this.setState({ isDate: false });
    } else {
      this.setState({ isDate: true });
    }
  };

  handleChange = (index, name, value) => {
    const { dispatch, passportData, passportDataOrigin } = this.props;

    const item = passportData[index];
    const newItem = { ...item, [name]: value };
    const newList = [...passportData];

    newList.splice(index, 1, newItem);
    this.validateDate(newList, index);
    const isModified = JSON.stringify(newList) !== JSON.stringify(passportDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { passportData: newList },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  handleGetUpLoad = (index, resp) => {
    const { data = [] } = resp;
    const [first] = data;
    const value = { id: first ? first.id : '', url: first ? first.url : '' };
    this.handleChange(index, 'urlFile', value);
  };

  handleAddPassPortAllField = (item, index) => {
    const { dispatch, idCurrentEmployee } = this.props;
    const { document: documentPassPort, urlFile } = item;

    let getFile = '';
    if (urlFile) {
      getFile = urlFile;
    }

    if (documentPassPort) {
      const dataPassport = {
        id: documentPassPort._id,
        attachment: getFile.id,
        key: `Passport${index + 1}`,
      };

      dispatch({
        type: 'employeeProfile/fetchDocumentUpdate',
        payload: dataPassport,
      });
    } else {
      dispatch({
        type: 'employeeProfile/fetchDocumentAdd',
        payload: {
          key: `PassPort${index + 1}`,
          attachment: getFile.id,
          employeeGroup: 'Identity',
          parentEmployeeGroup: 'Indentification Documents',
          employee: idCurrentEmployee,
        },
      }).then((id) => this.handleAddPassPort(id, index, item));
    }
  };

  handleAddPassPort = (id, index, item) => {
    const { dispatch } = this.props;
    const dataTempKept = this.processDataKeptPassPort() || {};
    const payloadAddPassPort = this.processDataAddPassPort(id, item) || {};
    dispatch({
      type: 'employeeProfile/addPassPort',
      payload: payloadAddPassPort,
      dataTempKept,
      key: 'openPassport',
    });
  };

  processDataChangesPassPort = (item) => {
    const {
      urlFile,
      document,
      passportNumber,
      passportIssuedCountry,
      passportIssuedOn,
      passportValidTill,
      _id,
    } = item;

    const payloadChanges = {
      urlFile,
      document: document ? document._id : '',
      passportNumber,
      passportIssuedCountry,
      passportIssuedOn,
      passportValidTill,
      _id,
    };

    return payloadChanges;
  };

  processDataAddPassPort = (id, item) => {
    const { generalData } = this.props;
    const { employee = '' } = generalData;
    const {
      passportNumber = '',
      passportIssuedCountry = '',
      passportIssuedOn = '',
      passportValidTill = '',
    } = item;

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

  processDataKeptPassPort = (item) => {
    const newObj = { ...item };
    const listKey = [
      'urlFile',
      'passportNumber',
      'passportIssuedCountry',
      'passportIssuedOn',
      'passportValidTill',
      'document',
    ];
    listKey.forEach((itemPassport) => delete newObj[itemPassport]);
    return newObj;
  };

  handleUpdatePassportGroup = (item, index) => {
    const { dispatch } = this.props;
    const payloadUpdatePassPort = this.processDataChangesPassPort(item) || {};
    const dataTempKeptPassport = this.processDataKeptPassPort(item) || {};

    this.handleAddPassPortAllField(item, index);

    dispatch({
      type: 'employeeProfile/updatePassPort',
      payload: payloadUpdatePassPort,
      dataTempKeptPassport,
      key: 'openPassport',
    });
  };

  handleSave = async () => {
    const { passportData = [] } = this.props;

    passportData.map((item, index) => {
      let idPassPort = '';
      const { _id } = item;
      if (_id) {
        idPassPort = _id;
      }

      if (idPassPort) {
        return this.handleUpdatePassportGroup(item, index);
      }
      return this.handleAddPassPortAllField(item, index);
    });
  };

  handleCanCelIcon = (index) => {
    const { dispatch, passportData, passportDataOrigin } = this.props;
    const item = passportData[index];

    const newItem = { ...item, urlFile: '' };
    const newList = [...passportData];
    newList.splice(index, 1, newItem);

    const isModified = JSON.stringify(newList) !== JSON.stringify(passportDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { passportData: newList },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  handleNameDataUpload = (url) => {
    const split1URL = url.split('/');
    const nameData1URL = split1URL[split1URL.length - 1];
    return nameData1URL;
  };

  handleGetSetSizeImage = (index, isLt5M) => {
    const { checkValidate } = this.state;
    const item = checkValidate[index];
    const newItem = { ...item, isLt5M };
    const newList = [...checkValidate];
    newList.splice(index, 1, newItem);

    this.setState({ isLt5M, checkValidate: newList });
  };

  getConfirmContent = (setContent) => {
    if (setContent) {
      this.setState({ getContent: setContent.isLt5M });
    }
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
    const { passportData = [], dispatch } = this.props;
    const { dummyPassPorts } = this.state;

    if (passportData.length > 0) {
      const newData = [...passportData, {}];

      dispatch({
        type: 'employeeProfile/saveTemp',
        payload: { passportData: newData },
      });
    } else {
      const newData = [...dummyPassPorts, {}];

      dispatch({
        type: 'employeeProfile/saveTemp',
        payload: { passportData: newData },
      });
    }
  };

  onRemoveCondition = (index) => {
    const { passportData = [], dispatch } = this.props;
    const newPassportData = [...passportData];
    newPassportData.splice(index, 1);
    // console.log('newPassportData', newPassportData);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { passportData: newPassportData },
    });
  };

  render() {
    const { isLt5M, getContent, isDate, visible, linkImage, dummyPassPorts } = this.state;

    const { Option } = Select;
    const {
      passportData = [],
      handleCancel = () => {},
      countryList,
      loading,
      loadingPassportTest,
    } = this.props;

    const formatCountryList = countryList.map((item) => {
      const { _id: value, name } = item;
      return {
        value,
        name,
      };
    });

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

    const dateFormat = 'MM.DD.YY';
    const renderForm = passportData.length > 0 ? passportData : dummyPassPorts;
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        <Form
          className={styles.Form}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...formItemLayout}
          onFinish={this.handleSave}
        >
          {renderForm.map((item, index) => {
            const {
              passportNumber,
              passportIssuedCountry,
              passportIssuedOn,
              passportValidTill,
              urlFile = '',
            } = item;

            const formatDatePassportIssueOn = passportIssuedOn && moment(passportIssuedOn);
            const formatDatePassportValidTill = passportValidTill && moment(passportValidTill);

            return (
              <div key={`passport${index + 1}`}>
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
                        this.handleChange(index, 'passportNumber', fieldValue);
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
                      {loadingPassportTest[index] === false ||
                      loadingPassportTest[index] === undefined ? (
                        <UploadImage
                          content={isLt5M ? 'Choose file' : `Retry`}
                          setSizeImageMatch={(isImage5M) =>
                            this.handleGetSetSizeImage(index, isImage5M)
                          }
                          getResponse={(resp) => this.handleGetUpLoad(index, resp)}
                          loading={loading}
                          index={index}
                          name="passport"
                        />
                      ) : (
                        <Spin loading={loadingPassportTest[index]} active="true" />
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
                        onClick={() => this.handleCanCelIcon(index)}
                        className={styles.viewUpLoadDataIconCancel}
                      />
                    </div>
                  )}
                </div>
                {urlFile ? (
                  <Form.Item label="Uploaded file:" className={styles.labelUpload}>
                    <p
                      onClick={() => this.handleOpenModalReview(urlFile ? urlFile.url : '')}
                      className={styles.urlUpload}
                    >
                      {this.handleNameDataUpload(urlFile.url)}
                    </p>
                  </Form.Item>
                ) : (
                  ''
                )}
                <Form.Item label="Issued Country" name={`passportIssuedCountry ${index}`}>
                  <Select
                    showArrow
                    className={styles.selectForm}
                    defaultValue={passportIssuedCountry ? passportIssuedCountry._id : ''}
                    onChange={(value) => {
                      this.handleChange(index, 'passportIssuedCountry', value);
                    }}
                    // suffixIcon={<DownOutlined className={styles.arrowDown} />}
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
                <Form.Item label="Issued On" name={`passportIssuedOn ${index}`}>
                  <DatePicker
                    format={dateFormat}
                    defaultValue={formatDatePassportIssueOn}
                    onChange={(dates) => {
                      this.handleChange(index, 'passportIssuedOn', dates);
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
                    defaultValue={formatDatePassportValidTill}
                    onChange={(dates) => {
                      this.handleChange(index, 'passportValidTill', dates);
                    }}
                    className={isDate === false ? styles.dateFormValidate : styles.dateForm}
                  />
                </Form.Item>
              </div>
            );
          })}

          <Col span={9} offset={1} className={styles.addMoreButton}>
            <div onClick={this.handleAddBtn}>
              <PlusOutlined className={styles.addMoreButtonIcon} />
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
              disabled={isLt5M === false || getContent === false || isDate === false}
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
