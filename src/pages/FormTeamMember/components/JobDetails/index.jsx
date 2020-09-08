import React, { PureComponent } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ModalUpload from '@/components/ModalUpload';
import { Select, Radio, Row, Col, DatePicker } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import Header from './components/Header/';
import RadioComponent from './components/RadioComponent/';
import FieldsComponent from './components/FieldsComponent/';
import styles from './index.less';
const { Option } = Select;

export default class JobDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
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
          'UX Designer',
          'UX Research',
          'Researcher',
          'UI Designer',
          'Business Analyst',
          'Sale Presentative',
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
      <div className={styles.JobDetailsComponent}>
        <Header />
        <RadioComponent Tab={Tab} />
        <FieldsComponent dropdownField={dropdownField} />
      </div>
    );
  }
}
