import React, { PureComponent } from 'react';
import { Row, Col, Typography } from 'antd';
import { connect, formatMessage } from 'umi';
import Header from './components/Header';
import RadioComponent from './components/RadioComponent';
import FieldsComponent from './components/FieldsComponent';
import StepsComponent from '../StepsComponent';
import NoteComponent from '../NoteComponent';
import styles from './index.less';

@connect(({ info: { jobDetail, checkMandatory } = {} }) => ({
  jobDetail,
  checkMandatory,
}))
class JobDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(props) {
    if ('jobDetail' in props) {
      return { jobDetail: props.jobDetail || {} };
    }
    return null;
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

  handleSelect = (value, name) => {
    const { dispatch, checkMandatory } = this.props;
    const { jobDetail = {} } = this.state;
    jobDetail[name] = value;
    const {
      department,
      jobTitle,
      jobCategory,
      workLocation,
      reportingManager,
      candidatesNoticePeriod,
      prefferedDateOfJoining,
    } = jobDetail;
    if (
      department !== '' &&
      jobCategory !== '' &&
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
        Option: [
          { key: 1, value: 'UX Designer' },
          { key: 2, value: 'UX Research' },
          { key: 3, value: 'Researcher' },
          { key: 4, value: 'UI Designer' },
          { key: 5, value: 'Business Analyst' },
          { key: 6, value: 'Sale Presentative' },
        ],
      },
      {
        title: 'jobTitle',
        name: formatMessage({ id: 'component.jobDetail.jobTitle' }),
        id: 2,
        placeholder: 'Select a job title',
        Option: [
          { key: 1, value: 'UX Designer' },
          { key: 2, value: 'UX Research' },
          { key: 3, value: 'Researcher' },
          { key: 4, value: 'UI Designer' },
          { key: 5, value: 'Business Analyst' },
          { key: 6, value: 'Sale Presentative' },
        ],
      },
      {
        title: 'jobCategory',
        name: formatMessage({ id: 'component.jobDetail.jobCategory' }),
        id: 3,
        placeholder: 'Select a job category',
        Option: [
          { key: 1, value: 'Test' },
          { key: 2, value: 'Dummy' },
          { key: 3, value: 'DummyText' },
          { key: 4, value: 'Abcde' },
          { key: 5, value: 'Text' },
          { key: 6, value: 'Texts' },
        ],
      },
      {
        title: 'workLocation',
        name: formatMessage({ id: 'component.jobDetail.workLocation' }),
        id: 4,
        placeholder: 'Select a work location',
        Option: [
          { key: 1, value: 'HCM City' },
          { key: 2, value: 'Dubai' },
          { key: 3, value: 'US' },
          { key: 4, value: 'AUS' },
          { key: 5, value: 'Korea' },
          { key: 6, value: 'China' },
        ],
      },
      {
        title: 'reportingManager',
        name: formatMessage({ id: 'component.jobDetail.reportingManager' }),
        id: 5,
        placeholder: 'Select',
        Option: [
          { key: 1, value: 'Project Manager' },
          { key: 2, value: 'Dummy' },
          { key: 3, value: 'Test' },
          { key: 4, value: 'Product Manager' },
          { key: 5, value: 'Project Leader' },
          { key: 6, value: 'Senior' },
        ],
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
    const { jobDetail } = this.state;
    return (
      <>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={16} xl={16}>
            <div className={styles.JobDetailsComponent}>
              <Header />
              <RadioComponent Tab={Tab} handleRadio={this.handleRadio} jobDetail={jobDetail} />
              <FieldsComponent
                dropdownField={dropdownField}
                handleSelect={this.handleSelect}
                candidateField={candidateField}
                jobDetail={jobDetail}
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
