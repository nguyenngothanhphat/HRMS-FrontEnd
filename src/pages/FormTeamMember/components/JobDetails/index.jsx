import React, { PureComponent } from 'react';
import { Row, Col, Typography } from 'antd';
import { connect, formatMessage } from 'umi';
import { isEmpty, map } from 'lodash';
import Header from './components/Header';
import RadioComponent from './components/RadioComponent';
import FieldsComponent from './components/FieldsComponent';
import StepsComponent from '../StepsComponent';
import NoteComponent from '../NoteComponent';
import styles from './index.less';

@connect(
  ({
    info: { jobDetail, checkMandatory, company } = {},
    info: { departmentList, titleList, locationList, employeeTypeList, managerList } = [],
  }) => ({
    jobDetail,
    checkMandatory,
    departmentList,
    titleList,
    locationList,
    employeeTypeList,
    company,
    managerList,
  }),
)
class JobDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(props) {
    if ('jobDetail' in props) {
      return {
        jobDetail: props.jobDetail,
        departmentList: props.departmentList,
        titleList: props.titleList,
        locationList: props.locationList,
        employeeTypeList: props.employeeTypeList,
        managerList: props.managerList,
        company: props.company || {},
      };
    }
    return null;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { departmentList, titleList, locationList, employeeTypeList, jobDetail } = this.state;
    const { classification } = jobDetail;
    if (isEmpty(departmentList)) {
      dispatch({
        type: 'info/fetchDepartmentList',
        payload: {
          departmentList,
        },
      });
    }
    if (isEmpty(titleList)) {
      dispatch({
        type: 'info/fetchTitleList',
        payload: {
          titleList,
        },
      });
    }
    if (isEmpty(locationList)) {
      dispatch({
        type: 'info/fetchLocationList',
        payload: {
          locationList,
        },
      });
    }
    if (isEmpty(employeeTypeList)) {
      dispatch({
        type: 'info/fetchEmployeeTypeList',
        payload: {
          employeeTypeList,
        },
      });
      // dispatch({
      //   type: 'info/save',
      //   payload: {
      //     jobDetail: {
      //       ...jobDetail,
      //       classification: employeeTypeList[0]._id,
      //     },
      //   },
      // });
    }
    console.log('department', departmentList);
    console.log('titleList', titleList);
    console.log('location', locationList);
    console.log('employee', employeeTypeList);
  }

  handleRadio = (e) => {
    const { target } = e;
    const { name, value } = target;
    const { dispatch } = this.props;
    const { jobDetail = {} } = this.state;
    jobDetail[name] = value;

    dispatch({
      type: 'info/saveJobDetail',
      payload: {
        jobDetail,
      },
    });
  };

  _handleSelect = (value, name) => {
    const { dispatch, checkMandatory } = this.props;
    const { jobDetail = {} } = this.state;
    const {
      department,
      jobTitle,
      workLocation,
      reportingManager,
      candidatesNoticePeriod,
      prefferedDateOfJoining,
    } = jobDetail;
    jobDetail[name] = value;
    if (
      department !== '' &&
      jobTitle !== '' &&
      workLocation !== '' &&
      reportingManager !== '' &&
      candidatesNoticePeriod !== '' &&
      prefferedDateOfJoining !== ''
    ) {
      checkMandatory.filledJobDetail = true;
    } else {
      checkMandatory.filledJobDetail = false;
    }
    dispatch({
      type: 'info/saveJobDetail',
      payload: {
        jobDetail,
        checkMandatory: {
          ...checkMandatory,
        },
      },
    });
  };

  handleSelect = (value, name) => {
    const { dispatch, checkMandatory } = this.props;
    const { jobDetail = {}, departmentList, locationList, titleList, managerList } = this.state;
    jobDetail[name] = value;
    const changedWorkLocation = [...locationList];
    const checkedArr = changedWorkLocation.filter((data) => data._id === value);
    const obj = checkedArr[0];
    console.log(obj);
    const { company } = obj;
    const { _id } = company;
    console.log('id', value);
    console.log('company', _id);
    console.log(obj);
    console.log(checkedArr);

    dispatch({
      type: 'info/save',
      payload: {
        company: _id,
      },
    });
    console.log('company id', _id);
    if (!isEmpty(company)) {
      dispatch({
        type: 'info/fetchManagerList',
        payload: {
          company: _id,
        },
      });
      console.log('manager List', managerList);
    }

    // const {
    //   department,
    //   jobTitle,
    //   workLocation,
    //   reportingManager,
    //   candidatesNoticePeriod,
    //   prefferedDateOfJoining,
    // } = jobDetail;
    // if (
    //   department !== '' &&
    //   jobTitle !== '' &&
    //   workLocation !== '' &&
    //   reportingManager !== '' &&
    //   candidatesNoticePeriod !== '' &&
    //   prefferedDateOfJoining !== ''
    // ) {
    //   checkMandatory.filledJobDetail = true;
    // } else {
    //   checkMandatory.filledJobDetail = false;
    // }
    // dispatch({
    //   type: 'info/saveJobDetail',
    //   payload: {
    //     jobDetail,
    //     checkMandatory: {
    //       ...checkMandatory,
    //     },
    //   },
    // });
  };

  render() {
    const Tab = {
      positionTab: {
        title: formatMessage({ id: 'component.jobDetail.positionTab' }),
        name: 'position',
        arr: [
          { value: 1, position: formatMessage({ id: 'component.jobDetail.positionTabRadio1' }) },
          { value: 2, position: formatMessage({ id: 'component.jobDetail.positionTabRadio2' }) },
        ],
      },
      classificationTab: {
        title: formatMessage({ id: 'component.jobDetail.classificationTab' }),
        name: 'classification',
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
        title: 'department',
        name: formatMessage({ id: 'component.jobDetail.department' }),
        id: 1,
        placeholder: 'Select a job title',
      },
      {
        title: 'jobTitle',
        name: formatMessage({ id: 'component.jobDetail.jobTitle' }),
        id: 2,
        placeholder: 'Select a job title',
      },
      {
        title: 'workLocation',
        name: formatMessage({ id: 'component.jobDetail.workLocation' }),
        id: 4,
        placeholder: 'Select a work location',
      },
      {
        title: 'reportingManager',
        name: formatMessage({ id: 'component.jobDetail.reportingManager' }),
        id: 5,
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
      jobDetail,
      departmentList,
      locationList,
      employeeTypeList,
      titleList,
      managerList,
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
                jobDetail={jobDetail}
                employeeTypeList={employeeTypeList}
              />
              <FieldsComponent
                dropdownField={dropdownField}
                handleSelect={this.handleSelect}
                candidateField={candidateField}
                jobDetail={jobDetail}
                departmentList={departmentList}
                locationList={locationList}
                titleList={titleList}
                managerList={managerList}
                _handleSelect={this._handleSelect}
              />
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
