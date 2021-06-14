import React, { PureComponent } from 'react';
import { Row, Col, Typography, Button, Spin } from 'antd';
import { connect, formatMessage } from 'umi';
import { isEmpty, isObject } from 'lodash';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import Header from './components/Header';
import RadioComponent from './components/RadioComponent';
import FieldsComponent from './components/FieldsComponent';
import StepsComponent from '../StepsComponent';
import NoteComponent from '../NoteComponent';
import PROCESS_STATUS from '../utils';
import styles from './index.less';
// Thứ tự Fields Work Location Job Title Department Reporting Manager
@connect(
  ({
    candidateInfo: { data, checkMandatory, currentStep, tempData } = {},
    loading,
    locationSelection: { listLocationsByCompany = [] } = {},
    user: { companiesOfUser = [] } = {},
  }) => ({
    data,
    checkMandatory,
    currentStep,
    tempData,
    listLocationsByCompany,
    companiesOfUser,
    loading1: loading.effects['candidateInfo/fetchDepartmentList'],
    loading2: loading.effects['candidateInfo/fetchTitleList'],
    loading3: loading.effects['candidateInfo/fetchManagerList'],
    loading4: loading.effects['candidateInfo/fetchCandidateByRookie'],
  }),
)
class JobDetails extends PureComponent {
  static getDerivedStateFromProps(props) {
    if ('data' in props) {
      return {
        data: props.data,
        checkMandatory: props.checkMandatory,
        currentStep: props.currentStep,
        tempData: props.tempData,
      };
    }
    return null;
  }

  componentDidMount() {
    const {
      dispatch,
      data: { candidate, processStatus },
      // tempData = {},
      // tempData: { employeeTypeList = [] } = {},
    } = this.props;

    const companyId = getCurrentCompany(getCurrentTenant);
    const tenantId = getCurrentTenant();

    window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page

    this.checkBottomBar();

    // get work location list
    dispatch({
      type: 'candidateInfo/fetchLocationList',
      payload: {
        company: companyId,
        tenantId,
      },
    });

    // dispatch({
    //   type: 'candidateInfo/save',
    //   payload: {
    //     tempData: {
    //       ...tempData,
    //       employeeType: {
    //         _id: employeeTypeList[0]?._id,
    //         name: employeeTypeList[0]?.name,
    //       },
    //     },
    //   },
    // });

    if (processStatus === 'DRAFT') {
      if (candidate) {
        dispatch({
          type: 'candidateInfo/updateByHR',
          payload: {
            candidate,
            currentStep: 1,
            tenantId: getCurrentTenant(),
          },
        });
      }
    }
    // window.addEventListener('unload', this.handleUnload, false);
  }

  // componentWillUnmount() {
  //   const { tempData: { cancelCandidate = false } = {} } = this.props;
  //   if (!cancelCandidate) {
  //     this.handleUpdateByHR();
  //   }
  //   // window.removeEventListener('unload', this.handleUnload, false);
  // }

  // handleUnload = () => {
  //   // this.handleUpdateByHR();
  //   const { currentStep } = this.props;
  //   localStorage.setItem('currentStep', currentStep);
  // };

  disableEdit = () => {
    const {
      data: { processStatus = '' },
    } = this.props;
    const { PROVISIONAL_OFFER_DRAFT, FINAL_OFFERS_DRAFT } = PROCESS_STATUS;
    if (processStatus === PROVISIONAL_OFFER_DRAFT || processStatus === FINAL_OFFERS_DRAFT) {
      return false;
    }
    return true;
  };

