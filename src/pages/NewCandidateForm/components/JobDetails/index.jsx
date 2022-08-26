import { Button, Card, Col, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK, ONBOARDING_STEPS } from '@/constants/onboarding';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { goToTop } from '@/utils/utils';
import { Page } from '../../utils';
import MessageBox from '../MessageBox';
import NoteComponent from '../NewNoteComponent';
import JobDetailForm from './components/Form';
import styles from './index.less';

const JobDetails = (props) => {
  const {
    dispatch,
    processStatus = '',
    tempData,
    tempData: {
      // list
      locationList = [],
      listCustomerLocation = [],
      managerList = [],
      jobGradeLevelList = [],

      // values
      reportingManager,
      department,
      workLocation,
      workFromHome,
      clientLocation,
      title,
      grade,
      dateOfJoining,
      ticketID = '',
      position,
      employeeType,
    },
    data: { _id },
    data,
    checkMandatory,
    currentStep = '',
    loadingUpdateByHR = false,
    loading,
    loadingFetchCandidate = false,
    loadingLocationList = false,
    loadingLocationCustomerList = false,
    loadingFetchDepartment = false,
    loadingFetchGrade = false,
    companyLocationList = [],
  } = props;

  const { filledJobDetail = false } = checkMandatory;

  const [needRefreshDocument, setNeedRefreshDocument] = useState(false);

  const companyId = getCurrentCompany();
  const tenantId = getCurrentTenant();

  useEffect(() => {
    if (!workLocation) {
      setNeedRefreshDocument(true);
    }
  }, [JSON.stringify(workLocation)]);

  useEffect(() => {
    goToTop();
    if (locationList.length === 0) {
      dispatch({
        type: 'newCandidateForm/fetchLocationList',
        payload: {
          company: companyId,
          tenantId,
        },
      });
    }
    if (jobGradeLevelList.length === 0) {
      dispatch({
        type: 'newCandidateForm/getJobGradeList',
      });
    }

    if (listCustomerLocation.length === 0) {
      dispatch({
        type: 'newCandidateForm/fetchLocationCustomer',
        payload: {
          company: companyId,
          tenantId,
        },
      });
    }

    if (managerList.length === 0) {
      dispatch({
        type: 'newCandidateForm/fetchDepartmentList',
        payload: {
          company: companyId,
          tenantId,
        },
      });
    }
  }, []);

  const checkFilled = () => {
    const check =
      department &&
      (workLocation || workFromHome || clientLocation) &&
      title &&
      reportingManager &&
      dateOfJoining;
    dispatch({
      type: 'newCandidateForm/save',
      payload: {
        checkMandatory: {
          ...checkMandatory,
          filledJobDetail: check,
        },
      },
    });
  };

  useEffect(() => {
    checkFilled();
  }, [JSON.stringify(tempData), JSON.stringify(data), currentStep]);

  const disableEdit = () => {
    return ![
      NEW_PROCESS_STATUS.DRAFT,
      NEW_PROCESS_STATUS.PROFILE_VERIFICATION,
      NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION,
    ].includes(processStatus);
  };

  const getDocumentLayoutByCountry = async () => {
    let countryID = '';
    let workLocation1 = workLocation;
    if (typeof workLocation === 'string') {
      workLocation1 = companyLocationList.find((w) => w._id === workLocation);
    }
    if (clientLocation) {
      listCustomerLocation.forEach((x) => {
        const { location = [] } = x;
        location.forEach((y) => {
          const { state = [] } = y;
          if (state.some((z) => z.value === clientLocation)) {
            countryID = y._id;
          }
        });
      });
    }

    if (workLocation1) {
      countryID = workLocation1?.headQuarterAddress?.country?._id;
    }

    if (countryID) {
      const res = await dispatch({
        type: 'newCandidateForm/fetchDocumentLayoutByCountry',
        payload: {
          country: countryID,
        },
      });
      if (res.statusCode === 200) {
        return res.data;
      }
    }
    return null;
  };

  const onClickNext = async () => {
    const nextStep =
      processStatus === NEW_PROCESS_STATUS.DRAFT
        ? ONBOARDING_STEPS.DOCUMENT_VERIFICATION
        : currentStep;

    let payload = {
      grade,
      dateOfJoining,
      position,
      employeeType,
      workLocation,
      workFromHome,
      clientLocation,
      department,
      title,
      reportingManager,
      candidate: _id,
      currentStep: nextStep,
      tenantId: getCurrentTenant(),
    };

    if (needRefreshDocument) {
      const result = await getDocumentLayoutByCountry();
      if (result) {
        let documentTypeA = [];
        let documentTypeB = [];
        let documentTypeC = [];
        const documentTypeD = [];
        const documentTypeE = [];

        result.forEach((x) => {
          const { type = '' } = x;
          switch (type) {
            case 'A':
              documentTypeA = x.data || [];
              break;
            case 'B':
              documentTypeB = x.data || [];
              break;
            case 'C':
              documentTypeC = x.data || [];
              break;
            case 'D':
              // documentTypeD = [{ data: x.data }];
              break;
            case 'E':
              // documentTypeE = [{ employer: '', data: x.data }];
              break;

            default:
              break;
          }
        });
        payload = {
          ...payload,
          documentTypeA,
          documentTypeB,
          documentTypeC,
          documentTypeD,
          documentTypeE,
          documentLayout: result,
        };

        dispatch({
          type: 'newCandidateForm/saveTemp',
          payload: {
            documentTypeA,
            documentTypeB,
            documentTypeC,
            documentTypeD,
            documentTypeE,
          },
        });
      }
    }

    dispatch({
      type: 'newCandidateForm/updateByHR',
      payload,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        dispatch({
          type: 'newCandidateForm/save',
          payload: {
            currentStep: nextStep,
          },
        });

        history.push(
          `/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.DOCUMENT_VERIFICATION}`,
        );
      }
    });
  };

  const onClickPrev = () => {
    history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.BASIC_INFORMATION}`);
  };

  const _renderBottomBar = () => {
    const renderText = processStatus === NEW_PROCESS_STATUS.DRAFT ? 'Next' : 'Update';

    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col className={styles.bottomBar__button} span={24}>
            <Button
              type="secondary"
              onClick={onClickPrev}
              className={styles.bottomBar__button__secondary}
            >
              Previous
            </Button>
            <Button
              type="primary"
              onClick={onClickNext}
              className={`${styles.bottomBar__button__primary} ${
                !filledJobDetail ? styles.bottomBar__button__disabled : ''
              }`}
              disabled={!filledJobDetail}
              loading={loadingUpdateByHR}
            >
              {renderText}
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  const renderCardTitle = (text, description) => {
    return (
      <div className={styles.cardTitle}>
        <p className={styles.title}>{text}</p>
        <p className={styles.description}>{description}</p>
      </div>
    );
  };
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} xl={16}>
        <Spin
          spinning={
            loading ||
            loadingFetchCandidate ||
            loadingFetchDepartment ||
            loadingLocationList ||
            loadingLocationCustomerList ||
            loadingFetchGrade
          }
        >
          <div className={styles.JobDetailsComponent}>
            <Card
              title={renderCardTitle(
                'Job Details',
                'The details of the position the candidate is being recruited for',
              )}
              className={styles.mainContainer}
            >
              <JobDetailForm
                disabled={disableEdit()}
                validateFields={checkFilled}
                setNeedRefreshDocument={setNeedRefreshDocument}
              />
              <div style={{ padding: '0 24px 24px' }}>
                <RenderAddQuestion page={Page.Job_Details} />
              </div>
            </Card>
            {_renderBottomBar()}
          </div>
        </Spin>
      </Col>
      <Col xs={24} xl={8}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <NoteComponent />
          </Col>
          <Col span={24}>
            <MessageBox />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default connect(
  ({
    newCandidateForm: { rookieId = '', data, checkMandatory, currentStep, tempData } = {},
    loading,
    location: { companyLocationList = [] } = {},
    user: { companiesOfUser = [] } = {},
  }) => ({
    rookieId,
    data,
    checkMandatory,
    currentStep,
    tempData,
    companyLocationList,
    companiesOfUser,
    loadingFetchCandidate: loading.effects['newCandidateForm/fetchCandidateByRookie'],
    loadingUpdateByHR: loading.effects['newCandidateForm/updateByHR'],
    loadingLocationList: loading.effects['newCandidateForm/fetchLocationList'],
    loadingLocationCustomerList: loading.effects['newCandidateForm/fetchLocationCustomer'],
    loadingFetchTitle: loading.effects['newCandidateForm/fetchTitleList'],
    loadingFetchDepartment: loading.effects['newCandidateForm/fetchDepartmentList'],
    loadingFetchJobGrade: loading.effects['newCandidateForm/getJobGradeList'],
  }),
)(JobDetails);
