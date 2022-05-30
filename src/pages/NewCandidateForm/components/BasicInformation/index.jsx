import { Button, Card, Col, Form, Row } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect } from 'react';
import { connect, history } from 'umi';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK, ONBOARDING_STEPS } from '@/utils/onboarding';
import { getCurrentTenant } from '@/utils/authority';
import MessageBox from '../MessageBox';
import NoteComponent from '../NewNoteComponent';
import Address from './components/Address';
import BasicInfo from './components/BasicInfo';
import styles from './index.less';
import { goToTop } from '@/utils/utils';

const BasicInformation = (props) => {
  const {
    tempData,
    tempData: {
      firstName = '',
      middleName = '',
      lastName = '',
      privateEmail = '',
      phoneNumber = '',
      totalExperience = '',
      workEmail = '',
      _id = '',
      ticketID = '',
      processStatus = '',
      previousExperience = '',
      employeeId,
      currentAddress: {
        addressLine1: currentAddressLine1,
        addressLine2: currentAddressLine2,
        city: currentCity,
        country: currentCountry,
        state: currentState,
        zipCode: currentZipCode,
      } = {},
      permanentAddress: {
        addressLine1: permanentAddressLine1,
        addressLine2: permanentAddressLine2,
        city: permanentCity,
        country: permanentCountry,
        state: permanentState,
        zipCode: permanentZipCode,
      } = {},
    } = {},
    checkMandatory,
    dispatch,
    currentStep = '',
    loadingUpdateByHR = false,
  } = props;

  const { filledBasicInformation } = checkMandatory;
  const [isSameAddress, setIsSameAddress] = React.useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (
      Object.keys(tempData.currentAddress || {}).length > 0 &&
      Object.keys(tempData.permanentAddress || {}).length > 0
    ) {
      const keys = Object.keys(tempData.currentAddress || {});
      const check = keys.every((x) => tempData.currentAddress[x] === tempData.permanentAddress[x]);
      setIsSameAddress(check);
    }
  }, [JSON.stringify(tempData)]);

  const disabled = ![
    NEW_PROCESS_STATUS.DRAFT,
    NEW_PROCESS_STATUS.PROFILE_VERIFICATION,
    NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION,
  ].includes(processStatus);

  const checkFilled = () => {
    const notSpace = RegExp(/[^\s-]/);
    const emailRegExp = RegExp(
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
    );
    let check = false;
    const phoneRegExp = RegExp(
      // eslint-disable-next-line no-useless-escape
      /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[0-9]\d?)\)?)?[\-\.\ ]?)?((?:\(?\d{1,}\)?[\-\.\ ]?){0,})(?:[\-\.\ ]?(?:#|ext\.?|extension|x)[\-\.\ ]?(\d+))?$/gm,
    );
    if (
      firstName &&
      lastName &&
      privateEmail &&
      phoneNumber &&
      notSpace.test(firstName) &&
      notSpace.test(middleName) &&
      notSpace.test(lastName) &&
      emailRegExp.test(privateEmail) &&
      phoneRegExp.test(phoneNumber)
    ) {
      check = true;
    } else {
      check = false;
    }
    dispatch({
      type: 'newCandidateForm/save',
      payload: {
        checkMandatory: {
          ...checkMandatory,
          filledBasicInformation: check,
        },
      },
    });
  };

  useEffect(() => {
    goToTop();
    if (_id) {
      checkFilled();
    }
  }, []);

  useEffect(() => {
    checkFilled();
  }, [JSON.stringify(tempData)]);

  const onValidate = debounce((values) => {
    dispatch({
      type: 'newCandidateForm/save',
      payload: {
        tempData: { ...tempData, ...values },
      },
    });
  }, 500);

  const onChangeAddress = (values) => {
    form.setFieldsValue({
      permanentAddressLine1: values.currentAddressLine1,
      permanentAddressLine2: values.currentAddressLine2,
      permanentCountry: values.currentCountry,
      permanentState: values.currentState,
      permanentCity: values.currentCity,
      permanentZipCode: values.currentZipCode,
    });
  };

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    onValidate(values);
    if (isSameAddress) {
      onChangeAddress(values);
    }
  };

  const onFinish = (values) => {
    const nextStep =
      processStatus === NEW_PROCESS_STATUS.DRAFT ? ONBOARDING_STEPS.JOB_DETAILS : currentStep;

    dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        privateEmail: values.privateEmail,
        workEmail: values.workEmail,
        previousExperience: values.previousExperience,
        candidate: _id,
        currentStep: nextStep,
        totalExperience: values.totalExperience,
        phoneNumber: values.phoneNumber,
        tenantId: getCurrentTenant(),
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        dispatch({
          type: 'newCandidateForm/save',
          payload: {
            currentStep: nextStep,
          },
        });
        history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.JOB_DETAILS}`);
      }
    });
  };

  const testValidate = () => {
    const email1 = form.getFieldValue('privateEmail');
    const email2 = form.getFieldValue('workEmail');
    if ((email2 && email1) || email2 === '') {
      form.validateFields();
    }
  };

  const onSameAddress = (e) => {
    const values = form.getFieldsValue();
    if (e.target.checked) {
      setIsSameAddress(true);
      onChangeAddress(values);
    } else {
      setIsSameAddress(false);
    }
  };

  const _renderBottomBar = () => {
    const renderText = ![
      NEW_PROCESS_STATUS.PROFILE_VERIFICATION,
      NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION,
    ].includes(processStatus)
      ? 'Next'
      : 'Update';

    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={24}>
            <div className={styles.bottomBar__button}>
              <Button
                type="primary"
                htmlType="submit"
                className={`${styles.bottomBar__button__primary} ${
                  !filledBasicInformation ? styles.bottomBar__button__disabled : ''
                }`}
                disabled={!filledBasicInformation}
                loading={loadingUpdateByHR}
              >
                {renderText}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const cards = [
    {
      component: <BasicInfo testValidate={testValidate} disabled={disabled} />,

      title: 'Basic Information',
      description: 'Information of the new joinee goes here',
    },
    {
      component: (
        <Address disabled onSameAddress={onSameAddress} isSameAddress={isSameAddress} form={form} />
      ),
      title: 'Current Address',
      description: 'This information needs to be filled out by the candidate',
    },
  ];

  const renderCardTitle = (title, description) => {
    return (
      <div className={styles.cardTitle}>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
      </div>
    );
  };

  return (
    <div className={styles.BasicInformation}>
      <Row gutter={[24, 24]}>
        <Col xs={24} xl={16}>
          <Form
            wrapperCol={{ span: 24 }}
            name="basic"
            initialValues={{
              firstName,
              middleName,
              lastName,
              privateEmail,
              workEmail,
              previousExperience,
              totalExperience,
              employeeId,
              phoneNumber,
              currentAddressLine1,
              currentAddressLine2,
              currentCity,
              currentCountry,
              currentState,
              currentZipCode,
              permanentAddressLine1,
              permanentAddressLine2,
              permanentCity,
              permanentCountry,
              permanentState,
              permanentZipCode,
            }}
            form={form}
            onValuesChange={onValuesChange}
            onFinish={onFinish}
          >
            <Row gutter={[24, 24]}>
              {cards.map((x) => (
                <Col span={24}>
                  <Card title={renderCardTitle(x.title, x.description)}>
                    <div>{x.component}</div>
                  </Card>
                </Col>
              ))}

              <Col span={24}>{_renderBottomBar()}</Col>
            </Row>
          </Form>
        </Col>
        <Col className={styles.RightComponents} xs={24} xl={8}>
          <div className={styles.rightWrapper}>
            <Row>
              <Col span={24}>
                <NoteComponent />
              </Col>
              <Col span={24}>
                <MessageBox />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(
  ({ newCandidateForm: { data, checkMandatory, currentStep, tempData } = {}, loading }) => ({
    data,
    checkMandatory,
    currentStep,
    tempData,
    loadingUpdateByHR: loading.effects['newCandidateForm/updateByHR'],
  }),
)(BasicInformation);
