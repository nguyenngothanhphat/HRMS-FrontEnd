/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { Row, Form, Button } from 'antd';
import { connect } from 'umi';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import VisaGeneral from './components/Visa';
import styles from './index.less';

@connect(
  ({
    loading,
    upload: { urlImage = '', visa0IDURL = '', visa1IDURL = '' },
    employeeProfile: {
      countryList,
      idCurrentEmployee,
      companyCurrentEmployee,
      originData: { visaData: visaDataOrigin = [] } = {},
      tempData: { generalData = {}, visaData = [], document = {} } = {},
      tenantCurrentEmployee = '',
      documentCategories = [],
    } = {},
  }) => ({
    loading: loading.effects['upload/uploadFile'],
    countryList,

    generalData,
    visaDataOrigin,
    visaData,

    visa0IDURL,
    visa1IDURL,

    document,
    idCurrentEmployee,
    tenantCurrentEmployee,
    companyCurrentEmployee,

    urlImage,
    documentCategories,
  }),
)
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLt5M: true,
      getContent: true,
      isDate: true,
      isCheckDateVisa: true,
      visible: false,
      linkImage: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/fetchDocumentCategories',
      payload: {
        page: 'Document Employee',
      },
    });
  }

  processDataChangesVisa = (item) => {
    const { generalData, tenantCurrentEmployee = '' } = this.props;
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
      tenantId: tenantCurrentEmployee,
    };

    return formVisa;
  };

  handleAddVisaAllField = (item, index) => {
    const {
      dispatch,
      idCurrentEmployee,
      companyCurrentEmployee = '',
      tenantCurrentEmployee = '',
      documentCategories = [],
    } = this.props;
    const { urlFile, document: documentVisa } = item;
    let getFile = '';
    if (urlFile) {
      getFile = urlFile;
    }
    const indentityCategory = documentCategories.find((child) => child.name === 'Indentity');

    if (documentVisa) {
      const dataVisa = {
        id: documentVisa._id,
        attachment: getFile.id,
        key: `Visa_${index + 1}`,
        tenantId: tenantCurrentEmployee,
        category: indentityCategory?._id,
      };
      dispatch({
        type: 'employeeProfile/fetchDocumentUpdate',
        payload: dataVisa,
      });
    } else {
      dispatch({
        type: 'employeeProfile/fetchDocumentAdd',
        payload: {
          key: `Visa_${index + 1}`,
          attachment: getFile.id,
          category: indentityCategory?._id,
          employee: idCurrentEmployee,
          tenantId: tenantCurrentEmployee,
          company: companyCurrentEmployee,
        },
      }).then((id) => this.handleAddVisa(id, index, item));
    }
  };

  handleAddVisa = (id, index, item) => {
    const { dispatch } = this.props;
    const dataTempKept = this.processDataKeptVisa() || {};
    const payloadAddVisa = this.processDataAddVisa(id, item) || {};
    dispatch({
      type: 'employeeProfile/addVisa',
      payload: payloadAddVisa,
      dataTempKept,
      key: 'openVisa',
    });
  };

  processDataAddVisa = (id, item) => {
    const { generalData, tenantCurrentEmployee = '' } = this.props;
    const { employee = '' } = generalData;
    const { visaNumber, visaIssuedCountry, visaIssuedOn, visaType, visaValidTill, visaEntryType } =
      item;
    const formVisa = {
      document: id,
      employee,
      visaNumber,
      visaIssuedCountry,
      visaIssuedOn,
      visaType,
      visaValidTill,
      visaEntryType,
      tenantId: tenantCurrentEmployee,
    };
    return formVisa;
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
    // add or update document visa
    this.handleAddVisaAllField(item, index);
    dispatch({
      type: 'employeeProfile/updateVisa',
      payload: payloadUpdateVisa,
      dataTempKeptVisa,
      key: 'openVisa',
    });
  };

  handleSave = async () => {
    const { visaData = [] } = this.props;

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

  render() {
    const { isLt5M, getContent, isDate, isCheckDateVisa, visible, linkImage } = this.state;

    const { handleCancel = () => {} } = this.props;

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

    return (
      <Row gutter={[0, 16]} className={styles.root}>
        <Form
          className={styles.Form}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...formItemLayout}
          onFinish={this.handleSave}
        >
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
          <ViewDocumentModal visible={visible} onClose={this.handleCancel} url={linkImage} />
        </Form>
      </Row>
    );
  }
}

export default Edit;
