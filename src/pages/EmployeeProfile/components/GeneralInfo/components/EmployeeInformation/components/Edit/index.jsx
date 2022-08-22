/* eslint-disable react/jsx-props-no-spreading */
import { DatePicker, Form, Input, Radio, Row, Tooltip } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect, formatMessage } from 'umi';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import UploadImage from '@/components/UploadImage';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { checkPermissions } from '@/utils/permissions';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeProfile: {
      AdhaarCard = {},
      employee = '',
      originData: {
        generalData: generalDataOrigin = {},
        employmentData: { location: locationProp = {} } = {},
        taxData = {},
      } = {},
      tempData: { generalData = {} } = {},

      documentCategories = [],
    } = {},
    upload: { employeeInformationURL = '' },
    user: { currentUser = [] },
  }) => ({
    loading: loading.effects['employeeProfile/updateGeneralInfo'],
    loadingAdhaarCard: loading.effects['upload/uploadFile'],
    generalDataOrigin,
    generalData,
    employeeInformationURL,
    employee,
    AdhaarCard,
    taxData,
    currentUser,

    documentCategories,
    locationProp,
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
    const { generalData: generalDataTemp } = this.props;
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
      nationalId = uanNumber,
      _id: id = '',
    } = generalDataTemp;

    const fullNameTemp = legalName.split(' ');
    const firstName = fullNameTemp.slice(0, -1).join(' ');
    const lastName = fullNameTemp.slice(-1).join(' ');

    return {
      id,
      urlFile,
      legalGender,
      legalName,
      firstName: fullNameTemp.length > 1 ? firstName : legalName,
      lastName: fullNameTemp.length > 1 ? lastName : '',
      middleName: '',
      DOB,
      employeeId,
      workEmail,
      workNumber,
      adhaarCardNumber,
      uanNumber,
      nationalId,
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
      'lastName',
      'middleName',
      'DOB',
      'employeeId',
      'workEmail',
      'workNumber',
      'adhaarCardNumber',
      'uanNumber',
      'nationalId',
    ];
    listKey.forEach((item) => delete newObj[item]);
    return newObj;
  };

  handleSave = () => {
    const { dispatch, locationProp: { headQuarterAddress: { country = {} } = {} } = {} } =
      this.props;
    const payload = this.processDataChanges() || {};
    // const tenantId = localStorage.getItem('tenantId');
    const dataTempKept = this.processDataKept() || {};
    if (country?._id === 'IN') {
      this.handleUpLoadAdhaarCard();
    }
    dispatch({
      type: 'employeeProfile/updateGeneralInfo',
      payload,
      dataTempKept,
      key: 'openEmployeeInfo',
    });
  };

  handleUpLoadAdhaarCard = () => {
    const {
      dispatch,
      employee = '',
      AdhaarCard = {},
      generalData = {},
      documentCategories = [],
    } = this.props;

    let file = '';
    const { urlFile } = generalData;
    if (urlFile) {
      file = urlFile;
    }

    if (file || generalData.adhaarCardNumber) {
      const indentityCategory = documentCategories.find((child) => child.name === 'Indentity');

      if (!AdhaarCard || Object.keys(AdhaarCard).length === 0) {
        dispatch({
          type: 'employeeProfile/fetchDocumentAdd',
          payload: {
            key: 'Adhaar Card',
            attachment: file.id,
            category: indentityCategory?._id,
            employee,
          },
        }).then((id) => {
          dispatch({
            type: 'employeeProfile/fetchAdhaarcardAdd',
            payload: {
              document: id,
              employee,
              adhaarNumber: generalData.adhaarCardNumber,
            },
          });
        });
      } else if (!AdhaarCard.document || Object.keys(AdhaarCard.document).length === 0) {
        dispatch({
          type: 'employeeProfile/fetchDocumentAdd',
          payload: {
            key: 'Adhaar Card',
            attachment: file?.id,
            category: indentityCategory?._id,
            employee,
          },
        }).then((id) => this.handleUpdateAdhaarCard(id));
      } else {
        dispatch({
          type: 'employeeProfile/fetchDocumentUpdate',
          payload: {
            attachment: file?.id,
            id: AdhaarCard?.document?._id,
            category: indentityCategory?._id,
          },
        }).then((doc) => this.handleUpdateAdhaarCard(doc));
      }
    }
  };

  handleGetUpLoad = (resp) => {
    const { data = [] } = resp;
    const [first] = data;
    const value = { id: first.id, url: first.url };
    const url = { urlFile: value };
    this.handleChange(url);
  };

  handleUpdateAdhaarCard = (doc) => {
    const { dispatch, AdhaarCard, generalDataOrigin, generalData } = this.props;
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
      // taxData = {},
      currentUser: { roles = [] },
      locationProp: { headQuarterAddress: { country = {} } = {} } = {},
      AdhaarCard = {},
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
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 9 },
        sm: { span: 12 },
      },
    };
    // const nationalIdNumber = taxData.length > 0 ? taxData[0].nationalId : '';
    const formatDate = DOB && moment.utc(DOB);
    const dateFormat = 'Do MMMM YYYY';
    const checkIndiaLocation = country?._id === 'IN';
    const checkVietNamLocation = country?._id === 'VN';
    const checkUSALocation = country?._id === 'US';

    const permissions = checkPermissions(roles);
    const disabledFields = true;
    const disabledTitle = 'Temporarily Disabled - will be enabled shortly.';

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
            DOB: formatDate,
          }}
          onValuesChange={(changedValues) => this.handleChange(changedValues)}
          onFinish={this.handleSave}
        >
          <div className={styles.formContainer}>
            <Form.Item
              label="Full Name"
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
            <Form.Item label="Gender" name="legalGender">
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
              <Input
                className={styles.inputForm}
                disabled={!(permissions.editWorkEmail !== -1)}
                placeholder="Enter the Work Email"
              />
            </Form.Item>
            <Form.Item
              label="Work Number"
              name="workNumber"
              rules={[
                {
                  pattern:
                    // eslint-disable-next-line no-useless-escape
                    /^(?=.{0,25}$)((?:(?:\(?(?:00|\+)([1-4]\d\d|[0-9]\d?)\)?)?[\-\.\ ]?)?((?:\(?\d{1,}\)?[\-\.\ ]?){0,})(?:[\-\.\ ]?(?:#|ext\.?|extension|x)[\-\.\ ]?(\d+))?)$/gm,
                  message: formatMessage({
                    id: 'pages.employeeProfile.validateWorkNumber',
                  }),
                },
              ]}
            >
              <Input className={styles.inputForm} placeholder="Enter the Work Number" />
            </Form.Item>

            {checkIndiaLocation ? (
              <>
                <div className={styles.styleUpLoad}>
                  <Tooltip title={disabledTitle}>
                    <Form.Item
                      label="Adhaar Card Number"
                      name="adhaarCardNumber"
                      rules={[
                        {
                          pattern: /^[+]*[\d]{12,12}$/,
                          message: formatMessage({ id: 'pages.employeeProfile.validateNumber' }),
                        },
                        {
                          required: !!AdhaarCard.document && !disabledFields,
                          message: 'Please input your adhaar card number!',
                        },
                      ]}
                    >
                      <Input
                        className={isLt5M ? styles.inputForm : styles.inputFormImageValidate}
                        disabled={disabledFields}
                        placeholder="Enter the Adhaar Card Number"
                      />
                    </Form.Item>
                  </Tooltip>
                  <>
                    {!urlFile || !AdhaarCard.document ? (
                      <div className={styles.textUpload}>
                        <UploadImage
                          content={isLt5M ? 'Choose file' : `Retry`}
                          name="adhaarCard"
                          setSizeImageMatch={(isImage5M) => this.handleGetSetSizeImage(isImage5M)}
                          getResponse={(resp) => this.handleGetUpLoad(resp)}
                          loading={loadingAdhaarCard}
                          disabledFields={disabledFields}
                        />
                      </div>
                    ) : (
                      <div className={styles.viewUpLoadData}>
                        {/* <p
                          onClick={() => this.handleOpenModalReview(urlFile ? urlFile.url : '')}
                          className={styles.viewUpLoadDataURL}
                        >
                          {splitURL || AdhaarCard?.document?.attachment?.name}
                        </p> */}

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
                {urlFile || AdhaarCard.document?.attachment ? (
                  <Form.Item label="Uploaded file:" className={styles.labelUpload}>
                    <p
                      onClick={() => this.handleOpenModalReview(urlFile ? urlFile.url : '')}
                      className={styles.urlUpload}
                    >
                      {splitURL || AdhaarCard.document?.attachment?.name}
                    </p>
                  </Form.Item>
                ) : (
                  ''
                )}
              </>
            ) : null}

            {checkIndiaLocation ? (
              <Tooltip title={disabledTitle}>
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
                  <Input
                    className={styles.inputForm}
                    disabled={disabledFields}
                    placeholder="Enter the UAN Number"
                  />
                </Form.Item>
              </Tooltip>
            ) : null}

            {checkVietNamLocation ? (
              <Tooltip title={disabledTitle}>
                <Form.Item
                  label="National Identification Number"
                  name="uanNumber"
                  rules={[
                    {
                      pattern: /^[+]*[\d]{0,16}$/,
                      message: formatMessage({ id: 'pages.employeeProfile.validateNumber' }),
                    },
                  ]}
                >
                  <Input
                    className={styles.inputForm}
                    disabled={disabledFields}
                    placeholder="Enter the National Identification Number"
                  />
                </Form.Item>
              </Tooltip>
            ) : null}

            {checkUSALocation ? (
              <Tooltip title={disabledTitle}>
                <Form.Item
                  label="Social Security Number"
                  name="uanNumber"
                  rules={[
                    {
                      pattern: /^[0-9\\-]{0,12}$/,
                      message: formatMessage({
                        id: 'pages.employeeProfile.validateSocialSecurityNumber',
                      }),
                    },
                  ]}
                >
                  <Input
                    className={styles.inputForm}
                    disabled={disabledFields}
                    placeholder="Enter the Social Security Number"
                  />
                </Form.Item>
              </Tooltip>
            ) : null}
          </div>
          <div className={styles.spaceFooter}>
            <CustomSecondaryButton onClick={handleCancel}>Cancel</CustomSecondaryButton>
            <CustomPrimaryButton htmlType="submit" loading={loading} disabled={isLt5M === false}>
              Save
            </CustomPrimaryButton>
          </div>
          <ViewDocumentModal visible={visible} onClose={this.handleCancel} url={linkImage} />
        </Form>
        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default Edit;
