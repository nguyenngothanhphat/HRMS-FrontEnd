import React, { PureComponent } from 'react';
import { Row, Col, Typography } from 'antd';
import { connect, formatMessage } from 'umi';
import { isEmpty } from 'lodash';
import { PageLoading } from '@/layouts/layout/src';
import Header from './components/Header';
import StepsComponent from '../StepsComponent';
import NoteComponent from '../NoteComponent';
import FieldsComponent from './components/FieldsComponent';
import styles from './index.less';
// Thứ tự Fields Work Location Job Title Department Reporting Manager
@connect(({ candidateProfile: { jobDetails } = {} }) => ({
  jobDetails,
}))
class JobDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(props) {
    if ('jobDetails' in props) {
      return {
        jobDetails: props.jobDetails,
      };
    }
    return null;
  }

  // componentDidMount() {
  //   const { dispatch } = this.props;
  //   const { locationList, employeeTypeList, loadingC, loadingD } = this.state;

  //   if (isEmpty(locationList)) {
  //     dispatch({
  //       type: 'info/fetchLocationList',
  //       payload: {
  //         locationList,
  //         loadingC,
  //       },
  //     });
  //   }
  //   if (isEmpty(employeeTypeList)) {
  //     dispatch({
  //       type: 'info/fetchEmployeeTypeList',
  //       payload: {
  //         employeeTypeList,
  //         loadingD,
  //       },
  //     });
  //   }
  // }

  _handleSelect = (value, name) => {
    const { dispatch, checkMandatory } = this.props;
    const { jobDetails = {} } = this.state;
    jobDetails[name] = value;
    const { department, title, workLocation, reportingManager } = jobDetails;

    if (department !== '' && title !== '' && workLocation !== '' && reportingManager !== '') {
      checkMandatory.filledJobDetail = true;
    } else {
      checkMandatory.filledJobDetail = false;
    }
    dispatch({
      type: 'info/save',
      payload: {
        jobDetails,
        checkMandatory: {
          ...checkMandatory,
        },
      },
    });
  };

  render() {
    const Tab = {
      positionTab: {
        title: formatMessage({ id: 'component.jobDetail.positionTab' }),
        name: 'position',
      },
      classificationTab: {
        title: formatMessage({ id: 'component.jobDetail.classificationTab' }),
        name: 'employeeType',
      },
    };
    const HRField = [
      {
        title: 'workLocation',
        name: formatMessage({ id: 'component.jobDetail.workLocation' }),
        id: 1,
      },
      {
        title: 'department',
        name: formatMessage({ id: 'component.jobDetail.department' }),
        id: 2,
      },
      {
        title: 'title',
        name: 'Job Title',
        id: 3,
      },
      {
        title: 'reportingManager',
        name: formatMessage({ id: 'component.jobDetail.reportingManager' }),
        id: 4,
      },
    ];
    const candidateField = [
      {
        title: `candidatesNoticePeriod`,
        name: formatMessage({ id: 'component.jobDetail.candidateNoticePeriod' }),
        id: 1,
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
    const { jobDetails } = this.state;
    return (
      <div className={styles.JobDetailsComponent}>
        {/* {loading === true ? (
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={16} xl={16}>
              <PageLoading />
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
        ) : ( */}
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={16} xl={16}>
            <div className={styles.JobDetailsComponent}>
              <Header />
              <FieldsComponent
                Tab={Tab}
                jobDetails={jobDetails}
                HRField={HRField}
                candidateField={candidateField}
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
        {/* )} */}
      </div>
    );
  }
}

export default JobDetails;
