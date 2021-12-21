/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { Row, Form, Button, Col } from 'antd';
import { connect } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import PassportItem from './PassportItem';
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
      tenantCurrentEmployee = '',
      companyCurrentEmployee = '',
      documentCategories = [],
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
    tenantCurrentEmployee,
    documentCategories,
    companyCurrentEmployee,
  }),
)
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dummyPassPorts: [{}],
      isLt5M: true,
      getContent: true,
      visible: false,
      linkImage: '',
      checkValidate: [{}],
      validatePassPort: [],
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    const { dispatch, passportData = [] } = this.props;
    const checkValidatePassPort = [...passportData];
    const valueFalse = passportData.length > 0 ? [passportData[0].employee] : [];
    const result = checkValidatePassPort.map((item) => valueFalse.includes(item?.employee));
    this.setState({ validatePassPort: result });
    dispatch({
      type: 'employeeProfile/fetchDocumentCategories',
      payload: {
        page: 'Document Employee',
      },
    });
  }

  validateDate = (getPassportData, index) => {
    const { validatePassPort } = this.state;
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
      const newCheck = [...validatePassPort];
      newCheck.splice(index, 1, false);
      this.setState({ validatePassPort: newCheck });
    } else {
      const newCheck = [...validatePassPort];
      newCheck.splice(index, 1, true);
      this.setState({ validatePassPort: newCheck });
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
    const {
      dispatch,
      idCurrentEmployee,
      tenantCurrentEmployee = '',
      companyCurrentEmployee = '',
      documentCategories = [],
    } = this.props;
    const { document: documentPassPort, urlFile } = item;

    let getFile = '';
    if (urlFile) {
      getFile = urlFile;
    }

    const indentityCategory = documentCategories.find((child) => child.name === 'Indentity');

    if (documentPassPort) {
      const dataPassport = {
        id: documentPassPort?._id,
        attachment: getFile?.id,
        key: `Passport_${index + 1}`,
        tenantId: tenantCurrentEmployee,
        category: indentityCategory?._id,
      };

      dispatch({
        type: 'employeeProfile/fetchDocumentUpdate',
        payload: dataPassport,
      });
    } else {
      dispatch({
        type: 'employeeProfile/fetchDocumentAdd',
        payload: {
          key: `Passport_${index + 1}`,
          attachment: getFile?.id,
          category: indentityCategory?._id,
          employee: idCurrentEmployee,
          tenantId: tenantCurrentEmployee,
          company: companyCurrentEmployee,
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
    const { tenantCurrentEmployee = '' } = this.props;
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
      tenantId: tenantCurrentEmployee,
    };

    return payloadChanges;
  };

  processDataAddPassPort = (id, item) => {
    const { generalData, tenantCurrentEmployee = '' } = this.props;
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
      tenantId: tenantCurrentEmployee,
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

  handleSave = async ({ formPassPort = [] }) => {
    const { passportData = [] } = this.props;
    formPassPort.map((item, index) => {
      let idPassPort = '';
      const newData = {
        ...item,
        ...passportData[index],
      };
      const { _id } = passportData[index];
      if (_id) {
        idPassPort = _id;
      }
      if (idPassPort) {
        return this.handleUpdatePassportGroup(newData, index);
      }
      return this.handleAddPassPortAllField(newData, index);
    });
    // passportData.map((item, index) => {
    //   let idPassPort = '';
    //   const { _id } = item;
    //   if (_id) {
    //     idPassPort = _id;
    //   }

    //   if (idPassPort) {
    //     return this.handleUpdatePassportGroup(item, index);
    //   }
    //   return this.handleAddPassPortAllField(item, index);
    // });
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
    });
    setTimeout(() => {
      this.setState({
        linkImage: '',
      });
    }, 500);
  };

  handleAddBtn = (add, validatePassPort) => {
    const newArr = [...validatePassPort, true];
    this.setState({ validatePassPort: newArr });
    add();
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
    const { isLt5M, getContent, visible, linkImage, dummyPassPorts, validatePassPort } = this.state;

    const { passportData = [], handleCancel = () => {}, countryList } = this.props;

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

    const newPassportData = passportData.map((item) => {
      const { passportIssuedOn, passportValidTill, passportIssuedCountry } = item;
      const formatDatePassportValidTill = passportValidTill && moment(passportValidTill);
      const formatDatePassportIssueOn = passportIssuedOn && moment(passportIssuedOn);

      const newItem = {
        ...item,
        passportIssuedCountry: passportIssuedCountry ? passportIssuedCountry._id : '',
        passportIssuedOn: formatDatePassportIssueOn,
        passportValidTill: formatDatePassportValidTill,
      };
      return newItem;
    });

    const checkPassPort = validatePassPort.filter((item) => item === true);
    const renderForm = passportData.length > 0 ? newPassportData : dummyPassPorts;
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        <Form
          className={styles.Form}
          initialValues={{ formPassPort: renderForm }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...formItemLayout}
          onFinish={this.handleSave}
        >
          <Form.List name="formPassPort">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <PassportItem
                    validatePassPort={validatePassPort[index]}
                    getHandleChange={this.handleChange}
                    field={field}
                    key={field.name}
                    onRemove={() => remove(field.name)}
                    formRef={this.formRef}
                    getCancelImage={this.handleCanCelIcon}
                    getShowModal={this.handleOpenModalReview}
                    index={index}
                    passportData={passportData}
                    getSizeImage={this.handleGetSetSizeImage}
                    getDataImage={this.handleChange}
                    isLt5M={isLt5M}
                    formatCountryList={formatCountryList}
                  />
                ))}

                <Col span={9} offset={1} className={styles.addMoreButton}>
                  <div
                    // onClick={this.handleAddBtn}
                    onClick={() => {
                      this.handleAddBtn(add, validatePassPort);
                    }}
                  >
                    <PlusOutlined className={styles.addMoreButtonIcon} />
                    Add more
                  </div>
                </Col>
              </>
            )}
          </Form.List>

          {/* {renderForm.map((item, index) => {
            const {
              passportNumber,
              passportIssuedCountry,
              passportIssuedOn,
              passportValidTill,
              urlFile = '',
            } = item;

            return (
              <PassportItem
                passportNumber={passportNumber}
                passportIssuedCountry={passportIssuedCountry}
                passportIssuedOn={passportIssuedOn}
                passportValidTill={passportValidTill}
                urlFile={urlFile}
                index={index}
                isLt5M={isLt5M}
                isDate={isDate}
                formatCountryList={formatCountryList}
              />
            );
          })}

          <Col span={9} offset={1} className={styles.addMoreButton}>
            <div onClick={this.handleAddBtn}>
              <PlusOutlined className={styles.addMoreButtonIcon} />
              Add more
            </div>
          </Col> */}

          <div className={styles.spaceFooter}>
            <div className={styles.cancelFooter} onClick={handleCancel}>
              Cancel
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.buttonFooter}
              disabled={isLt5M === false || getContent === false || checkPassPort.length === 0}
            >
              Save
            </Button>
          </div>
          <ViewDocumentModal visible={visible} onClose={this.handleCancel} url={linkImage} />
        </Form>
      </Row>
    );
  }
}

export default Edit;
