import React, { PureComponent } from 'react';
import { Row, Col, Typography, Button, Spin } from 'antd';
import { connect, formatMessage } from 'umi';
import { isEmpty, isObject } from 'lodash';
import Header from './components/Header';
import RadioComponent from './components/RadioComponent';
import FieldsComponent from './components/FieldsComponent';
import StepsComponent from '../StepsComponent';
import NoteComponent from '../NoteComponent';
import PROCESS_STATUS from '../utils';
import styles from './index.less';
// Thứ tự Fields Work Location Job Title Department Reporting Manager
@connect(({ candidateInfo: { data, checkMandatory, currentStep, tempData } = {}, loading }) => ({
  data,
  checkMandatory,
  currentStep,
  tempData,
  loading1: loading.effects['candidateInfo/fetchDepartmentList'],
  loading2: loading.effects['candidateInfo/fetchTitleList'],
  loading3: loading.effects['candidateInfo/fetchManagerList'],
  loading4: loading.effects['candidateInfo/fetchCandidateByRookie'],
}))
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
      currentStep,
    } = this.props;

    window.scrollTo(0, 70); // Back to top of the page

    this.checkBottomBar();

    if (processStatus === 'DRAFT') {
      if (candidate) {
        dispatch({
          type: 'candidateInfo/updateByHR',
          payload: {
            candidate,
            currentStep: 1,
          },
        });
      }
    }
    // window.addEventListener('unload', this.handleUnload, false);
  }

  componentWillUnmount() {
    const { tempData: { cancelCandidate = false } = {} } = this.props;
    if (!cancelCandidate) {
      this.handleUpdateByHR();
    }
    // window.removeEventListener('unload', this.handleUnload, false);
  }

  // handleUnload = () => {
  //   // this.handleUpdateByHR();
  //   const { currentStep } = this.props;
  //   localStorage.setItem('currentStep', currentStep);
  // };

  disableEdit = () => {
    const {
      data: { processStatus = '' },
    } = this.props;
    const { PROVISIONAL_OFFER_DRAFT, FINAL_OFFERS_DRAFT, SENT_PROVISIONAL_OFFERS } = PROCESS_STATUS;
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
        // currentStep,
      },
    });
    const { PROVISIONAL_OFFER_DRAFT } = PROCESS_STATUS;
    if (processStatus === PROVISIONAL_OFFER_DRAFT) {
      dispatch({
        type: 'candidateInfo/updateByHR',
        payload: {
          candidate: _id,
          currentStep,
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
    console.log(name, value);
    tempData[name] = {
      _id: value,
    };

    dispatch({
      type: 'candidateInfo/save',
      payload: {
        tempData: {
          ...tempData,
        },
      },
    });
  };

  _handleSelect = (value, name) => {
    const { dispatch, locationList } = this.props;
    const { tempData = {} } = this.state;
    tempData[name] = value;
    const { department, workLocation } = tempData;

    if (name === 'workLocation') {
      const changedWorkLocation = JSON.parse(JSON.stringify(locationList));
      const selectedWorkLocation = changedWorkLocation.find((data) => data._id === value);
      const {
        company: { _id },
      } = selectedWorkLocation;
      dispatch({
        type: 'candidateInfo/save',
        payload: {
          tempData: {
            ...tempData,
            company: _id,
            location: selectedWorkLocation,
            workLocation: selectedWorkLocation,
          },
        },
      });

      if (!isEmpty(workLocation)) {
        dispatch({
          type: 'candidateInfo/fetchDepartmentList',
          payload: {
            company: _id,
          },
        });

        // dispatch({
        //   type: 'candidateInfo/fetchTitleList',
        //   payload: {
        //     company: _id,
        //   },
        // });

        // if (!isEmpty(department)) {
        //   dispatch({
        //     type: 'candidateInfo/fetchTitleList',
        //     payload: {
        //       department: department._id,
        //     },
        //   });
        // }
      }
    } else if (name === 'title') {
      const {
        tempData: { titleList },
      } = this.props;
      const changedtitleList = JSON.parse(JSON.stringify(titleList));
      const selectedTitle = changedtitleList.find((data) => data._id === value);
      dispatch({
        type: 'candidateInfo/save',
        payload: {
          tempData: {
            ...tempData,
            title: selectedTitle,
          },
        },
      });
    } else if (name === 'department') {
      const { location, departmentList } = tempData;
      const changedDepartmentList = JSON.parse(JSON.stringify(departmentList));
      const selectedDepartment = changedDepartmentList.find((data) => data._id === value);
      dispatch({
        type: 'candidateInfo/save',
        payload: {
          tempData: {
            ...tempData,
            department: selectedDepartment,
          },
        },
      });

      if (!isEmpty(department)) {
        const departmentTemp = [department];
        const locationTemp = [location._id];
        dispatch({
          type: 'candidateInfo/fetchManagerList',
          payload: {
            department: departmentTemp,
            // locationTemp,
          },
        });
        dispatch({
          type: 'candidateInfo/fetchTitleList',
          payload: {
            department,
          },
        });
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
                    processStatus={processStatus}
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
