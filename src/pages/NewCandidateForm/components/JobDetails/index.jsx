import React, { PureComponent } from 'react';
import { Row, Col, Button, Skeleton } from 'antd';
import { connect, formatMessage, history } from 'umi';
import { isEmpty } from 'lodash';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK } from '@/utils/onboarding';
import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import Header from './components/Header';
import RadioComponent from './components/RadioComponent';
import FieldsComponent from './components/FieldsComponent';

import NoteComponent from '../NewNoteComponent';
import MessageBox from '../MessageBox';
import { Page } from '../../utils';
import styles from './index.less';
// Thứ tự Fields Work Location Job Title Department Reporting Manager
@connect(
  ({
    newCandidateForm: { rookieId = '', data, checkMandatory, currentStep, tempData } = {},
    loading,
    locationSelection: { listLocationsByCompany = [] } = {},
    user: { companiesOfUser = [] } = {},
  }) => ({
    rookieId,
    data,
    checkMandatory,
    currentStep,
    tempData,
    listLocationsByCompany,
    companiesOfUser,
    loadingFetchCandidate: loading.effects['newCandidateForm/fetchCandidateByRookie'],
    loadingUpdateByHR: loading.effects['newCandidateForm/updateByHR'],
    loadingLocationList: loading.effects['newCandidateForm/fetchLocationList'],
  }),
)
class JobDetails extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;

    const companyId = getCurrentCompany();
    const tenantId = getCurrentTenant();

    window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page

    // this.checkFilled();

    // get work location list
    dispatch({
      type: 'newCandidateForm/fetchLocationList',
      payload: {
        company: companyId,
        tenantId,
      },
    });
    dispatch({
      type: 'newCandidateForm/getJobGradeList',
    });
  }

  componentDidUpdate = (prevProps) => {
    const { data = {}, tempData = {} } = this.props;

    if (
      JSON.stringify(prevProps.data) !== JSON.stringify(data) ||
      JSON.stringify(prevProps.tempData) !== JSON.stringify(tempData)
    ) {
      this.checkFilled();
    }
  };

  disableEdit = () => {
    const { processStatus } = this.props;

    return ![
      NEW_PROCESS_STATUS.DRAFT,
      NEW_PROCESS_STATUS.PROFILE_VERIFICATION,
      NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION,
    ].includes(processStatus);
  };

  checkFilled = () => {
    const {
      tempData: {
        department,
        workLocation,
        title,
        reportingManager,
        checkStatus,
        prefferedDateOfJoining,
      },
      checkMandatory,
      dispatch,
    } = this.props;

    if (department && workLocation && title && reportingManager && prefferedDateOfJoining) {
      if (reportingManager?._id) {
        checkStatus.filledJobDetail = true;
      } else {
        checkStatus.filledJobDetail = true;
      }
    } else {
      checkStatus.filledJobDetail = false;
    }

    dispatch({
      type: 'newCandidateForm/save',
      payload: {
        checkMandatory: {
          ...checkMandatory,
          filledJobDetail: checkStatus.filledJobDetail,
        },
      },
    });
  };

  handleRadio = (e) => {
    const { target } = e;
    const { name, value } = target;
    const { dispatch } = this.props;
    const { tempData = {} } = this.props;

    if (name === 'position') {
      tempData[name] = value;
    } else {
      tempData[name] = {
        _id: value,
      };
    }

    dispatch({
      type: 'newCandidateForm/save',
      payload: {
        tempData: {
          ...tempData,
        },
      },
    });
  };

  _handleSelect = async (value, name) => {
    const { dispatch } = this.props;
    const { tempData = {} } = this.props;
    tempData[name] = value;
    const { department, workLocation, title, locationList = [], titleList } = tempData;
    const companyId = getCurrentCompany();
    const tenantId = getCurrentTenant();

    if (name === 'jobGradeLevel') {
      if (value === undefined) {
        await dispatch({
          type: 'newCandidateForm/save',
          payload: {
            tempData: {
              ...tempData,
              grade: null,
            },
          },
        });
      } else {
        dispatch({
          type: 'newCandidateForm/saveTemp',
          payload: {
            grade: value,
          },
        });
      }
    } else if (name === 'workLocation') {
      const changedWorkLocation = JSON.parse(JSON.stringify(locationList));
      const selectedWorkLocation = changedWorkLocation.find((data) => data._id === value);

      if (value === undefined) {
        await dispatch({
          type: 'newCandidateForm/save',
          payload: {
            tempData: {
              ...tempData,
              workLocation: null,
            },
          },
        });
      } else {
        dispatch({
          type: 'newCandidateForm/saveTemp',
          payload: {
            company: companyId,
            location: value,
            workLocation: selectedWorkLocation,
          },
        });

        if (!isEmpty(workLocation)) {
          dispatch({
            type: 'newCandidateForm/fetchDepartmentList',
            payload: {
              company: companyId,
              tenantId,
            },
          });
          // dispatch({
          //   type: 'newCandidateForm/fetchAndChangeDocumentSet',
          //   payload: {
          //     rookieID: rookieId,
          //     tenantId: getCurrentTenant(),
          //   },
          // });
        }
      }
    } else if (name === 'title') {
      if (value === undefined) {
        await dispatch({
          type: 'newCandidateForm/saveTemp',
          payload: {
            title: null,
          },
        });
      } else {
        const titleData = titleList.find((item) => item._id === value);
        dispatch({
          type: 'newCandidateForm/saveTemp',
          payload: {
            title: value,
            grade: titleData?.gradeObj,
            // jobGradeLevelList: [titleData?.gradeObj],
          },
        });

        if (!isEmpty(title)) {
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
      }
    } else if (name === 'department') {
      if (value === undefined) {
        await dispatch({
          type: 'newCandidateForm/saveTemp',
          payload: {
            department: null,
          },
        });
      } else {
        dispatch({
          type: 'newCandidateForm/saveTemp',
          payload: {
            company: companyId,
            department: value, // {}
          },
        });

        if (!isEmpty(department)) {
          // const departmentTemp = [department];
          // const locationTemp = [location._id];
          dispatch({
            type: 'newCandidateForm/fetchTitleList',
            payload: {
              department,
              tenantId,
            },
          });
          await dispatch({
            type: 'newCandidateForm/saveTemp',
            payload: {
              title: null,
              department: value,
            },
          });
        }
      }
    } else if (name === 'reportingManager') {
      const { tempData: { managerList = [] } = {} } = this.props;
      const reportingManager = managerList.find((m) => m._id === value) || {};
      dispatch({
        type: 'newCandidateForm/saveTemp',
        payload: {
          reportingManager,
        },
      });
    } else if (name === 'prefferedDateOfJoining') {
      const { prefferedDateOfJoining } = tempData;
      dispatch({
        type: 'newCandidateForm/saveTemp',
        payload: {
          dateOfJoining: prefferedDateOfJoining,
        },
      });
    } else if (name === 'reportees') {
      dispatch({
        type: 'newCandidateForm/saveTemp',
        payload: {
          reportees: value,
        },
      });
    }
    this.checkFilled();
  };

  onClickNext = () => {
    const {
      data: { _id },
      tempData: {
        processStatus = '',
        grade,
        position,
        employeeType,
        workLocation,
        department,
        title,
        reportingManager,
        dateOfJoining,
        documentChecklistSetting,
        ticketID = '',
        reportees = [],
      },
      currentStep = '',
    } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        grade,
        dateOfJoining,
        position,
        employeeType: employeeType ? employeeType._id : '',
        workLocation: workLocation ? workLocation._id : '',
        department,
        title,
        reportingManager: reportingManager ? reportingManager._id : '',
        candidate: _id,
        currentStep: processStatus === NEW_PROCESS_STATUS.DRAFT ? 2 : currentStep,
        tenantId: getCurrentTenant(),
        documentChecklistSetting,
        reportees,
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

  onClickPrev = () => {
    // const { currentStep } = this.props;
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'newCandidateForm/save',
    //   payload: {
    //     currentStep: currentStep - 1,
    //   },
    // });
    const {
      tempData: { ticketID = '' },
    } = this.props;
    history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.BASIC_INFORMATION}`);
  };

  _renderBottomBar = () => {
    const {
      checkMandatory,
      loadingUpdateByHR = false,
      tempData: { processStatus = '' } = {},
    } = this.props;
    const { filledJobDetail } = checkMandatory;

    const renderText = processStatus === NEW_PROCESS_STATUS.DRAFT ? 'Next' : 'Update';

    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col className={styles.bottomBar__button} span={24}>
            <Button
              type="secondary"
              onClick={this.onClickPrev}
              className={styles.bottomBar__button__secondary}
            >
              Previous
            </Button>
            <Button
              type="primary"
              onClick={this.onClickNext}
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

  render() {
    const Tab = {
      positionTab: {
        title: formatMessage({ id: 'component.jobDetail.positionTab' }),
        name: 'position',
        arr: [
          {
            value: 'EMPLOYEE',
            position: formatMessage({ id: 'component.jobDetail.positionTabRadio1' }),
          },
          {
            value: 'CONTINGENT-WORKER',
            position: formatMessage({ id: 'component.jobDetail.positionTabRadio2' }),
          },
        ],
      },
      classificationTab: {
        title: formatMessage({ id: 'component.jobDetail.classificationTab' }),
        name: 'employeeType',
        arr: [
          {
            value: 1,
            classification: formatMessage({ id: 'component.jobDetail.classificationRadio2' }),
          },
          {
            value: 2,
            classification: formatMessage({ id: 'component.jobDetail.classificationRadio3' }),
          },
          {
            value: 3,
            classification: formatMessage({ id: 'component.jobDetail.classificationRadio1' }),
          },
        ],
      },
    };
    const dropdownField = [
      {
        title: 'workLocation',
        name: `${formatMessage({ id: 'component.jobDetail.workLocation' })}*`,
        id: 1,
        placeholder: 'Select a work location',
      },
      {
        title: 'department',
        name: `${formatMessage({ id: 'component.jobDetail.department' })}*`,
        id: 2,
        placeholder: 'Select a department',
      },
      {
        title: 'title',
        name: 'Job Title*',
        id: 3,
        placeholder: 'Select a job title',
      },
      {
        title: 'grade',
        name: `${formatMessage({ id: 'component.jobDetail.jobGrade' })}*`,
        id: 4,
        placeholder: 'Select a grade',
      },

      {
        title: 'reportingManager',
        name: `${formatMessage({ id: 'component.jobDetail.reportingManager' })}*`,
        id: 5,
        placeholder: 'Select a reporting manager',
      },
      {
        title: 'reportees',
        name: 'Reportees',
        id: 6,
        placeholder: 'Please select a choice',
      },
    ];
    const candidateField = [
      {
        title: `candidatesNoticePeriod`,
        name: formatMessage({ id: 'component.jobDetail.candidateNoticePeriod' }),
        id: 1,
        placeholder: 'Time period',
        Option: [
          { key: 1, value: 'Test' },
          { key: 2, value: 'ABCD' },
          { key: 3, value: 'Testing' },
          { key: 4, value: '10AM' },
          { key: 5, value: '5PM' },
          { key: 6, value: 'For Hours' },
        ],
      },
      {
        title: 'prefferedDateOfJoining',
        name: formatMessage({ id: 'component.jobDetail.prefferedDateOfJoining' }),
        id: 2,
      },
    ];

    const {
      tempData,
      tempData: { employeeTypeList, position, employeeType },
      data,
    } = this.props;
    const { loading, loadingFetchCandidate, processStatus, loadingLocationList } = this.props;

    return (
      <>
        <Row gutter={[24, 0]}>
          {loadingFetchCandidate || loading || loadingLocationList ? (
            <div className={styles.viewLoading}>
              <Skeleton />
            </div>
          ) : (
            <>
              <Col xs={24} xl={16}>
                <div className={styles.JobDetailsComponent}>
                  <div className={styles.mainContainer}>
                    <Header />
                    <RadioComponent
                      Tab={Tab}
                      handleRadio={this.handleRadio}
                      tempData={tempData}
                      employeeTypeList={employeeTypeList}
                      employeeType={employeeType}
                      position={position}
                      data={data}
                      processStatus={processStatus}
                      disabled={this.disableEdit()}
                    />
                    <FieldsComponent
                      dropdownField={dropdownField}
                      candidateField={candidateField}
                      _handleSelect={this._handleSelect}
                      data={data}
                      tempData={tempData}
                      disabled={this.disableEdit()}
                    />
                    <Row style={{ margin: '0 32px 32px' }}>
                      <RenderAddQuestion page={Page.Job_Details} />
                    </Row>
                  </div>
                  {this._renderBottomBar()}
                </div>
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
      </>
    );
  }
}

export default JobDetails;
