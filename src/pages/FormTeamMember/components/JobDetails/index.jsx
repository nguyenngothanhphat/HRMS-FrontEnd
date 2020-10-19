import React, { PureComponent } from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { connect, formatMessage } from 'umi';
import { isEmpty } from 'lodash';
import Header from './components/Header';
import RadioComponent from './components/RadioComponent';
import FieldsComponent from './components/FieldsComponent';
import StepsComponent from '../StepsComponent';
import NoteComponent from '../NoteComponent';
import styles from './index.less';
// Thứ tự Fields Work Location Job Title Department Reporting Manager
@connect(({ candidateInfo: { data, checkMandatory, currentStep, tempData } = {} }) => ({
  data,
  checkMandatory,
  currentStep,
  tempData,
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

  handleRadio = (e) => {
    const { target } = e;
    const { name, value } = target;
    const { dispatch } = this.props;
    const { tempData = {} } = this.state;
    tempData[name] = value;

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
    const { tempData = {}, checkMandatory } = this.state;
    tempData[name] = value;
    const { department, title, workLocation, reportingManager, checkStatus = {}, email } = tempData;

    if (department && title && workLocation && reportingManager) {
      checkStatus.filledJobDetail = true;
    } else {
      checkStatus.filledJobDetail = false;
    }
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        tempData,
        checkMandatory: {
          ...checkMandatory,
          filledJobDetail: checkStatus.filledJobDetail,
        },
      },
    });
    if (name === 'workLocation' || name === 'jobTitle') {
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
            location: selectedWorkLocation._id,
            workLocation: selectedWorkLocation._id,
          },
        },
      });

      dispatch({
        type: 'candidateInfo/saveOrigin',
        payload: {
          company: _id,
        },
      });
      if (!isEmpty(workLocation)) {
        dispatch({
          type: 'candidateInfo/fetchDepartmentList',
          payload: {
            company: _id,
          },
        });
        dispatch({
          type: 'candidateInfo/fetchTitleList',
          payload: {
            company: _id,
          },
        });
      }
    } else if (name === 'department') {
      const { location, departmentList } = tempData;
      const changedDepartmentList = JSON.parse(JSON.stringify(departmentList));
      const selectedDepartment = changedDepartmentList.find((data) => data._id === value);
      dispatch({
        type: 'candidateInfo/save',
        payload: {
          tempData: {
            ...tempData,
            department: selectedDepartment._id,
          },
        },
      });
      if (!isEmpty(department)) {
        const departmentTemp = [department];
        const locationTemp = [location];
        dispatch({
          type: 'candidateInfo/fetchManagerList',
          payload: {
            departmentTemp,
            locationTemp,
          },
        });
      }
    }
  };

  onClickNext = () => {
    const {
      currentStep,
      data: { _id, company },
      tempData: { position, employeeType, workLocation, department, title, reportingManager },
    } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        currentStep: currentStep + 1,
      },
    });
    console.log('abc', company);
    dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        position,
        employeeType,
        workLocation,
        department,
        title,
        reportingManager,
        company,
        candidate: _id,
      },
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
          <Col span={8}>
            <div className={styles.bottomBar__button}>
              {' '}
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
            </div>
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
        name: formatMessage({ id: 'component.jobDetail.workLocation' }),
        id: 1,
        placeholder: 'Select a work location',
      },
      {
        title: 'department',
        name: formatMessage({ id: 'component.jobDetail.department' }),
        id: 2,
        placeholder: 'Select a job title',
      },
      {
        title: 'title',
        name: 'Job Title',
        id: 3,
        placeholder: 'Select a job title',
      },
      {
        title: 'reportingManager',
        name: formatMessage({ id: 'component.jobDetail.reportingManager' }),
        id: 4,
        placeholder: 'Select',
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
    } = this.state;
    return (
      <>
        <Row gutter={[24, 0]}>
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
              />
              <FieldsComponent
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
        </Row>
      </>
    );
  }
}

export default JobDetails;
