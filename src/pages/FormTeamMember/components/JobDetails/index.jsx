import React, { PureComponent } from 'react';
import { Form, Select, Radio, Row, Col, DatePicker, Button, Typography } from 'antd';
import Header from './components/Header';
import RadioComponent from './components/RadioComponent';
import FieldsComponent from './components/FieldsComponent';
import StepsComponent from '../StepsComponent';
import NoteComponent from '../NoteComponent';
import styles from './index.less';
import { connect } from 'umi';
const { Option } = Select;

@connect(({ info: { basicInformation, checkMandatory } = {} }) => ({
  basicInformation,
  checkMandatory,
}))
export default class JobDetails extends PureComponent {
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

  handleSelect = (value, name) => {
    const { dispatch, checkMandatory } = this.props;
    const { jobDetail = {} } = this.state;
    jobDetail[name] = value;
    const {
      position,
      classification,
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
    // console.log(e, name);

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
        title: 'Position',
        arr: [
          { value: 1, position: 'Employee' },
          { value: 2, position: 'Contingent worker' },
        ],
      },
      classificationTab: {
        title: 'Classification',
        arr: [
          { value: 1, classification: 'Full-Time (Employee working more than 30 hours a week)' },
          { value: 2, classification: 'Part-Time (Employee working less than 30 hours a week)' },
          {
            value: 3,
            classification: 'Internship (A student or trainee participating in an internship)',
          },
        ],
      },
    };
    const dropdownField = [
      {
        title: 'department',
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
        title: 'Job title',
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
        title: 'Job category',
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
        title: 'Work location',
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
        title: 'Reporting Manager',
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
      // {
      //   title: `Candidate's notice Period`,
      //   id: 6,
      //   placeholder: 'Time period',
      //   Option: [
      //     { key: 1, value: 'Test' },
      //     { key: 2, value: 'ABCD' },
      //     { key: 3, value: 'Testing' },
      //     { key: 4, value: '10AM' },
      //     { key: 5, value: '5PM' },
      //     { key: 6, value: 'For Hours' },
      //   ],
      // },
      // { title: 'Preferred date of joining', id: 7 },
    ];
    const Note = {
      title: 'Note',
      data: (
        <Typography.Text>
          Onboarding is a step-by-step process. It takes anywhere around <span>9-12 standard</span>{' '}
          working days for entire process to complete
        </Typography.Text>
      ),
    };
    return (
      <>
        <Row gutter={[24, 0]}>
          <Col span={16}>
            <div className={styles.JobDetailsComponent}>
              <Header />
              <RadioComponent Tab={Tab} />
              <FieldsComponent dropdownField={dropdownField} handleSelect={this.handleSelect} />
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.rightWrapper}>
              <Row>
                <NoteComponent note={Note} />
              </Row>
              <Row style={{ width: '322px' }}>
                <StepsComponent />
              </Row>
            </div>
          </Col>
        </Row>
      </>
    );
  }
}
