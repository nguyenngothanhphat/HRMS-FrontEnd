import { Button, Card, Col, Form, Row, Skeleton } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect } from 'react';
import { connect, history } from 'umi';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK } from '@/utils/onboarding';
import { getCurrentTenant } from '@/utils/authority';
import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import { Page } from '../../utils';
import MessageBox from '../MessageBox';
import NoteComponent from '../NewNoteComponent';
import Address from './components/Address';
import BasicInfo from './components/BasicInfo';
import styles from './index.less';

const BasicInformation = (props) => {
  const {
    tempData,
    tempData: {
      firstName,
      middleName,
      lastName,
      privateEmail,
      phoneNumber,
      workEmail,
      checkStatus,
      _id,
      ticketID = '',
      processStatus = '',
      previousExperience,
      employeeId,
    } = {},
    checkMandatory,
    dispatch,
    currentStep = '',
    loadingFetchCandidate = false,
    loadingUpdateByHR = false,
  } = props;

  const { filledBasicInformation } = checkMandatory;
  const [isSameAddress, setIsSameAddress] = React.useState(false);

  const [form] = Form.useForm();

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
    if (
      firstName &&
      lastName &&
      privateEmail &&
      phoneNumber &&
      notSpace.test(firstName) &&
      notSpace.test(middleName) &&
      notSpace.test(lastName) &&
      emailRegExp.test(privateEmail)
    ) {
      checkStatus.filledBasicInformation = true;
    } else {
      checkStatus.filledBasicInformation = false;
    }
    dispatch({
      type: 'newCandidateForm/save',
      payload: {
        checkMandatory: {
          ...checkMandatory,
          filledBasicInformation: checkStatus.filledBasicInformation,
        },
      },
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 77, behavior: 'smooth' });
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
        currentStep: processStatus === NEW_PROCESS_STATUS.DRAFT ? 1 : currentStep,
        tenantId: getCurrentTenant(),
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        dispatch({
          type: 'newCandidateForm/save',
          payload: {
            currentStep: processStatus === NEW_PROCESS_STATUS.DRAFT ? 1 : currentStep,
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
    {
      component: <RenderAddQuestion page={Page.Basic_Information} />,
      noHeader: true,
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
    <Row gutter={[24, 0]} className={styles.BasicInformation}>
      {loadingFetchCandidate ? (
        <div className={styles.viewLoading}>
          <Skeleton />
        </div>
      ) : (
        <>
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
                employeeId,
                phoneNumber,
              }}
              form={form}
              onValuesChange={onValuesChange}
              onFinish={onFinish}
            >
              <Row gutter={[24, 24]}>
                {cards.map((x) => (
                  <Col span={24}>
                    <Card title={x.noHeader ? null : renderCardTitle(x.title, x.description)}>
                      <div style={x.noHeader ? { padding: 24 } : {}}>{x.component}</div>
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
                <NoteComponent />
              </Row>
              <Row>
                <MessageBox />
              </Row>
            </div>
          </Col>
        </>
      )}
    </Row>
  );
};

export default connect(
  ({ newCandidateForm: { data, checkMandatory, currentStep, tempData } = {}, loading }) => ({
    data,
    checkMandatory,
    currentStep,
    tempData,
    loadingFetchCandidate: loading.effects['newCandidateForm/fetchCandidateByRookie'],
    loadingUpdateByHR: loading.effects['newCandidateForm/updateByHR'],
  }),
)(BasicInformation);
