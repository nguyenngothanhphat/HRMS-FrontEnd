/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import { Row, Input, Form, DatePicker, Radio, Button } from 'antd';
import { connect, formatMessage } from 'umi';
import moment from 'moment';
import UploadImage from '@/components/UploadImage';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { checkPermissions } from '@/utils/permissions';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeProfile: {
      AdhaarCard = {},
      idCurrentEmployee = '',
      originData: {
        generalData: generalDataOrigin = {},
        employmentData: { location: locationEmpl = {} } = {},
        taxData = {}
      } = {},
      tempData: { generalData = {} } = {},
      tenantCurrentEmployee = '',
      documentCategories = [],
      companyCurrentEmployee = '',
    } = {},
    upload: { employeeInformationURL = '' },
    user: { currentUser = [] },
  }) => ({
    loading: loading.effects['employeeProfile/updateGeneralInfo'],
    loadingAdhaarCard: loading.effects['upload/uploadFile'],
    generalDataOrigin,
    generalData,
    employeeInformationURL,
    idCurrentEmployee,
    AdhaarCard,
    taxData,
    currentUser,
    tenantCurrentEmployee,
    documentCategories,
    companyCurrentEmployee,
    locationEmpl,
  }),
)
class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLt5M: true,
      visible: false,
      linkImage: '',
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/fetchDocumentCategories',
      payload: {
        page: 'Document Employee',
      },
    });
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
    const { generalData: generalDataTemp, tenantCurrentEmployee = '' } = this.props;
    const {
      urlFile = '',
      legalGender = '',
      legalName = '',
      DOB = '',
      employeeId = '',
      workEmail = '',
      workNumber = '',
      adhaarCardNumber = '',
      uanNumber = '',
      nationalId = '',
      _id: id = '',
    } = generalDataTemp;
    // const payloadChanges = {
    //   id,
    //   urlFile,
    //   legalGender,
    //   legalName,
    //   firstName: legalName,
    //   DOB,
    //   employeeId,
    //   workEmail,
    //   workNumber,
    //   adhaarCardNumber,
    //   uanNumber,
    // };
    return {
      id,
      urlFile,
      legalGender,
      legalName,
      firstName: legalName,
      DOB,
      employeeId,
      workEmail,
      workNumber,
      adhaarCardNumber,
      uanNumber,
      nationalId,
      tenantId: tenantCurrentEmployee,
    };
  };

  processDataKept = () => {
    const { generalData } = this.props;
    const newObj = { ...generalData };
    const listKey = [
      'urlFile',
      'legalGender',
      'legalName',
      'firstName',
      'DOB',
      'employeeId',
      'workEmail',
      'workNumber',
      'adhaarCardNumber',
      'uanNumber',
      'nationalId'
    ];
    listKey.forEach((item) => delete newObj[item]);
    return newObj;
  };

  handleSave = () => {
    const { dispatch } = this.props;
    const payload = this.processDataChanges() || {};
    // const tenantId = localStorage.getItem('tenantId');
    const dataTempKept = this.processDataKept() || {};
    this.handleUpLoadAdhaarCard();
    dispatch({
      type: 'employeeProfile/updateGeneralInfo',
      payload,
      dataTempKept,
      key: 'openEmployeeInfor',
    });
  };

  handleUpLoadAdhaarCard = () => {
    const {
      dispatch,
      idCurrentEmployee = '',
      AdhaarCard = {},
      generalData = {},
      tenantCurrentEmployee = '',
      companyCurrentEmployee = '',
      documentCategories = [],
    } = this.props;

    let file = '';
    const { urlFile } = generalData;
    if (urlFile) {
      file = urlFile;
    }
    const indentityCategory = documentCategories.find((child) => child.name === 'Indentity');

    if (!AdhaarCard || Object.keys(AdhaarCard).length === 0) {
      dispatch({
        type: 'employeeProfile/fetchDocumentAdd',
        payload: {
          tenantId: tenantCurrentEmployee,
          key: 'Adhaar Card',
          attachment: file.id,
          category: indentityCategory?._id,
          employee: idCurrentEmployee,
          company: companyCurrentEmployee,
        },
      }).then((id) => this.handleAdd(id));
    } else {
      if (!AdhaarCard.document || Object.keys(AdhaarCard.document).length === 0) {
        dispatch({
          type: 'employeeProfile/fetchDocumentAdd',
          payload: {
            key: 'Adhaar Card',
            attachment: file?.id,
            category: indentityCategory?._id,
            employee: idCurrentEmployee,
            tenantId: tenantCurrentEmployee,
            company: companyCurrentEmployee,
          },
        }).then((id) => this.handleAddDocument(id));
      }
      dispatch({
        type: 'employeeProfile/fetchDocumentUpdate',
        payload: {
          attachment: file?.id,
          id: AdhaarCard?.document?._id,
          tenantId: tenantCurrentEmployee,
          category: indentityCategory?._id,
        },
      }).then((doc) => this.handleUpdate(doc));
    }
  };

  handleAddDocument = (id) => {
    const {
      dispatch,
      AdhaarCard,
      generalDataOrigin,
      generalData,
      tenantCurrentEmployee = '',
    } = this.props;
    const { adhaarCardNumber: adhaarCardNumberOrigin } = generalDataOrigin;
    const { adhaarCardNumber: adhaarCardNumberTemp } = generalData;
    const getNewAdhaarCard =
      adhaarCardNumberTemp !== adhaarCardNumberOrigin
        ? adhaarCardNumberTemp
        : adhaarCardNumberOrigin;
    dispatch({
      type: 'employeeProfile/fetchAdhaarcardUpdate',
      payload: {
        document: id,
        id: AdhaarCard._id,
        adhaarNumber: getNewAdhaarCard,
        tenantId: tenantCurrentEmployee,
      },
    });
  };

  handleGetUpLoad = (resp) => {
    const { data = [] } = resp;
    const [first] = data;
    const value = { id: first.id, url: first.url };
    const url = { urlFile: value };
    this.handleChange(url);
  };

  handleUpdate = (doc) => {
    const {
      dispatch,
      AdhaarCard,
      generalDataOrigin,
      generalData,
      tenantCurrentEmployee = '',
    } = this.props;
    const { adhaarCardNumber: adhaarCardNumberOrigin } = generalDataOrigin;
    const { adhaarCardNumber: adhaarCardNumberTemp } = generalData;
    const getNewAdhaarCard =
      adhaarCardNumberTemp !== adhaarCardNumberOrigin
        ? adhaarCardNumberTemp
        : adhaarCardNumberOrigin;
    dispatch({
      type: 'employeeProfile/fetchAdhaarcardUpdate',
      payload: {
        document: doc._id,
        id: AdhaarCard._id,
        adhaarNumber: getNewAdhaarCard,
        tenantId: tenantCurrentEmployee,
      },
    });
  };

  handleAdd = (id) => {
    const { dispatch, generalData, idCurrentEmployee, tenantCurrentEmployee } = this.props;
    if (!generalData.adhaarCardNumber) return;
    const { adhaarCardNumber } = generalData;
    dispatch({
      type: 'employeeProfile/fetchAdhaarcardAdd',
      payload: {
        document: id,
        employee: idCurrentEmployee,
        adhaarNumber: adhaarCardNumber,
        tenantId: tenantCurrentEmployee,
      },
    });
  };

  handleCanCelIcon = () => {
    const { dispatch, generalData, generalDataOrigin } = this.props;
    const item = { ...generalData, urlFile: '' };
    const isModified = JSON.stringify(item) !== JSON.stringify(generalDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { generalData: item },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  handleGetSetSizeImage = (isLt5M) => {
    this.setState({ isLt5M });
  };

  disabledDate = (current) => {
    // Can not select days after today and today
    return current && current > moment().endOf('day');
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

  render() {
    const { isLt5M, visible, linkImage } = this.state;
    const {
      generalData,
      loading,
      handleCancel = () => {},
      loadingAdhaarCard,
      taxData = {},
      currentUser: { roles = [] },
      locationEmpl: { headQuarterAddress: { country = '' } = {} } = {},
    } = this.props;
    const {
      urlFile = '',
      legalName = '',
      DOB = '',
      legalGender = '',
      employeeId = '',
      workEmail = '',
      workNumber = '',
      adhaarCardNumber = '',
      uanNumber = '',
    } = generalData;
    const nameFile = urlFile ? urlFile.url.split('/') : '';
    const splitURL = nameFile[nameFile.length - 1];
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 9 },
        sm: { span: 12 },
      },
    };
    const nationalIdNumber = taxData.length > 0 ? taxData[0].nationalId : '';
    const formatDate = DOB && moment(DOB);
    const dateFormat = 'MM.DD.YY';
    const checkIndiaLocation = country === 'IN';
    const checkVietNamLocation = country === 'VN';
    const checkUSALocation = country === 'US';

    const permissions = checkPermissions(roles);

    return (
      <Row gutter={[0, 16]} className={styles.root}>
        <Form
          className={styles.Form}
          {...formItemLayout}
          initialValues={{
            legalName,
            legalGender,
            employeeId,
            workEmail,
            workNumber,
            adhaarCardNumber,
            uanNumber,
            nationalId: nationalIdNumber,
            DOB: formatDate,
          }}
          onValuesChange={(changedValues) => this.handleChange(changedValues)}
          onFinish={this.handleSave}
        >
          <Form.Item
            label="Legal Name"
            name="legalName"
            rules={[
              {
                pattern:
                  /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item label="Date of Birth" name="DOB">
            <DatePicker
              format={dateFormat}
              className={styles.dateForm}
              disabledDate={this.disabledDate}
            />
          </Form.Item>
          <Form.Item label="Legal Gender" name="legalGender">
            <Radio.Group>
              <Radio value="Male">Male</Radio>
              <Radio value="Female">Female</Radio>
              <Radio value="Other">Other</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Employee ID" name="employeeId">
            <Input className={styles.inputForm} disabled={permissions.editEmployeeID === -1} />
          </Form.Item>
          <Form.Item
            label="Work Email"
            name="workEmail"
            rules={[
              {
                type: 'email',
                message: formatMessage({ id: 'pages.employeeProfile.validateEmail' }),
              },
            ]}
          >
            <Input className={styles.inputForm} disabled={!(permissions.editWorkEmail !== -1)} />
          </Form.Item>
          <Form.Item
            label="Work Number"
            name="workNumber"
            rules={[
              {
                pattern: /^[+]*[\d]{0,10}$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>

          {checkIndiaLocation ? (
            <>
              <div className={styles.styleUpLoad}>
                <Form.Item
                  label="Adhaar Card Number"
                  name="adhaarCardNumber"
                  rules={[
                    {
                      pattern: /^[+]*[\d]{12,12}$/,
                      message: formatMessage({ id: 'pages.employeeProfile.validateNumber' }),
                    },
                  ]}
                >
                  <Input className={isLt5M ? styles.inputForm : styles.inputFormImageValidate} />
                </Form.Item>
                <>
                  {urlFile === '' ? (
                    <div className={styles.textUpload}>
                      <UploadImage
                        content={isLt5M ? 'Choose file' : `Retry`}
                        name="adhaarCard"
                        setSizeImageMatch={(isImage5M) => this.handleGetSetSizeImage(isImage5M)}
                        getResponse={(resp) => this.handleGetUpLoad(resp)}
                        loading={loadingAdhaarCard}
                      />
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
                </>
              </div>
              {urlFile !== '' ? (
                <Form.Item label="Adhaar Card:" className={styles.labelUpload}>
                  <p
                    onClick={() => this.handleOpenModalReview(urlFile ? urlFile.url : '')}
                    className={styles.urlUpload}
                  >
                    {splitURL}
                  </p>
                </Form.Item>
              ) : (
                ''
              )}
            </>
          ) : null}

          {checkIndiaLocation ? (
            <Form.Item
              label="UAN Number"
              name="uanNumber"
              rules={[
                {
                  pattern: /^[+]*[\d]{0,16}$/,
                  message: formatMessage({ id: 'pages.employeeProfile.validateNumber' }),
                },
              ]}
            >
              <Input className={styles.inputForm} />
            </Form.Item>
          ) : null}

          {checkVietNamLocation ? (
            <Form.Item
              label="National Identification Number"
              name="nationalId"
              rules={[
                {
                  pattern: /^[+]*[\d]{0,16}$/,
                  message: formatMessage({ id: 'pages.employeeProfile.validateNumber' }),
                },
              ]}
            >
              <Input className={styles.inputForm} />
            </Form.Item>
          ) : null}

          {checkUSALocation ? (
            <Form.Item
              label="Social Security Number"
              name="uanNumber"
              rules={[
                {
                  pattern: /^[+]*[\d]{0,16}$/,
                  message: formatMessage({ id: 'pages.employeeProfile.validateNumber' }),
                },
              ]}
            >
              <Input className={styles.inputForm} />
            </Form.Item>
          ) : null}

          <div className={styles.spaceFooter}>
            <div className={styles.cancelFooter} onClick={handleCancel}>
              Cancel
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.buttonFooter}
              loading={loading}
              disabled={isLt5M === false}
            >
              Save
            </Button>
          </div>
          <ViewDocumentModal visible={visible} onClose={this.handleCancel} url={linkImage} />
        </Form>
        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default Edit;