  handleUpdateByHR = () => {
    const {
      dispatch,
      currentStep,
      tempData: { department, workLocation, title, reportingManager, position, employeeType, _id },
      data: { processStatus = '' } = {},
    } = this.props;
    dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        workLocation: workLocation ? workLocation._id : '',
        department: department ? department._id : '',
        title: title ? title._id : '',
        reportingManager: !isEmpty(reportingManager) ? reportingManager._id : '',
        employeeType: isObject(employeeType) ? employeeType._id : employeeType,
        position,
        candidate: _id,
        tenantId: getCurrentTenant(),

        // currentStep,
      },
    });
    const { PROVISIONAL_OFFER_DRAFT } = PROCESS_STATUS;
    if (processStatus === PROVISIONAL_OFFER_DRAFT) {
      dispatch({
        type: 'candidateInfo/updateByHR',
        payload: {
          candidate: _id,
          tenantId: getCurrentTenant(),
          currentStep: currentStep + 1,
        },
      });
    }
  };

  checkBottomBar = () => {
    const {
      tempData: { department, workLocation, title, reportingManager, checkStatus },
      checkMandatory,
      dispatch,
    } = this.props;

    if (
      department !== null &&
      workLocation !== null &&
      title !== null &&
      reportingManager !== null
    ) {
      checkStatus.filledJobDetail = true;
    } else {
      checkStatus.filledJobDetail = false;
    }
    dispatch({
      type: 'candidateInfo/save',
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
    const { tempData = {} } = this.state;

    if (name === 'position') {
      tempData[name] = value;
    } else {
      tempData[name] = {
        _id: value,
      };
    }

    // console.log(`${name}]: ${value}`);
    // console.log(tempData[name]);

    // console.log({
    //   ...tempData,
    // });

    dispatch({
      type: 'candidateInfo/save',
      payload: {
        tempData: {
          ...tempData,
        },
      },
    });
  };

  _handleSelect = async (value, name) => {
    const { dispatch, locationList } = this.props;
    const { tempData = {} } = this.state;
    tempData[name] = value;
    const { department, workLocation, title } = tempData;
    const companyId = getCurrentCompany();
    const tenantId = getCurrentTenant();

    // const locationPayload = listLocationsByCompany.map(
    //   ({ headQuarterAddress: { country: countryItem1 = '' } = {} }) => {
    //     let stateList = [];
    //     listLocationsByCompany.forEach(
    //       ({ headQuarterAddress: { country: countryItem2 = '', state: stateItem2 = '' } = {} }) => {
    //         if (countryItem1 === countryItem2) {
    //           stateList = [...stateList, stateItem2];
    //         }
    //       },
    //     );
    //     return {
    //       country: countryItem1,
    //       state: stateList,
    //     };
    //   },
    // );

    if (name === 'workLocation') {
      const changedWorkLocation = JSON.parse(JSON.stringify(locationList));
      const selectedWorkLocation = changedWorkLocation.find((data) => data._id === value);

      if (value === undefined) {
        await dispatch({
          type: 'candidateInfo/save',
          payload: {
            tempData: {
              ...tempData,
              workLocation: null,
            },
          },
        });
      } else {
        dispatch({
          type: 'candidateInfo/save',
          payload: {
            tempData: {
              ...tempData,
              company: companyId,
              location: selectedWorkLocation,
              workLocation: selectedWorkLocation,
            },
          },
        });

        if (!isEmpty(workLocation)) {
          dispatch({
            type: 'candidateInfo/fetchDepartmentList',
            payload: {
              company: companyId,
              tenantId,
            },
          });
        }
      }
    } else if (name === 'title') {
      const {
        tempData: { titleList },
      } = this.props;
      const changedtitleList = JSON.parse(JSON.stringify(titleList));
      const selectedTitle = changedtitleList.find((data) => data._id === value);

      if (value === undefined) {
        await dispatch({
          type: 'candidateInfo/save',
          payload: {
            tempData: {
              ...tempData,
              title: null,
            },
          },
        });
      } else {
        dispatch({
          type: 'candidateInfo/save',
          payload: {
            tempData: {
              ...tempData,
              title: selectedTitle,
            },
          },
        });

        if (!isEmpty(title)) {
          dispatch({
            type: 'candidateInfo/fetchManagerList',
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
      const { departmentList } = tempData;
      const changedDepartmentList = JSON.parse(JSON.stringify(departmentList));
      const selectedDepartment = changedDepartmentList.find((data) => data._id === value) || {};

      if (value === undefined) {
        await dispatch({
          type: 'candidateInfo/save',
          payload: {
            tempData: {
              ...tempData,
              department: null,
            },
          },
        });
      } else {
        dispatch({
          type: 'candidateInfo/save',
          payload: {
            tempData: {
              ...tempData,
              company: companyId,
              department: selectedDepartment, // {}
            },
          },
        });

        if (!isEmpty(department)) {
          // const departmentTemp = [department];
          // const locationTemp = [location._id];
          dispatch({
            type: 'candidateInfo/fetchTitleList',
            payload: {
              department,
              tenantId,
            },
          });
          await dispatch({
            type: 'candidateInfo/save',
            payload: {
              tempData: {
                ...tempData,
                title: null,
                department: selectedDepartment,
              },
            },
          });
        }
      }
    }
    if (name === 'reportingManager') {
      const { managerList } = tempData;
      const changedManagerList = JSON.parse(JSON.stringify(managerList));
      // const selectedManager = changedManagerList.find((data) => data._id === value);
      const selectedManager = changedManagerList.find(
        (data) => data.generalInfo.firstName === value,
      );

      dispatch({
        type: 'candidateInfo/save',
        payload: {
          tempData: {
            ...tempData,
            reportingManager: selectedManager,
          },
        },
      });
    }

    if (name === 'prefferedDateOfJoining') {
      const { prefferedDateOfJoining } = tempData;
      dispatch({
        type: 'candidateInfo/save',
        payload: {
          tempData: {
            ...tempData,
            prefferedDateOfJoining,
          },
        },
      });
    }
    this.checkBottomBar();
  };

  onClickNext = () => {
    const {
      currentStep,
      data: { _id },
      tempData: { position, employeeType, workLocation, department, title, reportingManager },
    } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        position,
        employeeType: employeeType ? employeeType._id : '',
        workLocation: workLocation ? workLocation._id : '',
        department: department ? department._id : '',
        title: title ? title._id : '',
        reportingManager: reportingManager ? reportingManager._id : '',
        candidate: _id,
        currentStep: currentStep + 1,
        tenantId: getCurrentTenant(),
      },
    }).then(({ data, statusCode }) => {
      if (statusCode === 200) {
        dispatch({
          type: 'candidateInfo/save',
          payload: {
            currentStep: data.currentStep,
          },
        });
      }
    });
  };

  _renderStatus = () => {
    const { checkMandatory } = this.props;
    const { filledJobDetail } = checkMandatory;
    return !filledJobDetail ? (
      <div className={styles.normalText}>
        <div className={styles.redText}>*</div>
        {formatMessage({ id: 'component.bottomBar.mandatoryUnfilled' })}
      </div>
    ) : (
      <div className={styles.greenText}>
        * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
      </div>
    );
  };

  onClickPrev = () => {
    const { currentStep } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        currentStep: currentStep - 1,
      },
    });
  };

  _renderBottomBar = () => {
    const { checkMandatory } = this.props;
    const { filledJobDetail } = checkMandatory;

    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={16}>
            <div className={styles.bottomBar__status}>{this._renderStatus()}</div>
          </Col>
          <Col className={styles.bottomBar__button} span={8}>
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
            >
              Next
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
            classification: formatMessage({ id: 'component.jobDetail.classificationRadio1' }),
          },
          {
            value: 2,
            classification: formatMessage({ id: 'component.jobDetail.classificationRadio2' }),
          },
          {
            value: 3,
            classification: formatMessage({ id: 'component.jobDetail.classificationRadio3' }),
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
        title: 'reportingManager',
        name: `${formatMessage({ id: 'component.jobDetail.reportingManager' })}*`,
        id: 4,
        placeholder: 'Select a reporting manager',
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
    const Note = {
      title: formatMessage({ id: 'component.noteComponent.title' }),
      data: (
        <Typography.Text>
          Onboarding is a step-by-step process. It takes anywhere around <span>9-12 standard</span>{' '}
          working days for entire process to complete
        </Typography.Text>
      ),
    };
    const {
      tempData,
      tempData: {
        employeeTypeList,
        departmentList,
        locationList,
        titleList,
        managerList,
        position,
        employeeType,
        department,
        title,
        workLocation,
        reportingManager,
        prefferedDateOfJoining,
        candidatesNoticePeriod,
      },
      data,
    } = this.state;
    const { loading1, loading2, loading3, loading, loading4, processStatus } = this.props;
    return (
      <>
        <Row gutter={[24, 0]}>
          {loading4 || loading ? (
            <div className={styles.viewLoading}>
              <Spin />
            </div>
          ) : (
            <>
              <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                <div className={styles.JobDetailsComponent}>
                  <Header />
                  <RadioComponent
                    Tab={Tab}
                    handleRadio={this.handleRadio}
                    tempData={tempData}
                    employeeTypeList={employeeTypeList}
                    employeeType={employeeType}
                    position={position}
                    data={data}
                    // processStatus={processStatus}
                    disabled={this.disableEdit()}
                  />
                  <FieldsComponent
                    processStatus={processStatus}
                    dropdownField={dropdownField}
                    candidateField={candidateField}
                    departmentList={departmentList}
                    locationList={locationList}
                    titleList={titleList}
                    managerList={managerList}
                    department={department}
                    workLocation={workLocation}
                    title={title}
                    reportingManager={reportingManager}
                    candidatesNoticePeriod={candidatesNoticePeriod}
                    prefferedDateOfJoining={prefferedDateOfJoining}
                    _handleSelect={this._handleSelect}
                    loading1={loading1}
                    loading2={loading2}
                    loading3={loading3}
                    data={data}
                    tempData={tempData}
                    disabled={this.disableEdit()}
                  />
                  {this._renderBottomBar()}
                </div>
              </Col>
              <Col className={styles.RightComponents} xs={24} sm={24} md={24} lg={8} xl={8}>
                <div className={styles.rightWrapper}>
                  <Row>
                    <NoteComponent note={Note} />
                  </Row>
                  <Row className={styles.stepRow}>
                    <StepsComponent />
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
