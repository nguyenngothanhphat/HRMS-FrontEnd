import { DatePicker, Form, Input, Radio, Row, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect, formatMessage } from 'umi';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import styles from './index.less';

const Edit = (props) => {
  const {
    employeeProfile: {
      employee = '',
      employmentData: { location: { headQuarterAddress: { country = {} } = {} } = {} } = {},
    } = {},
    loading,
    handleCancel = () => {},
    user: { permissions = {} },
    dispatch,
    dataAPI = {},
  } = props;

  const {
    legalGender = '',
    legalName = '',
    DOB = '',
    employeeId = '',
    workEmail = '',
    workNumber = '',
    adhaarCardNumber = '',
    uanNumber = '',
  } = dataAPI;

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
  const formatDate = DOB && moment.utc(DOB);
  const dateFormat = 'Do MMMM YYYY';
  const checkIndiaLocation = country?._id === 'IN';
  const checkVietNamLocation = country?._id === 'VN';
  const checkUSALocation = country?._id === 'US';
  const disabledFields = true;
  const disabledTitle = 'Temporarily Disabled - will be enabled shortly.';

  useEffect(() => {
    dispatch({
      type: 'employeeProfile/fetchDocumentCategories',
      payload: {
        page: 'Document Employee',
      },
    });
  }, []);

  const onFinish = async (values) => {
    const fullNameTemp = legalName.split(' ');
    const firstName = fullNameTemp.slice(0, -1).join(' ');
    const lastName = fullNameTemp.slice(-1).join(' ');

    const payload = {
      _id: employee,
      generalInfo: {
        legalGender: values.legalGender,
        legalName: values.legalName,
        firstName: fullNameTemp.length > 1 ? firstName : legalName,
        lastName: fullNameTemp.length > 1 ? lastName : '',
        middleName: '',
        DOB: values.DOB,
        employeeId: values.employeeId,
        workEmail: values.workEmail,
        workNumber: values.workNumber,
        adhaarCardNumber: values.adhaarCardNumber,
        uanNumber: values.uanNumber,
        nationalId: values.nationalId,
      },
    };
    const res = await dispatch({
      type: 'employeeProfile/updateGeneralInfo',
      payload,
    });
    if (res.statusCode === 200) {
      handleCancel();
    }
  };

  const disabledDate = (current) => {
    // Can not select days after today and today
    return current && current > moment().endOf('day');
  };

  return (
    <Row gutter={[0, 16]} className={styles.root}>
      <Form
        className={styles.Form}
        // eslint-disable-next-line react/jsx-props-no-spreading
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
        name="editEmployeeInfoForm"
        onFinish={onFinish}
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
              disabledDate={disabledDate}
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

          {checkIndiaLocation && (
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
                  ]}
                >
                  <Input
                    className={styles.inputForm}
                    disabled={disabledFields}
                    placeholder="Enter the Adhaar Card Number"
                  />
                </Form.Item>
              </Tooltip>
            </div>
          )}

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
          <CustomPrimaryButton htmlType="submit" loading={loading} form="editEmployeeInfoForm">
            Save
          </CustomPrimaryButton>
        </div>
      </Form>
    </Row>
  );
};

export default connect(({ loading, user, employeeProfile }) => ({
  loading: loading.effects['employeeProfile/updateGeneralInfo'],
  loadingAdhaarCard: loading.effects['upload/uploadFile'],
  employeeProfile,
  user,
}))(Edit);
