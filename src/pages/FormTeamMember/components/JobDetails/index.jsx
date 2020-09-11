import React, { PureComponent } from 'react';
import { Form, Select, Radio, Row, Col, DatePicker, Button, Typography } from 'antd';
import Header from './components/Header';
import RadioComponent from './components/RadioComponent';
import FieldsComponent from './components/FieldsComponent';
import StepsComponent from '../StepsComponent';
import NoteComponent from '../NoteComponent';
import styles from './index.less';

const { Option } = Select;

export default class JobDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isValid: false,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
  };

  handleButton = () => {
    this.setState({
      isValid: true,
    });
  };

  render() {
    const { isValid } = this.state;
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
        title: 'Department',
        value: 1,
        placeholder: 'Select a job title',
        Option: [
          { key: 1, name: 'UX Designer' },
          { key: 2, name: 'UX Research' },
          { key: 3, name: 'Researcher' },
          { key: 4, name: 'UI Designer' },
          { key: 5, name: 'Business Analyst' },
          { key: 6, name: 'Sale Presentative' },
        ],
      },
      {
        title: 'Job title',
        value: 2,
        placeholder: 'Select a job title',
        Option: [
          { key: 1, name: 'UX Designer' },
          { key: 2, name: 'UX Research' },
          { key: 3, name: 'Researcher' },
          { key: 4, name: 'UI Designer' },
          { key: 5, name: 'Business Analyst' },
          { key: 6, name: 'Sale Presentative' },
        ],
      },
      {
        title: 'Job category',
        value: 3,
        placeholder: 'Select a job category',
        Option: [
          { key: 1, name: 'Test' },
          { key: 2, name: 'Dummy' },
          { key: 3, name: 'DummyText' },
          { key: 4, name: 'Abcde' },
          { key: 5, name: 'Text' },
          { key: 6, name: 'Texts' },
        ],
      },
      {
        title: 'Work location',
        value: 4,
        placeholder: 'Select a work location',
        Option: [
          { key: 1, name: 'HCM City' },
          { key: 2, name: 'Dubai' },
          { key: 3, name: 'US' },
          { key: 4, name: 'AUS' },
          { key: 5, name: 'Korea' },
          { key: 6, name: 'China' },
        ],
      },
      {
        title: 'Reporting Manager',
        value: 5,
        placeholder: 'Select',
        Option: [
          { key: 1, name: 'Project Manager' },
          { key: 2, name: 'Dummy' },
          { key: 3, name: 'Test' },
          { key: 4, name: 'Product Manager' },
          { key: 5, name: 'Project Leader' },
          { key: 6, name: 'Senior' },
        ],
      },
      {
        title: `Candidate's notice Period`,
        value: 6,
        placeholder: 'Time period',
        Option: [
          { key: 1, name: 'Test' },
          { key: 2, name: 'ABCD' },
          { key: 3, name: 'Testing' },
          { key: 4, name: '10AM' },
          { key: 5, name: '5PM' },
          { key: 6, name: 'For Hours' },
        ],
      },
      { title: 'Preferred date of joining', value: 7 },
    ];
    const Steps = {
      title: 'Complete onboarding process at a glance',
      keyPage: [{ key: 1, data: `Prepare the new candidate's offer letter` }],
    };
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
              <Form onSubmit={this.handleSubmit}>
                <Header />
                <RadioComponent Tab={Tab} />
                <FieldsComponent handleSwitch={this.handleSwitch} dropdownField={dropdownField} />
              </Form>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.rightWrapper}>
              <Row>
                <NoteComponent note={Note} />
              </Row>
              <hr />
              <Row>
                <StepsComponent Steps={Steps} />
              </Row>
            </div>
          </Col>
        </Row>
      </>
    );
  }
}
