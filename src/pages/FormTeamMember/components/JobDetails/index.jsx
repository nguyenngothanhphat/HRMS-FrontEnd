import React, { PureComponent } from 'react';
import { Form, Select, Radio, Row, Col, DatePicker } from 'antd';
import Header from './components/Header/';
import RadioComponent from './components/RadioComponent/';
import FieldsComponent from './components/FieldsComponent/';
import styles from './index.less';
const { Option } = Select;

export default class JobDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isToggle: false,
    };
  }
  handleSubmit = (e) => {
    e.preventDefault();
  };
  handleSwitch = () => {
    this.setState((prevState) => ({
      isToggle: !prevState.isToggle,
    }));
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
      { title: 'Job title', value: 2, placeholder: 'Select a job title', Option: [] },
      { title: 'Job category', value: 3, placeholder: 'Select a job category', Option: [] },
      { title: 'Work location', value: 4, placeholder: 'Select a work location', Option: [] },
      { title: 'Reporting Manager', value: 5, placeholder: 'Select', Option: [] },
      { title: `Candidate's notice Period`, value: 6, placeholder: 'Time period', Option: [] },
      { title: 'Preferred date of joining', value: 7 },
    ];
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
          <Col span={8}>asdasd</Col>
        </Row>
      </>
    );
  }
}
