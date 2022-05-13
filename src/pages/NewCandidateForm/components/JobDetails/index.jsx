import { Button, Col, Row, Spin } from 'antd';
import React, { useEffect } from 'react';
import { connect, history } from 'umi';
import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK } from '@/utils/onboarding';
import { Page } from '../../utils';
import MessageBox from '../MessageBox';
import NoteComponent from '../NewNoteComponent';
import JobDetailForm from './components/Form';
import Header from './components/Header';
import styles from './index.less';
import { goToTop } from '@/utils/utils';

// Thứ tự Fields Work Location Job Title Department Reporting Manager
const JobDetails = (props) => {
  const {
    dispatch,
    processStatus = '',
    tempData,
    tempData: {
      // list
      locationList = [],
      departmentList = [],
      managerList = [],
      jobGradeLevelList = [],

      // values
      reportingManager,
      department,
      workLocation,
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
    loadingFetchTitle = false,
    loadingFetchDepartment = false,
    loadingFetchManager = false,
    loadingFetchGrade = false,
  } = props;

  const { filledJobDetail = false } = checkMandatory;

  const companyId = getCurrentCompany();
  const tenantId = getCurrentTenant();

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

    if (departmentList.length === 0) {
      dispatch({
        type: 'newCandidateForm/fetchManagerList',
        payload: {
          company: companyId,
          status: ['ACTIVE'],
          // location: locationPayload,
          tenantId: getCurrentTenant(),
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
    const check = department && workLocation && title && reportingManager && dateOfJoining;

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

  const onClickNext = () => {
    dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        grade,
        dateOfJoining,
        position,
        employeeType,
        workLocation,
        department,
        title,
        reportingManager,
        candidate: _id,
        currentStep: processStatus === NEW_PROCESS_STATUS.DRAFT ? 2 : currentStep,
        tenantId: getCurrentTenant(),
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        dispatch({
          type: 'newCandidateForm/save',
          payload: {
            currentStep: processStatus === NEW_PROCESS_STATUS.DRAFT ? 2 : currentStep,
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

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} xl={16}>
        <Spin
          spinning={
            loading ||
            loadingFetchCandidate ||
            loadingFetchDepartment ||
            loadingLocationList ||
            loadingFetchGrade ||
            loadingFetchTitle ||
            loadingFetchManager
          }
        >
          <div className={styles.JobDetailsComponent}>
            <div className={styles.mainContainer}>
              <Header />
              <JobDetailForm disabled={disableEdit()} validateFields={checkFilled} />
              <Row style={{ margin: '0 32px 32px' }}>
                <RenderAddQuestion page={Page.Job_Details} />
              </Row>
            </div>
            {_renderBottomBar()}
          </div>
        </Spin>
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
    loadingFetchTitle: loading.effects['newCandidateForm/fetchTitleList'],
    loadingFetchDepartment: loading.effects['newCandidateForm/fetchDepartmentList'],
    loadingFetchManager: loading.effects['newCandidateForm/fetchManagerList'],
    loadingFetchJobGrade: loading.effects['newCandidateForm/getJobGradeList'],
  }),
)(JobDetails);
